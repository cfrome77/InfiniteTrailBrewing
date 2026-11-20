/**
 * @jest-environment node
 */
import {
  sendNewsletter,
  getSubscriberCount,
  getResendStats,
} from "../../app/actions/send-newsletter";

const mockRequireAdmin = jest.fn();
const mockFetch = jest.fn();
const mockBatchSend = jest.fn();
const mockEmailsList = jest.fn();
const mockGetResendClient = jest.fn();

jest.mock("server-only", () => ({}));

jest.mock("../../lib/admin-auth", () => ({
  requireAdmin: () => mockRequireAdmin(),
}));

jest.mock("../../lib/resend", () => ({
  getResendClient: () => mockGetResendClient(),
}));

jest.mock("../../lib/sanity.server", () => ({
  serverClient: {
    fetch: (...args: unknown[]) => mockFetch(...args),
  },
}));

jest.mock("../../lib/newsletter-utils", () => ({
  transformPortableTextToEmailHtml: () => "<p>body</p>",
}));

const resendClient = {
  emails: {
    list: (...args: unknown[]) => mockEmailsList(...args),
  },
  batch: {
    send: (...args: unknown[]) => mockBatchSend(...args),
  },
};

describe("send-newsletter actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetResendClient.mockReturnValue(resendClient);
  });

  describe("authorization", () => {
    it("blocks sendNewsletter for unauthenticated callers before any fetch", async () => {
      mockRequireAdmin.mockRejectedValue(new Error("Unauthorized"));

      await expect(sendNewsletter("post-1")).rejects.toThrow(/Unauthorized/);
      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockBatchSend).not.toHaveBeenCalled();
    });

    it("blocks getSubscriberCount for unauthenticated callers", async () => {
      mockRequireAdmin.mockRejectedValue(new Error("Unauthorized"));

      await expect(getSubscriberCount()).rejects.toThrow(/Unauthorized/);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("blocks getResendStats for unauthenticated callers", async () => {
      mockRequireAdmin.mockRejectedValue(new Error("Unauthorized"));

      await expect(getResendStats()).rejects.toThrow(/Unauthorized/);
      expect(mockEmailsList).not.toHaveBeenCalled();
    });
  });

  describe("missing email configuration", () => {
    it("returns a clear message instead of crashing when Resend is unconfigured", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockGetResendClient.mockReturnValue(null);

      const result = await sendNewsletter("post-1");

      expect(result).toEqual({
        success: false,
        message: "Email is not configured (RESEND_API_KEY missing).",
      });
      expect(mockBatchSend).not.toHaveBeenCalled();
    });

    it("returns null from getResendStats rather than throwing", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockGetResendClient.mockReturnValue(null);

      await expect(getResendStats()).resolves.toBeNull();
    });
  });

  describe("sendNewsletter", () => {
    it("returns not-found for an unknown post", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch.mockResolvedValueOnce(null);

      const result = await sendNewsletter("missing");

      expect(result).toEqual({ success: false, message: "Post not found" });
      expect(mockBatchSend).not.toHaveBeenCalled();
    });

    it("returns a message when there are no active subscribers", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch
        .mockResolvedValueOnce({ _id: "post-1", title: "T", excerpt: "E" })
        .mockResolvedValueOnce([]);

      const result = await sendNewsletter("post-1");

      expect(result).toEqual({ success: false, message: "No active subscribers found" });
      expect(mockBatchSend).not.toHaveBeenCalled();
    });
    it("sends one batch containing every subscriber with a List-Unsubscribe header", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch
        .mockResolvedValueOnce({ _id: "post-1", title: "Big News", excerpt: "E" })
        .mockResolvedValueOnce([
          { email: "a@example.com", token: "tok-a" },
          { email: "b@example.com", token: "tok-b" },
        ]);
      mockBatchSend.mockResolvedValue({ data: { data: [{ id: "1" }, { id: "2" }] }, error: null });

      const result = await sendNewsletter("post-1");

      // One API call for the whole chunk, not one per subscriber.
      expect(mockBatchSend).toHaveBeenCalledTimes(1);
      const payload = mockBatchSend.mock.calls[0][0];
      expect(payload).toHaveLength(2);
      expect(payload[0].to).toBe("a@example.com");
      expect(payload[0].headers["List-Unsubscribe"]).toContain("token=tok-a");
      expect(payload[1].headers["List-Unsubscribe"]).toContain("token=tok-b");
      expect(result.success).toBe(true);
      expect(result.message).toContain("2 successful, 0 failed");
    });

    it("splits large lists into batches of at most 100", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      const many = Array.from({ length: 250 }, (_, i) => ({
        email: `s${i}@example.com`,
        token: `tok-${i}`,
      }));
      mockFetch
        .mockResolvedValueOnce({ _id: "post-1", title: "T", excerpt: "E" })
        .mockResolvedValueOnce(many);
      mockBatchSend.mockResolvedValue({ data: { data: [] }, error: null });

      const result = await sendNewsletter("post-1");

      expect(mockBatchSend).toHaveBeenCalledTimes(3);
      const sizes = mockBatchSend.mock.calls.map((c) => c[0].length);
      expect(sizes).toEqual([100, 100, 50]);
      expect(result.message).toContain("250 successful, 0 failed");
    });

    it("counts per-email errors reported by a permissive batch", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch
        .mockResolvedValueOnce({ _id: "post-1", title: "T", excerpt: "E" })
        .mockResolvedValueOnce([
          { email: "a@example.com", token: "tok-a" },
          { email: "b@example.com", token: "tok-b" },
        ]);
      mockBatchSend.mockResolvedValue({
        data: { data: [{ id: "1" }], errors: [{ index: 1, message: "invalid" }] },
        error: null,
      });

      const result = await sendNewsletter("post-1");

      expect(result.success).toBe(true);
      expect(result.message).toContain("1 successful, 1 failed");
    });

    it("counts every address in a chunk as failed when the batch call errors", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch
        .mockResolvedValueOnce({ _id: "post-1", title: "T", excerpt: "E" })
        .mockResolvedValueOnce([
          { email: "a@example.com", token: "tok-a" },
          { email: "b@example.com", token: "tok-b" },
        ]);
      mockBatchSend.mockResolvedValue({ data: null, error: { message: "boom" } });

      const result = await sendNewsletter("post-1");

      expect(result.success).toBe(true);
      expect(result.message).toContain("0 successful, 2 failed");
    });

    it("skips subscribers with no unsubscribe token instead of sending a broken link", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch
        .mockResolvedValueOnce({ _id: "post-1", title: "T", excerpt: "E" })
        .mockResolvedValueOnce([
          { email: "ok@example.com", token: "tok-a" },
          { email: "studio-added@example.com" },
        ]);
      mockBatchSend.mockResolvedValue({ data: { data: [{ id: "1" }] }, error: null });

      const result = await sendNewsletter("post-1");

      const payload = mockBatchSend.mock.calls[0][0];
      expect(payload).toHaveLength(1);
      expect(payload[0].to).toBe("ok@example.com");
      expect(result.message).toContain("1 skipped");
    });

    it("refuses to send when no subscriber has a token", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch
        .mockResolvedValueOnce({ _id: "post-1", title: "T", excerpt: "E" })
        .mockResolvedValueOnce([{ email: "a@example.com" }]);

      const result = await sendNewsletter("post-1");

      expect(result.success).toBe(false);
      expect(result.message).toMatch(/no subscribers have an unsubscribe token/i);
      expect(mockBatchSend).not.toHaveBeenCalled();
    });


  });

  describe("getSubscriberCount", () => {
    it("returns the count for an authenticated caller", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch.mockResolvedValue(7);

      await expect(getSubscriberCount()).resolves.toBe(7);
    });

    it("returns 0 when the query fails", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch.mockRejectedValue(new Error("sanity down"));

      await expect(getSubscriberCount()).resolves.toBe(0);
    });
  });

  describe("getResendStats", () => {
    it("returns the five most recent emails", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockEmailsList.mockResolvedValue({
        data: {
          data: Array.from({ length: 8 }, (_, i) => ({
            id: `id-${i}`,
            subject: `s-${i}`,
            created_at: "2026-01-01",
            to: ["x@example.com"],
          })),
        },
        error: null,
      });

      const result = await getResendStats();

      expect(result?.recentEmails).toHaveLength(5);
      expect(result?.recentEmails[0].id).toBe("id-0");
    });
  });
});

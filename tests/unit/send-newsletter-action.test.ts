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
const mockEmailsSend = jest.fn();
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
    send: (...args: unknown[]) => mockEmailsSend(...args),
    list: (...args: unknown[]) => mockEmailsList(...args),
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
      expect(mockEmailsSend).not.toHaveBeenCalled();
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
      expect(mockEmailsSend).not.toHaveBeenCalled();
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
      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it("returns a message when there are no active subscribers", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch
        .mockResolvedValueOnce({ _id: "post-1", title: "T", excerpt: "E" })
        .mockResolvedValueOnce([]);

      const result = await sendNewsletter("post-1");

      expect(result).toEqual({ success: false, message: "No active subscribers found" });
      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it("sends one email per subscriber and includes a List-Unsubscribe header", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch
        .mockResolvedValueOnce({ _id: "post-1", title: "Big News", excerpt: "E" })
        .mockResolvedValueOnce([
          { email: "a@example.com", token: "tok-a" },
          { email: "b@example.com", token: "tok-b" },
        ]);
      mockEmailsSend.mockResolvedValue({ data: { id: "x" }, error: null });

      const result = await sendNewsletter("post-1");

      expect(mockEmailsSend).toHaveBeenCalledTimes(2);
      const firstCall = mockEmailsSend.mock.calls[0][0];
      expect(firstCall.to).toBe("a@example.com");
      expect(firstCall.headers["List-Unsubscribe"]).toContain("token=tok-a");
      expect(result.success).toBe(true);
      expect(result.message).toContain("2 successful, 0 failed");
    });

    it("counts provider errors as failures", async () => {
      mockRequireAdmin.mockResolvedValue(undefined);
      mockFetch
        .mockResolvedValueOnce({ _id: "post-1", title: "T", excerpt: "E" })
        .mockResolvedValueOnce([{ email: "a@example.com", token: "t" }]);
      mockEmailsSend.mockResolvedValue({ data: null, error: { message: "boom" } });

      const result = await sendNewsletter("post-1");

      expect(result.success).toBe(true);
      expect(result.message).toContain("0 successful, 1 failed");
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

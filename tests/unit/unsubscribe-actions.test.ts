/**
 * @jest-environment node
 */
import { unsubscribeByToken, requestUnsubscribeLink } from "../../app/actions/unsubscribe";

const mockFetch = jest.fn();
const mockPatch = jest.fn();
const mockCommit = jest.fn();
const mockSend = jest.fn();
const mockGetResendClient = jest.fn();

jest.mock("server-only", () => ({}));

jest.mock("../../lib/sanity.server", () => ({
  serverClient: {
    fetch: (...args: unknown[]) => mockFetch(...args),
    patch: (id: string) => {
      mockPatch(id);
      return { set: () => ({ commit: () => mockCommit() }) };
    },
  },
}));

jest.mock("../../lib/resend", () => ({
  getResendClient: () => mockGetResendClient(),
}));

describe("unsubscribe actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetResendClient.mockReturnValue({ emails: { send: mockSend } });
    mockSend.mockResolvedValue({ data: {}, error: null });
    mockCommit.mockResolvedValue({});
  });

  describe("unsubscribeByToken", () => {
    it("rejects a blank token without touching Sanity", async () => {
      await expect(unsubscribeByToken("   ")).resolves.toMatchObject({ success: false });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("does not reveal whether an unknown token ever existed", async () => {
      mockFetch.mockResolvedValue(null);

      const result = await unsubscribeByToken("unknown");

      expect(result.success).toBe(false);
      expect(mockCommit).not.toHaveBeenCalled();
    });

    it("unsubscribes the subscriber that owns the token", async () => {
      mockFetch.mockResolvedValue({ _id: "sub-1", status: "subscribed" });

      const result = await unsubscribeByToken("good-token");

      expect(result.success).toBe(true);
      expect(mockPatch).toHaveBeenCalledWith("sub-1");
      expect(mockCommit).toHaveBeenCalledTimes(1);
    });

    it("is idempotent for an already unsubscribed record", async () => {
      mockFetch.mockResolvedValue({ _id: "sub-1", status: "unsubscribed" });

      const result = await unsubscribeByToken("good-token");

      expect(result.success).toBe(true);
      expect(mockCommit).not.toHaveBeenCalled();
    });

    it("queries by token, never by email", async () => {
      mockFetch.mockResolvedValue(null);

      await unsubscribeByToken("some-token");

      const [query] = mockFetch.mock.calls[0];
      expect(query).toContain("token ==");
      expect(query).not.toContain("email ==");
    });
  });

  describe("requestUnsubscribeLink", () => {
    it("never changes subscription state directly", async () => {
      mockFetch.mockResolvedValue({ _id: "sub-1", token: "tok" });

      await requestUnsubscribeLink("ada@example.com");

      expect(mockCommit).not.toHaveBeenCalled();
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it("returns the same generic response for an unknown address", async () => {
      mockFetch.mockResolvedValue(null);

      const result = await requestUnsubscribeLink("nobody@example.com");

      expect(result.success).toBe(true);
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("returns the same generic response for an invalid address", async () => {
      const result = await requestUnsubscribeLink("not-an-email");

      expect(result.success).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("issues a token when the subscriber has none", async () => {
      mockFetch.mockResolvedValue({ _id: "sub-1" });

      await requestUnsubscribeLink("ada@example.com");

      expect(mockPatch).toHaveBeenCalledWith("sub-1");
      expect(mockCommit).toHaveBeenCalledTimes(1);
      const link = mockSend.mock.calls[0][0].text;
      expect(link).toContain("/unsubscribe?token=");
    });

    it("stops sending after the per-address limit is reached", async () => {
      mockFetch.mockResolvedValue({ _id: "sub-1", token: "tok" });

      const address = "flood@example.com";
      for (let i = 0; i < 3; i += 1) {
        await requestUnsubscribeLink(address);
      }
      await requestUnsubscribeLink(address);

      // Three allowed, the fourth suppressed.
      expect(mockSend).toHaveBeenCalledTimes(3);
    });
  });
});

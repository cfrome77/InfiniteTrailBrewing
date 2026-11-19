/**
 * @jest-environment node
 */
import { subscribeToNewsletter } from "../../app/actions/newsletter";

const mockFetch = jest.fn();
const mockCreate = jest.fn();
const mockCommit = jest.fn();
const mockSet = jest.fn();
const mockSend = jest.fn();
const mockGetResendClient = jest.fn();

jest.mock("server-only", () => ({}));

jest.mock("../../lib/sanity.server", () => ({
  serverClient: {
    fetch: (...args: unknown[]) => mockFetch(...args),
    create: (...args: unknown[]) => mockCreate(...args),
    patch: () => ({ set: (...args: unknown[]) => { mockSet(...args); return { commit: () => mockCommit() }; } }),
  },
}));

jest.mock("../../lib/resend", () => ({
  getResendClient: () => mockGetResendClient(),
}));

describe("subscribeToNewsletter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetResendClient.mockReturnValue({ emails: { send: mockSend } });
    mockSend.mockResolvedValue({ data: {}, error: null });
    mockCreate.mockResolvedValue({});
    mockCommit.mockResolvedValue({});
  });

  it("rejects an invalid email without touching Sanity", async () => {
    const result = await subscribeToNewsletter("not-an-email");

    expect(result.success).toBe(false);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("creates a new subscriber and sends the welcome email", async () => {
    mockFetch.mockResolvedValue(null);

    const result = await subscribeToNewsletter("New@Example.com");

    expect(result.success).toBe(true);
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate.mock.calls[0][0]).toMatchObject({
      _type: "subscriber",
      email: "new@example.com",
      status: "subscribed",
    });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("reports already-subscribed without resending or duplicating", async () => {
    mockFetch.mockResolvedValue({ _id: "s1", status: "subscribed", token: "t1" });

    const result = await subscribeToNewsletter("new@example.com");

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/already subscribed/i);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("resubscribes an unsubscribed address", async () => {
    mockFetch.mockResolvedValue({ _id: "s1", status: "unsubscribed", token: "t1" });

    const result = await subscribeToNewsletter("back@example.com");

    expect(result.success).toBe(true);
    expect(mockSet).toHaveBeenCalledWith({ status: "subscribed", subscribedAt: expect.any(String), token: "t1" });
    expect(mockCommit).toHaveBeenCalled();
  });

  it("does not claim a confirmation email was sent when the provider fails", async () => {
    mockFetch.mockResolvedValue(null);
    mockSend.mockResolvedValue({ data: null, error: { message: "boom" } });

    const result = await subscribeToNewsletter("new@example.com");

    // The subscriber is on the list, so this is not a failure — but the message
    // must not tell them to check an inbox that will never receive anything.
    expect(result.success).toBe(true);
    expect(result.message).not.toMatch(/check your inbox/i);
  });
});

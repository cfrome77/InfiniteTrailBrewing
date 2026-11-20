/**
 * @jest-environment node
 */
import { POST } from "../../app/api/contact/route";

const mockSend = jest.fn();
const mockGetResendClient = jest.fn();

jest.mock("server-only", () => ({}));

jest.mock("../../lib/resend", () => ({
  getResendClient: () => mockGetResendClient(),
}));

const validBody = {
  name: "Ada",
  email: "ada@example.com",
  subject: "Hello",
  message: "A question about the taproom.",
};

let ipCounter = 0;

function post(body: unknown, ip = `10.0.0.${++ipCounter}`) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetResendClient.mockReturnValue({ emails: { send: mockSend } });
    mockSend.mockResolvedValue({ data: { id: "1" }, error: null });
  });

  it("rejects an empty body instead of reporting success", async () => {
    const res = await POST(post(""));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toMatchObject({ success: false });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON with 400, not 500", async () => {
    const res = await POST(post("{oops"));

    expect(res.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("rejects a payload missing required fields", async () => {
    const res = await POST(post({ name: "Ada", email: "ada@example.com" }));

    expect(res.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("rejects an invalid email address", async () => {
    const res = await POST(post({ ...validBody, email: "not-an-email" }));

    expect(res.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("rejects an oversized body", async () => {
    const res = await POST(post({ ...validBody, message: "x".repeat(20_000) }));

    expect(res.status).toBe(413);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("rejects an oversized body from the declared length without reading it", async () => {
    // The header is the only signal available before the body is buffered, so a
    // handler that skips it pays the memory cost of the whole payload.
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "x-forwarded-for": `10.0.0.${++ipCounter}`,
        "content-length": "999999",
      },
      body: JSON.stringify(validBody),
    });

    const res = await POST(req);

    expect(res.status).toBe(413);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("still rejects an oversized body when no length is declared", async () => {
    const res = await POST(post({ ...validBody, message: "x".repeat(20_000) }));

    expect(res.status).toBe(413);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 503 rather than a false success when email is unconfigured", async () => {
    mockGetResendClient.mockReturnValue(null);
    jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(post(validBody));

    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toMatchObject({ success: false });
  });

  it("does not report success when the provider returns an error", async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: "domain not verified" } });
    jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(post(validBody));

    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toMatchObject({ success: false });
  });

  it("sends a trimmed message and replies to the submitter", async () => {
    const res = await POST(post({ ...validBody, name: "  Ada  " }));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0]).toMatchObject({
      replyTo: "ada@example.com",
      subject: "New Contact Form: Hello",
    });
    expect(mockSend.mock.calls[0][0].text).toContain("Name: Ada");
  });

  it("rate limits repeated submissions from the same client", async () => {
    const ip = "203.0.113.9";

    for (let i = 0; i < 5; i++) {
      const ok = await POST(post(validBody, ip));
      expect(ok.status).toBe(200);
    }

    const blocked = await POST(post(validBody, ip));

    expect(blocked.status).toBe(429);
    await expect(blocked.json()).resolves.toMatchObject({ success: false });
    expect(mockSend).toHaveBeenCalledTimes(5);
  });
});

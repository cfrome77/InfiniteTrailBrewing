/**
 * @jest-environment node
 */
import { GET, POST } from "../../app/api/unsubscribe/route";

const mockFetch = jest.fn();
const mockPatch = jest.fn();
const mockCommit = jest.fn();
const mockRedirect = jest.fn((url: string) => {
  // Next's redirect() throws to unwind; mirror that so callers cannot continue.
  const err = new Error(`NEXT_REDIRECT:${url}`);
  (err as { digest?: string }).digest = `NEXT_REDIRECT;replace;${url};307;`;
  throw err;
});

jest.mock("../../lib/sanity.server", () => ({
  serverClient: {
    fetch: (...args: unknown[]) => mockFetch(...args),
    patch: (...args: unknown[]) => mockPatch(...args),
  },
}));

jest.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

function req(url: string) {
  return new Request(url);
}

async function catchRedirect(promise: Promise<unknown>): Promise<string | null> {
  try {
    await promise;
    return null;
  } catch (e) {
    const digest = (e as { digest?: string }).digest ?? "";
    const match = /NEXT_REDIRECT;[^;]*;([^;]*);/.exec(digest);
    return match ? match[1] : null;
  }
}

describe("GET /api/unsubscribe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPatch.mockReturnValue({ set: () => ({ commit: mockCommit }) });
    mockCommit.mockResolvedValue({});
  });

  it("redirects with a missing-token error when no token is supplied", async () => {
    const target = await catchRedirect(GET(req("http://x/api/unsubscribe")));
    expect(target).toBe("/unsubscribe?error=missing");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("marks an active subscriber unsubscribed and redirects to success", async () => {
    mockFetch.mockResolvedValue({ _id: "sub-1", status: "subscribed" });

    const target = await catchRedirect(
      GET(req("http://x/api/unsubscribe?token=tok-1")),
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockPatch).toHaveBeenCalledWith("sub-1");
    expect(mockCommit).toHaveBeenCalledTimes(1);
    expect(target).toBe("/unsubscribe?success=true");
  });

  it("does not patch again when already unsubscribed", async () => {
    mockFetch.mockResolvedValue({ _id: "sub-1", status: "unsubscribed" });

    const target = await catchRedirect(
      GET(req("http://x/api/unsubscribe?token=tok-1")),
    );

    expect(mockPatch).not.toHaveBeenCalled();
    expect(target).toBe("/unsubscribe?success=true");
  });

  it("reports an unknown token without touching data", async () => {
    mockFetch.mockResolvedValue(null);

    const target = await catchRedirect(
      GET(req("http://x/api/unsubscribe?token=nope")),
    );

    expect(mockPatch).not.toHaveBeenCalled();
    expect(target).toBe("/unsubscribe?error=invalid");
  });

  it("reports a failed outcome when the data layer throws", async () => {
    mockFetch.mockRejectedValue(new Error("sanity down"));

    const target = await catchRedirect(
      GET(req("http://x/api/unsubscribe?token=tok-1")),
    );

    expect(target).toBe("/unsubscribe?error=failed");
  });
});

describe("POST /api/unsubscribe (RFC 8058 one-click)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPatch.mockReturnValue({ set: () => ({ commit: mockCommit }) });
    mockCommit.mockResolvedValue({});
  });

  it("returns 400 without a token", async () => {
    const res = await POST(req("http://x/api/unsubscribe"));
    expect(res.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("unsubscribes and returns 200 without redirecting", async () => {
    mockFetch.mockResolvedValue({ _id: "sub-1", status: "subscribed" });

    const res = await POST(req("http://x/api/unsubscribe?token=tok-1"));

    expect(res.status).toBe(200);
    expect(mockPatch).toHaveBeenCalledWith("sub-1");
    // A redirect would break the provider's one-click flow.
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("treats an already-unsubscribed address as success", async () => {
    mockFetch.mockResolvedValue({ _id: "sub-1", status: "unsubscribed" });

    const res = await POST(req("http://x/api/unsubscribe?token=tok-1"));

    expect(res.status).toBe(200);
    expect(mockPatch).not.toHaveBeenCalled();
  });

  it("returns 200 for an unknown token so it does not leak list membership", async () => {
    mockFetch.mockResolvedValue(null);

    const res = await POST(req("http://x/api/unsubscribe?token=nope"));

    expect(res.status).toBe(200);
    expect(mockPatch).not.toHaveBeenCalled();
  });

  it("returns 500 when the data layer fails", async () => {
    mockFetch.mockRejectedValue(new Error("sanity down"));

    const res = await POST(req("http://x/api/unsubscribe?token=tok-1"));

    expect(res.status).toBe(500);
  });
});

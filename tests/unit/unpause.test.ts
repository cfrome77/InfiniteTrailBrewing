/**
 * @jest-environment node
 */
import { GET, POST } from "../../app/api/unpause/route";

const ENV = { ...process.env };
const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  process.env.CRON_SECRET = "cron-secret-value";
  process.env.SUPABASE_URL = "https://project.supabase.co";
  process.env.SUPABASE_ANON_KEY = "anon-key";
  process.env.SUPABASE_KEEPALIVE_TABLE = "beers";
});

afterEach(() => {
  process.env = { ...ENV };
});

function req(headers: Record<string, string> = {}): Request {
  return { headers: new Headers(headers) } as unknown as Request;
}

const AUTH = { authorization: "Bearer cron-secret-value" };

describe("/api/unpause", () => {
  it("rejects a request without the cron secret", async () => {
    const res = await GET(req());
    expect(res.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a wrong bearer token", async () => {
    const res = await GET(req({ authorization: "Bearer wrong" }));
    expect(res.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed when CRON_SECRET is unset", async () => {
    delete process.env.CRON_SECRET;
    const res = await GET(req(AUTH));
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("queries PostgREST with the anon key on success", async () => {
    fetchMock.mockResolvedValue(new Response("[]", { status: 200 }));
    const res = await GET(req(AUTH));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, status: 200 });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("https://project.supabase.co/rest/v1/beers");
    expect(url).toContain("limit=1");
    expect((init as RequestInit).headers).toMatchObject({
      apikey: "anon-key",
      Authorization: "Bearer anon-key",
    });
  });

  it("skips without calling out when Supabase is not configured", async () => {
    delete process.env.SUPABASE_URL;
    const res = await GET(req(AUTH));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ skipped: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports 502 when Supabase errors", async () => {
    fetchMock.mockResolvedValue(new Response("nope", { status: 500 }));
    const res = await GET(req(AUTH));
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false, status: 500 });
  });

  it("reports 502 when the request throws", async () => {
    fetchMock.mockRejectedValue(new Error("timeout"));
    const res = await GET(req(AUTH));
    expect(res.status).toBe(502);
  });

  it("accepts POST as well", async () => {
    fetchMock.mockResolvedValue(new Response("[]", { status: 200 }));
    const res = await POST(req(AUTH));
    expect(res.status).toBe(200);
  });
});

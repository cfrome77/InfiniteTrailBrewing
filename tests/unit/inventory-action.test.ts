/**
 * @jest-environment node
 */
import { updateBeerStatus } from "../../app/actions/inventory";

const mockRequireAdmin = jest.fn();
const mockPatch = jest.fn();
const mockCommit = jest.fn();

jest.mock("server-only", () => ({}));

jest.mock("../../lib/admin-auth", () => ({
  requireAdmin: () => mockRequireAdmin(),
}));

jest.mock("../../lib/sanity.server", () => ({
  serverClient: {
    patch: (id: string) => {
      mockPatch(id);
      return { set: () => ({ commit: () => mockCommit() }) };
    },
  },
}));

jest.mock("next/cache", () => ({
  updateTag: jest.fn(),
}));

describe("updateBeerStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws and performs no write when the caller is not authenticated", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("Unauthorized: admin session required"));

    await expect(updateBeerStatus("beer-1", "ready")).rejects.toThrow(/Unauthorized/);
    expect(mockPatch).not.toHaveBeenCalled();
    expect(mockCommit).not.toHaveBeenCalled();
  });

  it("rejects a status outside the schema allowlist", async () => {
    mockRequireAdmin.mockResolvedValue(undefined);

    const result = await updateBeerStatus("beer-1", "sold_out");

    expect(result).toEqual({ success: false, message: "Invalid status value." });
    expect(mockPatch).not.toHaveBeenCalled();
  });

  it("rejects an empty beer id", async () => {
    mockRequireAdmin.mockResolvedValue(undefined);

    const result = await updateBeerStatus("   ", "ready");

    expect(result.success).toBe(false);
    expect(mockPatch).not.toHaveBeenCalled();
  });

  it("applies a valid status for an authenticated caller", async () => {
    mockRequireAdmin.mockResolvedValue(undefined);
    mockCommit.mockResolvedValue({});

    const result = await updateBeerStatus("beer-1", "archived");

    expect(result).toEqual({ success: true });
    expect(mockPatch).toHaveBeenCalledWith("beer-1");
    expect(mockCommit).toHaveBeenCalledTimes(1);
  });

  it("reports failure without leaking details when the write throws", async () => {
    mockRequireAdmin.mockResolvedValue(undefined);
    mockCommit.mockRejectedValue(new Error("sanity down"));
    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await updateBeerStatus("beer-1", "ready");

    expect(result).toEqual({ success: false, message: "Failed to update status." });
  });
});

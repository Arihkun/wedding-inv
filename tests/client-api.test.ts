import { afterEach, expect, it, vi } from "vitest";
import { getWishes, resolveInvitation } from "../src/lib/api";
afterEach(() => vi.unstubAllGlobals());
it("turns network and invalid API replies into readable retry errors", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
  await expect(getWishes()).rejects.toMatchObject({ code: "NETWORK", status: 0 });
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not json")));
  await expect(getWishes()).rejects.toMatchObject({ code: "BAD_RESPONSE" });
});
it("sends invitation tokens in JSON without query parameters or referrers", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ name: "Fixture", maxGuests: 2, rsvp: null })));
  vi.stubGlobal("fetch", fetchMock);
  await resolveInvitation("synthetic-token");
  expect(fetchMock).toHaveBeenCalledWith("/api/invitations/resolve", expect.objectContaining({ method: "POST", body: JSON.stringify({ token: "synthetic-token" }), cache: "no-store", referrerPolicy: "no-referrer" }));
});

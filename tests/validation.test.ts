import { describe, expect, it, vi, afterEach } from "vitest";
import { assertOrigin, body, challenge, guard, HttpError, text, type Env } from "../functions/_lib/core";
import { validateRsvp } from "../functions/api/rsvp";
import { parseCursor } from "../functions/api/wishes";
describe("RSVP server validation", () => {
  it("rejects exceeding caps, decimals, strings and inconsistent decline", () => {
    for (const guestCount of [0, 3, 1.5, "2", NaN]) expect(() => validateRsvp({ attendance: "attending", guestCount }, 2)).toThrow();
    expect(() => validateRsvp({ attendance: "declined", guestCount: 1 }, 2)).toThrow();
    expect(validateRsvp({ attendance: "declined", guestCount: 0 }, 2).guestCount).toBe(0);
    expect(validateRsvp({ attendance: "attending", guestCount: 2, message: " Hello " }, 2).message).toBe("Hello");
  });
  it("rejects invalid status and long/control input", () => {
    expect(() => validateRsvp({ attendance: "maybe", guestCount: 1 }, 2)).toThrow();
    expect(() => text("a".repeat(1001), "message", 1000)).toThrow();
    expect(() => text("a\u0000b", "name", 100)).toThrow();
  });
});
describe("request and challenge boundaries", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("rejects other origins and malformed/oversized body", async () => {
    expect(() => assertOrigin(new Request("https://example.com", { headers: { Origin: "https://evil.example" } }), { APP_ORIGIN: "https://example.com" } as Env)).toThrow();
    await expect(body(new Request("https://example.com", { method: "POST", headers: { "Content-Type": "application/json" }, body: "[1]" }))).rejects.toThrow();
    await expect(body(new Request("https://example.com", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ long: "a".repeat(9000) }) }))).rejects.toThrow();
  });
  it("does not leak internal database errors", async () => {
    const response = await guard(async () => { throw new Error("private SQL detail"); });
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("SQL");
  });
  it("fails closed for missing secrets and rejects dummy production keys", async () => {
    const request = new Request("https://example.com");
    await expect(challenge(request, { APP_ORIGIN: "https://example.com" } as Env, "token", "rsvp")).rejects.toMatchObject({ status: 503 });
    await expect(challenge(request, { APP_ORIGIN: "https://example.com", TURNSTILE_SECRET_KEY: "1x000" } as Env, "token", "rsvp")).rejects.toMatchObject({ status: 503 });
  });
  it("rejects challenge hostname and action mismatches", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "evil.example", action: "rsvp" }))));
    await expect(challenge(new Request("https://example.com"), { APP_ORIGIN: "https://example.com", TURNSTILE_SECRET_KEY: "real-secret" } as Env, "token", "rsvp")).rejects.toBeInstanceOf(HttpError);
  });
  it("rejects tampered cursors", () => {
    expect(parseCursor(null)).toBeNull();
    expect(() => parseCursor("bad")).toThrow();
    expect(() => parseCursor(btoa(JSON.stringify({ createdAt: "x", id: "x" })))).toThrow();
  });
});

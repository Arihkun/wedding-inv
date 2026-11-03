import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { build } from "esbuild";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { readFile } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";

let mf: Miniflare;
let db: Awaited<ReturnType<Miniflare["getD1Database"]>>;
const token = "A".repeat(43);
const secondToken = "B".repeat(43);
const headers = { "Content-Type": "application/json", Origin: "https://test.example" };
async function call(path: string, method = "GET", value?: unknown, origin = headers.Origin) {
  const response = await mf.dispatchFetch(`https://test.example${path}`, { method, headers: { ...headers, Origin: origin }, body: value ? JSON.stringify(value) : undefined });
  return { status: response.status, data: await response.json() as Record<string, unknown> };
}
beforeAll(async () => {
  const bundle = await build({ entryPoints: ["tests/fixtures/api-worker.ts"], bundle: true, write: false, format: "esm", platform: "browser", target: "es2022" });
  mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script: bundle.outputFiles[0].text, compatibilityDate: "2026-11-03", d1Databases: { DB: "integration-only" },
    bindings: { APP_ORIGIN: "https://test.example", RATE_LIMIT_SALT: "integration-test-salt-only", TURNSTILE_SECRET_KEY: "integration-secret-not-real" },
    outboundService: async (request: { json(): Promise<unknown> }) => {
      const payload = await request.json() as { response?: string };
      return new Response(JSON.stringify({ success: payload.response !== "invalid", hostname: "test.example", action: payload.response }), { headers: { "Content-Type": "application/json" } });
    },
  }));
  db = await mf.getD1Database("DB");
  const migration = await readFile("migrations/0001_initial.sql", "utf8");
  for (const statement of migration.split(";").filter((s) => s.trim())) await db.prepare(statement).run();
  for (const [id, name, raw] of [["fixture-one", "Fixture One", token], ["fixture-two", "Fixture Two", secondToken]]) {
    await db.prepare("INSERT INTO invitations(id,token_hash,name,max_guests) VALUES(?,?,?,2)").bind(id, createHash("sha256").update(raw).digest("hex"), name).run();
  }
}, 30000);
afterAll(async () => { await mf?.dispose(); });

describe("real D1 + Worker API integration (Turnstile outbound mocked)", () => {
  it("keeps invitation data private and rejects invalid tokens/origins", async () => {
    expect(await call("/api/invitations/resolve", "POST", { token })).toEqual({ status: 200, data: { name: "Fixture One", maxGuests: 2, rsvp: null } });
    expect((await call("/api/invitations/resolve", "POST", { token: "wrong" })).status).toBe(404);
    expect((await call("/api/invitations/resolve", "POST", { token }, "https://evil.example")).status).toBe(403);
    expect((await call("/api/rsvp", "GET")).status).toBe(405);
    expect((await call("/api/private", "GET")).status).toBe(404);
  });
  it("validates, stores and updates a single RSVP without exposing it to another invitation", async () => {
    const base = { token, attendance: "attending", guestCount: 2, message: "Private note", turnstileToken: "rsvp" };
    expect((await call("/api/rsvp", "PUT", { ...base, guestCount: 3 })).status).toBe(400);
    expect((await call("/api/rsvp", "PUT", { ...base, turnstileToken: "invalid" })).status).toBe(403);
    expect((await call("/api/rsvp", "PUT", base)).status).toBe(200);
    expect((await call("/api/rsvp", "PUT", { ...base, attendance: "declined", guestCount: 0 })).status).toBe(200);
    expect(await db.prepare("SELECT count(*) AS count FROM rsvps").first("count")).toBe(1);
    const first = await call("/api/invitations/resolve", "POST", { token });
    expect(first.data.rsvp).toMatchObject({ attendance: "declined", guestCount: 0 });
    expect((await call("/api/invitations/resolve", "POST", { token: secondToken })).data.rsvp).toBeNull();
  });
  it("deduplicates wish retries and does not reveal hidden/private fields", async () => {
    const input = { token, name: "Fixture public name", message: "Fixture wish", submissionId: randomUUID(), turnstileToken: "wish" };
    const a = await call("/api/wishes", "POST", input);
    const b = await call("/api/wishes", "POST", input);
    expect(a.status).toBe(201); expect(b.status).toBe(200); expect(b.data.id).toBe(a.data.id);
    expect((await call("/api/wishes", "POST", { ...input, message: "changed" })).status).toBe(409);
    expect(await db.prepare("SELECT count(*) AS count FROM wishes").first("count")).toBe(1);
    const list = await call("/api/wishes");
    expect(Object.keys((list.data.items as Record<string, unknown>[])[0]).sort()).toEqual(["createdAt", "id", "message", "name"]);
    await db.prepare("UPDATE wishes SET visible=0 WHERE id=?").bind(a.data.id).run();
    expect((await call("/api/wishes")).data.items).toEqual([]);
    expect((await call("/api/wishes", "POST", input)).status).toBe(409);
  });
  it("paginates deterministically without duplicates and excludes hidden wishes", async () => {
    for (let index = 0; index < 12; index++) await db.prepare("INSERT INTO wishes(id,invitation_id,submission_id,name,message,created_at) VALUES(?,?,?,?,?,?)")
      .bind(randomUUID(), "fixture-two", randomUUID(), "Pagination fixture", `Fixture ${index}`, "2026-11-03T00:00:00.000Z").run();
    const first = await call("/api/wishes");
    expect(first.data.items).toHaveLength(10);
    const second = await call(`/api/wishes?cursor=${encodeURIComponent(first.data.nextCursor as string)}`);
    expect(second.data.items).toHaveLength(2); expect(second.data.nextCursor).toBeNull();
    const ids = [...first.data.items as {id: string}[], ...second.data.items as {id: string}[]].map((w) => w.id);
    expect(new Set(ids).size).toBe(12);
  });
  it("revokes existing access and limits repeated attempts atomically", async () => {
    await db.prepare("UPDATE invitations SET active=0 WHERE id='fixture-two'").run();
    expect((await call("/api/invitations/resolve", "POST", { token: secondToken })).status).toBe(404);
    const responses = await Promise.all(Array.from({ length: 35 }, () => call("/api/invitations/resolve", "POST", { token: "invalid" })));
    expect(responses.some((r) => r.status === 429)).toBe(true);
    expect(responses.every((r) => [404, 429].includes(r.status))).toBe(true);
  });
});

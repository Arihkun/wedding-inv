export interface Env {
  DB: D1Database;
  APP_ORIGIN: string;
  TURNSTILE_SECRET_KEY: string;
  RATE_LIMIT_SALT: string;
}
export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: {
    "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer",
    "X-Frame-Options": "DENY", "Vary": "Origin",
    ...(status === 429 ? { "Retry-After": "60" } : {}),
  } });
}
export async function guard(run: () => Promise<Response>): Promise<Response> {
  try { return await run(); }
  catch (error) {
    if (error instanceof HttpError) return json({ error: { code: error.code, message: error.message } }, error.status);
    return json({ error: { code: "UNAVAILABLE", message: "Layanan sedang tidak tersedia. Silakan coba lagi." } }, 503);
  }
}
export function assertOrigin(request: Request, env: Env) {
  if (!env.APP_ORIGIN) throw new HttpError(503, "UNCONFIGURED", "Layanan belum dikonfigurasi.");
  if (request.headers.get("Origin") !== new URL(env.APP_ORIGIN).origin) throw new HttpError(403, "ORIGIN", "Permintaan tidak diizinkan.");
}
export async function body(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) throw new HttpError(400, "JSON_REQUIRED", "Gunakan permintaan JSON.");
  if (Number(request.headers.get("Content-Length")) > 8192) throw new HttpError(413, "TOO_LARGE", "Data terlalu panjang.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "INVALID_JSON", "Data tidak valid.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 8192) { await reader.cancel(); throw new HttpError(413, "TOO_LARGE", "Data terlalu panjang."); }
    chunks.push(value);
  }
  const buffer = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length; }
  let value: unknown;
  try { value = JSON.parse(new TextDecoder().decode(buffer)); }
  catch { throw new HttpError(400, "INVALID_JSON", "Data tidak valid."); }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new HttpError(400, "INVALID_JSON", "Data tidak valid.");
  return value as Record<string, unknown>;
}
export function text(value: unknown, label: string, max: number, required = true): string {
  if (typeof value !== "string" || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) throw new HttpError(400, "VALIDATION", `${label} tidak valid.`);
  const clean = value.trim();
  if ((required && !clean) || clean.length > max) throw new HttpError(400, "VALIDATION", `${label} harus ${required ? "1" : "0"}–${max} karakter.`);
  return clean;
}
export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
export interface InvitationRow { id: string; name: string; max_guests: number }
export async function invitation(db: D1Database, value: unknown): Promise<InvitationRow> {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(value)) throw new HttpError(404, "INVITATION", "Undangan tidak ditemukan atau sudah tidak aktif.");
  const row = await db.prepare("SELECT id,name,max_guests FROM invitations WHERE token_hash=? AND active=1").bind(await sha256(value)).first<InvitationRow>();
  if (!row) throw new HttpError(404, "INVITATION", "Undangan tidak ditemukan atau sudah tidak aktif.");
  return row;
}
export async function rateLimit(env: Env, scope: string, identity: string, limit: number, windowSeconds = 60) {
  if (!env.RATE_LIMIT_SALT || env.RATE_LIMIT_SALT.length < 16) throw new HttpError(503, "UNCONFIGURED", "Layanan belum dikonfigurasi.");
  const now = Math.floor(Date.now() / 1000);
  const window = Math.floor(now / windowSeconds);
  const key = await sha256(`${env.RATE_LIMIT_SALT}:${scope}:${identity}:${window}`);
  const row = await env.DB.prepare("INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<? RETURNING count")
    .bind(key, (window + 1) * windowSeconds, limit).first<{count: number}>();
  if (!row) throw new HttpError(429, "RATE_LIMIT", "Terlalu banyak permintaan. Tunggu satu menit lalu coba lagi.");
}
export function ipOf(request: Request) { return request.headers.get("CF-Connecting-IP") ?? "local"; }
export async function challenge(request: Request, env: Env, value: unknown, action: "rsvp" | "wish") {
  if (!env.TURNSTILE_SECRET_KEY) throw new HttpError(503, "UNCONFIGURED", "Verifikasi belum dikonfigurasi.");
  const token = text(value, "Verifikasi", 2048);
  const origin = new URL(env.APP_ORIGIN);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
  const testSecret = /^[123]x0/.test(env.TURNSTILE_SECRET_KEY);
  if (testSecret && !local) throw new HttpError(503, "UNCONFIGURED", "Verifikasi produksi belum dikonfigurasi.");
  let response: Response;
  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get("CF-Connecting-IP") ?? undefined }),
      signal: AbortSignal.timeout(8000),
    });
  } catch { throw new HttpError(503, "VERIFICATION_UNAVAILABLE", "Verifikasi belum dapat dihubungi. Silakan coba lagi."); }
  if (!response.ok) throw new HttpError(503, "VERIFICATION_UNAVAILABLE", "Verifikasi belum dapat dihubungi. Silakan coba lagi.");
  const result = await response.json() as { success: boolean; hostname?: string; action?: string };
  if (!result.success || (!testSecret && (result.hostname !== origin.hostname || result.action !== action))) throw new HttpError(403, "VERIFICATION", "Verifikasi gagal atau kedaluwarsa. Silakan ulangi.");
}
export function rsvpJson(row: { attendance: string; guest_count: number; message: string; updated_at: string }) {
  return { attendance: row.attendance, guestCount: row.guest_count, message: row.message, updatedAt: row.updated_at };
}
export function wishJson(row: { id: string; name: string; message: string; created_at: string }) {
  return { id: row.id, name: row.name, message: row.message, createdAt: row.created_at };
}

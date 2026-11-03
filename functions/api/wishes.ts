import { assertOrigin, body, challenge, guard, HttpError, invitation, ipOf, json, rateLimit, text, wishJson, type Env } from "../_lib/core";
interface WishRow { id: string; name: string; message: string; created_at: string; visible: number }
export function parseCursor(value: string | null): { createdAt: string; id: string } | null {
  if (!value) return null;
  try {
    if (value.length > 300) throw new Error();
    const parsed = JSON.parse(atob(value));
    if (typeof parsed.createdAt !== "string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(parsed.createdAt) || typeof parsed.id !== "string" || !/^[0-9a-f-]{36}$/.test(parsed.id)) throw new Error();
    return { createdAt: parsed.createdAt, id: parsed.id };
  } catch { throw new HttpError(400, "CURSOR", "Halaman ucapan tidak valid."); }
}
export const onRequestGet: PagesFunction<Env> = ({ request, env }) => guard(async () => {
  await rateLimit(env, "wishes-read", ipOf(request), 60);
  const cursor = parseCursor(new URL(request.url).searchParams.get("cursor"));
  const query = cursor
    ? env.DB.prepare("SELECT id,name,message,created_at FROM wishes WHERE visible=1 AND (created_at<? OR (created_at=? AND id<?)) ORDER BY created_at DESC,id DESC LIMIT 11").bind(cursor.createdAt, cursor.createdAt, cursor.id)
    : env.DB.prepare("SELECT id,name,message,created_at FROM wishes WHERE visible=1 ORDER BY created_at DESC,id DESC LIMIT 11");
  const result = await query.all<WishRow>();
  const items = result.results.slice(0, 10);
  const last = items.at(-1);
  return json({ items: items.map(wishJson), nextCursor: result.results.length > 10 && last ? btoa(JSON.stringify({ createdAt: last.created_at, id: last.id })) : null });
});
export const onRequestPost: PagesFunction<Env> = ({ request, env }) => guard(async () => {
  assertOrigin(request, env);
  await rateLimit(env, "wish-ip", ipOf(request), 20);
  const input = await body(request);
  const guest = await invitation(env.DB, input.token);
  const name = text(input.name, "Nama", 100);
  const message = text(input.message, "Ucapan", 1000);
  const submissionId = text(input.submissionId, "Identitas pengiriman", 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) throw new HttpError(400, "VALIDATION", "Identitas pengiriman tidak valid.");
  await challenge(request, env, input.turnstileToken, "wish");
  const existing = await env.DB.prepare("SELECT id,name,message,created_at,visible FROM wishes WHERE invitation_id=? AND submission_id=?").bind(guest.id, submissionId).first<WishRow>();
  if (existing) {
    if (existing.name !== name || existing.message !== message || !existing.visible) throw new HttpError(409, "CONFLICT", "Pengiriman sudah diproses. Gunakan pengiriman baru.");
    return json(wishJson(existing));
  }
  await rateLimit(env, "wish-invitation", guest.id, 3);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await env.DB.prepare("INSERT INTO wishes(id,invitation_id,submission_id,name,message,created_at) VALUES(?,?,?,?,?,?) ON CONFLICT(invitation_id,submission_id) DO NOTHING")
    .bind(id, guest.id, submissionId, name, message, createdAt).run();
  const saved = await env.DB.prepare("SELECT id,name,message,created_at,visible FROM wishes WHERE invitation_id=? AND submission_id=?").bind(guest.id, submissionId).first<WishRow>();
  if (!saved || !saved.visible || saved.name !== name || saved.message !== message) throw new HttpError(409, "CONFLICT", "Pengiriman sudah diproses. Gunakan pengiriman baru.");
  return json(wishJson(saved), saved.id === id ? 201 : 200);
});

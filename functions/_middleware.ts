import { json, type Env } from "./_lib/core";
export const onRequest: PagesFunction<Env> = async (context) => {
  const pathname = new URL(context.request.url).pathname;
  const allowed = pathname === "/api/wishes" ? ["GET", "POST"] : pathname === "/api/rsvp" ? ["PUT"] : pathname === "/api/invitations/resolve" ? ["POST"] : [];
  if (!allowed.length) return json({ error: { code: "NOT_FOUND", message: "Layanan tidak ditemukan." } }, 404);
  if (!allowed.includes(context.request.method)) {
    const response = json({ error: { code: "METHOD", message: "Metode tidak diizinkan." } }, 405);
    response.headers.set("Allow", allowed.join(", "));
    return response;
  }
  return context.next();
};

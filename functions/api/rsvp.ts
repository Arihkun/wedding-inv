import { assertOrigin, body, challenge, guard, HttpError, invitation, ipOf, json, rateLimit, text, type Env } from "../_lib/core";
export function validateRsvp(input: Record<string, unknown>, maxGuests: number) {
  if (input.attendance !== "attending" && input.attendance !== "declined") throw new HttpError(400, "VALIDATION", "Pilih status kehadiran.");
  if (typeof input.guestCount !== "number" || !Number.isInteger(input.guestCount)) throw new HttpError(400, "VALIDATION", "Jumlah tamu harus bilangan bulat.");
  if (input.attendance === "attending" && (input.guestCount < 1 || input.guestCount > maxGuests)) throw new HttpError(400, "VALIDATION", `Jumlah tamu harus 1–${maxGuests}.`);
  if (input.attendance === "declined" && input.guestCount !== 0) throw new HttpError(400, "VALIDATION", "Jumlah tamu untuk tidak hadir harus nol.");
  return { attendance: input.attendance, guestCount: input.guestCount, message: text(input.message ?? "", "Pesan", 1000, false) };
}
export const onRequestPut: PagesFunction<Env> = ({ request, env }) => guard(async () => {
  assertOrigin(request, env);
  await rateLimit(env, "rsvp-ip", ipOf(request), 30);
  const input = await body(request);
  const guest = await invitation(env.DB, input.token);
  const value = validateRsvp(input, guest.max_guests);
  await rateLimit(env, "rsvp-invitation", guest.id, 5);
  await challenge(request, env, input.turnstileToken, "rsvp");
  const updatedAt = new Date().toISOString();
  await env.DB.prepare("INSERT INTO rsvps(invitation_id,attendance,guest_count,message,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(invitation_id) DO UPDATE SET attendance=excluded.attendance,guest_count=excluded.guest_count,message=excluded.message,updated_at=excluded.updated_at")
    .bind(guest.id, value.attendance, value.guestCount, value.message, updatedAt).run();
  return json({ ...value, updatedAt });
});

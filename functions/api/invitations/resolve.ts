import { assertOrigin, body, guard, invitation, ipOf, json, rateLimit, rsvpJson, type Env } from "../../_lib/core";
export const onRequestPost: PagesFunction<Env> = ({ request, env, waitUntil }) => guard(async () => {
  assertOrigin(request, env);
  await rateLimit(env, "resolve", ipOf(request), 30);
  const input = await body(request);
  const guest = await invitation(env.DB, input.token);
  const rsvp = await env.DB.prepare("SELECT attendance,guest_count,message,updated_at FROM rsvps WHERE invitation_id=?").bind(guest.id)
    .first<{attendance: string; guest_count: number; message: string; updated_at: string}>();
  waitUntil(env.DB.prepare("DELETE FROM rate_limits WHERE expires_at<?").bind(Math.floor(Date.now() / 1000) - 60).run());
  return json({ name: guest.name, maxGuests: guest.max_guests, rsvp: rsvp ? rsvpJson(rsvp) : null });
});

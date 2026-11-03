# Shared frontend/backend contract

Types: src/types/api.ts and src/types/wedding.ts. Client adapter: src/lib/api.ts. Helpers: src/lib/wedding.ts; useCountdown(date) in src/hooks/use-countdown.ts. Public data: named weddingConfig export in src/config/wedding.config.ts.

- POST /api/invitations/resolve body {token}. Returns InvitationData {name,maxGuests,rsvp}. Invalid/revoked token: 404 generic error. No public listing. Token read in browser from /wedding?invite=... only; never treat ?to= as identity.
- PUT /api/rsvp body {token,attendance:'attending'|'declined',guestCount,message,turnstileToken}. Returns RsvpData. Attending count integer 1..maxGuests; declined stored as 0; message <=1000 chars. One row per invitation; repeated PUT updates it.
- GET /api/wishes?cursor=... returns {items:Wish[],nextCursor:string|null}, 10 per page newest-first. Never return invitation ID, token, RSVP or private note.
- POST /api/wishes body {token,name,message,submissionId,turnstileToken}. Returns Wish. Name 1..100 chars, message 1..1000. submissionId UUID: reuse on retry, new UUID only for a new wish. Unique per invitation + submissionId. Visible immediately; owner can hide via authenticated D1 console.
- Error {error:{code,message}} with 400 validation, 403 challenge/origin, 404 invitation, 409 submission conflict, 413 size, 429 rate limit, 503 configuration/unavailable. UI must preserve user input and show retry feedback.

All write/resolve calls JSON, strict same configured Origin; tokens in body, never API query. Turnstile key: NEXT_PUBLIC_TURNSTILE_SITE_KEY; actions rsvp and wish respectively. Capture callback token once, reset widget after every request/expiry/error. No bypass for missing key. On next dev API is unavailable: explicitly show unavailable state, not fake success; use full wrangler preview for integration.

Opening token lookup: start when client mounts, loading greeting then validated name; generic greeting when no/invalid token with retry on network error. Don't put token in public text or logs. Native media errors must surface; absent music shows honest unavailable state. Map helper returns null until verified coordinates exist. Countdown null means missing/invalid date, arrived means past event.

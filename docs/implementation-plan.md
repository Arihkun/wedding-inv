# Approved implementation plan

1. Initialize Git, document decisions, write shared config/types/API contract. Preserve placeholder content, never invent details.
2. Antigravity builds design system and all UI in separate ownership area; Codex builds Functions, D1 schema, validation, invitation logic, countdown/maps helpers and private import tooling. Agree contracts before changes.
3. Integrate and review API errors, token identity, RSVP updates, public wishes, copy gift, audio unlock, responsive gallery and reduced motion.
4. Run lint, typecheck, tests, static build, D1 local/API integration and browser click-through. Cross-review before merge.
5. Configure owner Cloudflare/GitHub resources when available. Separate preview/prod DB. Gate publication on authentic content and real secrets. Verify HTTPS, OG/WhatsApp and production API flow.

MVP: cover, names, hero/date, countdown, couple profiles, story, events/maps, gallery/lightbox, gift/copy, RSVP, wishes, music, closing, responsive. Chosen additional capability: import unique invitation links with maxGuests. Deferred: admin dashboard, Calendar, QR invitation, QRIS unless supplied, social sharing button, dresscode.

Acceptance: valid/invalid/revoked/no token; attending/declined/max/update/retry; wishes pagination/idempotency/spam/hidden; countdown timezone/past; pin verification; copy failure; audio rejection; lightbox keyboard/focus; 360-430px/tablet/desktop/zoom; static OG; real-device WhatsApp. Performance targets (not results): LCP <=2.5s, CLS <=0.1, INP <=200ms.

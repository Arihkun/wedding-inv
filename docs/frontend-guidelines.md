# Frontend handoff

Antigravity owns frontend implementation. Read docs/api-contracts.md, docs/design-decisions.md and shared types before work. Do not alter package/config/backend/shared contracts without coordination.

Use weddingConfig for every wedding detail. Profiles have nickname plus nullable fullName/father/mother/instagram. Hero/gallery photo objects include dimensions, alt and placeholder flag. Story photo optional. Never render plausible fabricated personal content. Date/location/bank/music null states must be readable and honest. Gift section remains with an unavailable message when gifts is empty.

Route app/wedding/page.tsx client invitation view; root page can render or redirect using link, no server redirect unsupported by export. Prefer root reuse of wedding view so both URLs work. Metadata in root layout reads NEXT_PUBLIC_SITE_URL (validated before production). Use next/font for Cormorant_Garamond and DM_Sans. Opening must not hide the underlying text from crawlers or trap keyboard permanently. Route content in a Suspense boundary if useSearchParams is used. Native URLSearchParams in effect also works.

Forms have visible labels, helper/error text and aria-live feedback. Native select/radio acceptable; no unused UI dependencies. Keep RSVP and public wishes as separate forms and submissions. Public wishes require explicit notice that name/message will be visible. Only adapter src/lib/api.ts calls backend. Persist submission UUID across retry. Use validated invitation maxGuests. No valid token means view-only, not misleading success. No fake seeded wishes.

Client Turnstile render uses official script and NEXT_PUBLIC_TURNSTILE_SITE_KEY; action rsvp/wish; reset after use and error/expiry. Missing site key blocks actual submit with readable unavailable state; tests use Cloudflare official test keys only on localhost. Helpers API in api-contracts.

Hero eager/high priority; below-fold images lazy, width/height explicit. Use local static assets only. Gold is accent. Native focus and link behavior preserved; external map rel noreferrer. Audio play only on click, play/pause and mute with accessible states, no invisible audio when closed. Lightbox Escape, next/previous controls, focus restoration. Respect reduced motion including Lenis disable. Desktop single document scroll, no fixed mobile emulator canvas.

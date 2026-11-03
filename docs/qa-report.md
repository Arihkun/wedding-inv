# Integration QA, 3 November 2026

Environment: Windows, Node 24.14.1, local Wrangler Pages on http://localhost:8788. This is local implementation evidence, not production, real-device WhatsApp or measured Core Web Vitals certification. Only synthetic guest records exist in the local preview DB; private links and local variables are ignored by Git.

## Automated evidence

- npm run check: ESLint clean, next typegen + strict TypeScript passed, 20 tests across 5 files passed, Next 16.4.4 static export generated / and /wedding.
- API integration uses real local D1/Worker runtime; Turnstile outbound is mocked in these automated tests. Covers token validation/revocation, origin/method boundaries, guest-count enforcement, same-row RSVP update, isolation across invitations, wish deduplication/conflicts/hidden status, deterministic pagination and concurrent rate limiting.
- Other tests cover explicit timezone offsets, WIB date rollover, past countdown, verified pin/Place ID URLs, malformed payloads/cursors, challenge hostname mismatch, CSV quoting and input limits, random link generation, client network errors and token body transport.
- wrangler pages functions build compiled the actual Pages Functions Worker.
- npm ci --dry-run --ignore-scripts validated manifest/lock consistency. GitHub Actions has not run remotely.
- npm audit --omit=dev reported zero production dependency vulnerabilities. Development lint tooling has moderate transitive findings; do not blindly apply suggested incompatible downgrades.

## Browser click-through (Orca embedded Chromium)

- Generic opening at 390x844: no horizontal overflow, main inert until opening, Buka Undangan works, focus moves to main. Escape also opens. Screenshot: qa/mobile-opening.png.
- Actual local invitation token resolves to synthetic guest with maxGuests=2. No hydration errors in console during normal navigation.
- Selected attending with count 2 and a synthetic private note; clicked submit; loading then persistent success appeared. Changed to declined; count input disappeared; submit updated the same RSVP. Local SQL read-back confirmed attendance=declined and guest_count=0.
- Submitted synthetic public wish, using Cloudflare official always-pass localhost test keys and real Siteverify endpoint; success and new feed entry appeared. Reload preserved both RSVP and wish. This verifies local integration, not production challenge configuration.
- Invalid-token and no-token views have no RSVP or wishes input controls. Public wishes remain readable.
- Gallery opens; ArrowRight changes image; Escape closes and releases body lock. Integration found focus-restoration bug: selected index cleared before close autofocus. Fixed using stable originating trigger ref; retest restored focus to original photo even after navigating to next image.
- Width checks at 360, 430, 768 and 1440 CSS px reported document scrollWidth <= innerWidth. Desktop sticky portrait composition visually inspected.
- Changed prefers-reduced-motion at runtime: matchMedia true and Lenis classes removed after preference event; layout remained usable.
- Offline refresh produced a readable Indonesian network error without claiming empty data. Restoring online and Coba Lagi restored feed.
- Static HTML inspection confirmed full section content, main without inert/aria-hidden in SSR, noscript gate fallback, and PNG OG asset in out. JavaScript-disabled assistive-technology behavior has not been physically tested.
- Missing wedding date, location, bank details and music produce explicit unavailable states, without fake dates, map links, accounts or audio controls.

## Remaining release checks

Supply real date/times, venue pin verification, names/parents, photos/story, bank account, and licensed music. Actual map opening, bank clipboard and audio behavior with those supplied assets still need validation. Test physical Android/iOS WhatsApp, external Maps app handoff, clipboard permission denial, final OG scraper preview, production Turnstile hostname, real DB binding and DNS/HTTPS. LCP/CLS/INP remain targets, not measured field results.

Production content checker currently rejects missing data by design. GitHub remote, Cloudflare resources and custom domain have not been provisioned. No public deployment claimed.

## Design gate for local placeholder implementation

- Hard gate PASS for exercised local scope: native labelled controls, no dead placeholder map/copy/audio controls, real persisted RSVP/wishes, keyboard opening and lightbox, verified static build. Release checks above remain required for real media/content.
- Purpose gate PASS: green/ivory establishes readable hierarchy; gold is accent; portrait panel and asymmetrical gallery support couple photography; no decorative dot grid or arbitrary sparkle emblem.
- Liveliness PASS for baseline: ENERGY 1 / RHYTHM 3 / MOTION 1, typography and portrait are focal points; story/event/gallery sections vary composition. Photos remain explicitly placeholders.
- Craftsmanship PASS for exercised states: 4 viewport widths without overflow, form success/error, missing content, offline retry, reduced-motion toggle and focus restoration verified. No universal accessibility or performance compliance claim.


## Frontend Visual & Accessibility Polish Review (Commit 9fa62c7 + follow-up)

- **Color Contrast & Typography Polish**:
  - Story Section: Date label adjusted to `text-forest text-xs font-semibold uppercase`; placeholder body adjusted to `text-secondary text-sm italic leading-relaxed`, removing low-contrast gold and alpha text. Actual card background is Surface `#F4F0E8`; the general forest/ivory ratio must not be cited as its measured card ratio.
  - Closing Section: Sub-footer credit text updated from `text-ivory/60` to larger `text-sm text-ivory/85` against actual Forest `#1C2E24`. This improves readability; no unsupported exact ratio is claimed here.
- **Neutral Tone & Factual Wedding Text**:
  - Verified and eliminated residual non-factual phrases ("janji suci" and "perjalanan suci") across `couple-section.tsx` and `wishes-section.tsx`. Wording is strictly respectful, factual, and neutral ("perayaan pernikahan kami berdua", "perjalanan baru kami berdua").
- **1024px Narrow Desktop Layout Hardening**:
  - Evaluated split layout behavior at 1024px viewport width (sticky left hero column ~426px, right editorial column ~597px).
  - Adjusted cards in `couple-section.tsx` and `events-section.tsx` to `flex-col sm:flex-row lg:flex-col xl:flex-row` so cards stack cleanly inside the 597px container at 1024px-1279px and only expand horizontally at >=1280px, avoiding column overflow and card squishing.
- **Verification Status**:
  - `npm run check` fully passes: ESLint clean, TypeScript strict typecheck clean, 20/20 Vitest unit/integration tests passing, Open Graph generation verified, and Next.js Turbopack static export completed.

Antigravity reported the final visual/build validation; Codex reviewed and merged the changes, then reran lint/typecheck successfully without opening the browser, following the user's resource-saving preference. Port 8788 was confirmed stopped. Real-media, physical-device and production checks above remain outstanding.

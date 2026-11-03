# Deployment and operations

## Local/full-stack preview

1. Node 22.12+; npm ci. Copy .env.example to .env.local, .dev.vars.example to .dev.vars. Keep these ignored. Public site URL localhost:8788, official Turnstile dummy site/secret keys for localhost only, RATE_LIMIT_SALT random >=16 chars. No tokens printed in logs.
2. npm run db:migrate:local; npm run build; npm run preview. Next dev has no API; use Wrangler for actual integration. Origin must equal APP_ORIGIN.
3. CSV in private/guests.csv, header name,maxGuests. npm run guests -- --input private/guests.csv --base-url http://localhost:8788 --out private/batch-01. Outputs raw private URLs JSON and hash-only import SQL; never prints URLs/names. File creation refuses overwrite. npx wrangler d1 execute wedding --local --file private/batch-01.sql. No destructive replace/upsert. Reuse links for retries; generating twice creates separate invitations even for the same name.

## Owner setup (not performed automatically)

Create private GitHub repo, add remote and push reviewed main. Create Cloudflare Pages Git integration with npm run build:pages and out output, plus separate preview and production D1 databases. This build command blocks main when content checks fail; non-main branch previews can build placeholders. A separate GitHub check alone would not gate Pages native Git deployment. https://developers.cloudflare.com/pages/configuration/git-integration/

Create D1 wedding and set actual database_id in wrangler.toml. Apply migrations to preview first using npx wrangler d1 migrations apply wedding --remote with explicitly verified account/database. Never run remote commands with the sample ID. Configure DB binding in Pages; branch preview must bind a separate database. Cloudflare dashboard login and secrets remain interactive.

Set build vars NEXT_PUBLIC_SITE_URL (HTTPS canonical origin) and NEXT_PUBLIC_TURNSTILE_SITE_KEY (real configured hostname). Set server secrets TURNSTILE_SECRET_KEY and RATE_LIMIT_SALT; APP_ORIGIN must exactly match production origin. Preview deployments need their own matching origin/site key/DB. Public variables are bundled at build. Never expose server secrets in NEXT_PUBLIC vars. Rate-limit salt rotation resets counters, not invitation hashes.

Replace public content, real photos, authorized music and accounts. Confirm event type/title with couple; do not infer religious ceremony. Update OG image with an approved real couple photo. Run npm run production:check with build variables loaded; this checks content, not live secrets. Run npm run check; confirm GitHub required check before merging main. Pages builds branch previews; deploy reviewed main only. Automatic pipeline will remain release-gated while placeholders persist.

HTTPS pages.dev works without buying a domain. For custom apex add Cloudflare zone/nameservers and Pages custom-domain association; for subdomain follow provided CNAME. Wait for certificate validation, verify HTTPS redirects and canonical metadata, then regenerate private links for final origin before sharing. https://developers.cloudflare.com/pages/configuration/custom-domains/

## Operations and recovery

Owner uses authenticated Cloudflare D1 console or Wrangler; no public admin API. Hide a wish: parameterized/verified UPDATE wishes SET visible=0 WHERE id=<selected ID>. Revoke an invitation: UPDATE invitations SET active=0 WHERE id=<selected ID>. Export RSVP via join on invitations/rsvps into an ignored private file; never commit rows. Display-name duplicates are not automatically merged.

Export D1 into a private file before remote schema changes. Migrations are forward-only and additive for this release. Application rollback uses a previous reviewed Pages deployment; database rollback is separate and requires reviewed restoration plan. Check Cloudflare D1 Time Travel availability/retention for chosen plan, don't assume it replaces an export.

Monitor Functions request errors/429/503 and D1 row reads/writes in Cloudflare. No token/name/message logging. Free quota is finite; investigate abuse before paid upgrades. Remove/export private guest records according to couple's retention decision after the event. No retention duration invented.

Release checklist: real locations opened on Android/iOS; token RSVP saved and updated; declined count zero; wishes stored/paginated/hidden; Turnstile expiry/reset; music reject/background/resume; copy clipboard denied; lightbox focus; reduced motion; slow mobile network; WhatsApp OG preview checked physically. Public metadata is static and recipient-neutral. Targets LCP<=2.5s, CLS<=0.1, INP<=200ms are not measured results.

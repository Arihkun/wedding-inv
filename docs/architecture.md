# Architecture

Approved: Next.js static export + React + TypeScript + Tailwind; Cloudflare Pages, Pages Functions and D1. No Next server runtime, Server Actions or POST route handlers inside app. Functions serve /api/* only; out is the static build. Pages Functions compile independently of Next.

Public content: src/config/wedding.config.ts. Missing real data is null, never fake dates, account numbers or map coordinates. Private guest CSV, raw invitation URLs and secrets remain outside Git (private/ is ignored). Production publication is gated on real content and credentials.

Frontend ownership: Antigravity owns src/app, src/sections, src/components, visual assets and design documents. Codex owns src/types, src/config, src/lib, src/hooks, functions, migrations, scripts, tests, build/deployment configuration and integration. Propose shared-contract changes through Orca before changing them. Review all work before merging.

Desktop: sticky portrait alongside editorial content, one document scroll; mobile: full-width vertical sections. Do not add religious quotations, dress codes, physical gifts or personal details without source data.

DB schema: invitations (token hash, display name, max guests, active); rsvps (unique invitation ID, attendance, count, private message); wishes (public display name/message, visibility, unique submission ID per invitation); rate_limits (atomic expiring counters). D1 is private behind a server binding; there is no public database key or public RSVP listing.

Static export: pre-generate responsive images; do not assume the default Next image optimizer runs. next/font produces self-hosted fonts at build. General metadata and OG preview are static, with no recipient names or tokens. Site can be viewed without a valid invitation, but RSVP and wishes submission require one.

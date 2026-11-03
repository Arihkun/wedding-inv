# Kinar & Oki

Premium wedding invitation. Public details in `src/config/wedding.config.ts`; all unknown event/private information remains explicit placeholders. **This repository is not a published invitation.**

## Local development

Node 22.12+ recommended. `npm ci`, then `npm run dev` for UI at localhost:3000. API is intentionally unavailable on the Next-only server; forms never simulate successful storage.

For full local integration: copy `.env.example` to `.env.local` and `.dev.vars.example` to `.dev.vars` (ignored). Replace RATE_LIMIT_SALT with a random secret at least 16 characters. Cloudflare dummy Turnstile keys are local-only. `npm run db:migrate:local`, `npm run build`, then `npm run preview` at localhost:8788. Origin must match APP_ORIGIN. Production needs real keys and binding.

`npm run check` runs lint/typecheck/tests/static build. `npm run production:check` intentionally fails while real wedding content is missing. See `docs/deployment.md` for release steps and private guest management.

## Ownership

Antigravity owns design/frontend; Codex owns architecture/backend/logic/security/integration. Collaboration uses Orca Orchestrator, with decisions in `docs/agent-discussion.md`. No secrets or guest lists in Git. Production deployment requires owner account access and real content.

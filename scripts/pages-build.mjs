import { spawnSync } from "node:child_process";
// Cloudflare builds require real content on main; branch previews can show labeled placeholders.
if (!process.env.CF_PAGES_BRANCH || process.env.CF_PAGES_BRANCH === "main") {
  const check = spawnSync(process.execPath, ["scripts/check-production.mjs"], { stdio: "inherit", env: process.env });
  if (check.status !== 0) process.exit(check.status ?? 1);
}
const og = spawnSync(process.execPath, ["scripts/generate-og.mjs"], { stdio: "inherit", env: process.env });
if (og.error) throw og.error;
if (og.status !== 0) process.exit(og.status ?? 1);
const build = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], { stdio: "inherit", env: process.env });
if (build.error) throw build.error;
process.exit(build.status ?? 1);

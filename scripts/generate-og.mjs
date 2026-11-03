import sharp from "sharp";
import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";
import { loadWeddingConfig } from "./load-config.mjs";
const config = await loadWeddingConfig();
const escapeXml = (text) => text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
const title = escapeXml(config.couple.title);
const hasPhoto = !config.hero.placeholder;
const canvas = sharp({ create: { width: 1200, height: 630, channels: 4, background: "#1C2E24" } });
const overlays = [];
if (hasPhoto) {
  if (!config.hero.src.startsWith("/") || config.hero.src.includes("..")) throw new Error("OG hero must be a local public asset.");
  overlays.push({ input: await sharp(resolve("public", config.hero.src.slice(1))).resize(450, 550, { fit: "cover" }).png().toBuffer(), left: 710, top: 40 });
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect x="30" y="30" width="1140" height="570" fill="none" stroke="#C5A059" stroke-width="1"/><text x="${hasPhoto ? 80 : 600}" y="200" text-anchor="${hasPhoto ? "start" : "middle"}" font-family="Georgia,serif" font-size="20" letter-spacing="4" fill="#D8BD82">UNDANGAN PERNIKAHAN</text><text x="${hasPhoto ? 80 : 600}" y="330" text-anchor="${hasPhoto ? "start" : "middle"}" font-family="Georgia,serif" font-size="${hasPhoto ? 74 : 100}" fill="#FDFBF7">${title}</text><text x="${hasPhoto ? 80 : 600}" y="420" text-anchor="${hasPhoto ? "start" : "middle"}" font-family="sans-serif" font-size="22" fill="#FDFBF7">Dengan hangat, kami mengundang Anda.</text>${hasPhoto ? "" : '<text x="600" y="510" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#D8BD82">Foto pasangan akan ditambahkan</text>'}</svg>`;
overlays.push({ input: Buffer.from(svg), left: 0, top: 0 });
await mkdir("public/images", { recursive: true });
await canvas.composite(overlays).png().toFile("public/images/og.png");
console.log("Generated 1200x630 Open Graph PNG from centralized configuration.");

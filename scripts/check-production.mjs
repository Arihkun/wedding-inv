import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { loadWeddingConfig } from "./load-config.mjs";
const c = await loadWeddingConfig();
const issues = [];
const requireValue = (value, label) => { if (!value) issues.push(`${label} belum tersedia.`); };
requireValue(process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://"), "NEXT_PUBLIC_SITE_URL HTTPS");
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
if (!siteKey || /^[123]x0/.test(siteKey)) issues.push("Turnstile site key produksi belum tersedia.");
requireValue(c.weddingDate && /(?:Z|[+-]\d{2}:\d{2})$/.test(c.weddingDate) && Number.isFinite(Date.parse(c.weddingDate)), "Tanggal pernikahan ber-offset");
for (const profile of [c.couple.bride, c.couple.groom]) {
  for (const field of ["fullName", "father", "mother"]) requireValue(profile[field], `${profile.nickname}.${field}`);
}
for (const event of c.events) {
  for (const field of ["startsAt", "endsAt", "venue", "address"]) requireValue(event[field], `${event.id}.${field}`);
  if (!event.location?.verified || !Number.isFinite(event.location?.latitude) || !Number.isFinite(event.location?.longitude) || Math.abs(event.location.latitude) > 90 || Math.abs(event.location.longitude) > 180) issues.push(`${event.id}: titik lokasi belum diverifikasi.`);
  if (!event.startsAt || !event.endsAt || !/(?:Z|[+-]\d{2}:\d{2})$/.test(event.startsAt) || !/(?:Z|[+-]\d{2}:\d{2})$/.test(event.endsAt) || !(Date.parse(event.endsAt) > Date.parse(event.startsAt))) issues.push(`${event.id}: rentang waktu ber-offset belum valid.`);
}
for (const story of c.story) { requireValue(story.date, `Story ${story.id} tanggal`); requireValue(story.description, `Story ${story.id} cerita`); }
if (!c.events.length) issues.push("Minimal satu acara diperlukan.");
if (!c.gifts.length || c.gifts.some((g) => !g.bank || !g.holder || !g.accountNumber)) issues.push("Rekening wedding gift belum lengkap.");
if (!c.music?.src || !c.music?.license) issues.push("Musik dan bukti hak penggunaan belum tersedia.");
const photos = [c.hero, c.couple.bride.photo, c.couple.groom.photo, ...c.gallery, ...c.story.flatMap((s) => s.photo ? [s.photo] : []), ...(c.qris ? [c.qris] : [])];
for (const photo of photos) {
  if (photo.placeholder) issues.push(`${photo.alt}: masih placeholder.`);
  if (!photo.src.startsWith("/") || photo.src.includes("..")) issues.push("Aset harus lokal dan berada dalam public/.");
  else await access(resolve("public", photo.src.slice(1))).catch(() => issues.push(`Aset tidak ditemukan: ${photo.src}`));
}
if (c.music?.src) await access(resolve("public", c.music.src.replace(/^\//, ""))).catch(() => issues.push("File musik tidak ditemukan."));
if (issues.length) { console.error("Belum dapat dipublikasikan:\n" + issues.map((item) => `- ${item}`).join("\n")); process.exitCode = 1; }
else console.log("Public content checks passed. Verify real server secrets, hostname, DB binding, media permissions, OG image and device tests separately before production.");

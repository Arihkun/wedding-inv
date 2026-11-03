import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, relative, dirname, isAbsolute } from "node:path";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

export function parseCsv(source) {
  const rows = [];
  let row = [], cell = "", quoted = false, closed = false;
  const input = source.replace(/^\uFEFF/, "");
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quoted) {
      if (c === '"' && input[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else cell += c;
    } else if (c === '"' && !cell && !closed) quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; closed = false; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && input[i + 1] === "\n") i++;
      row.push(cell); if (row.some((x) => x.trim())) rows.push(row);
      row = []; cell = ""; closed = false;
    } else {
      if (closed || c === '"') throw new Error("CSV quoting tidak valid.");
      cell += c;
    }
  }
  if (quoted) throw new Error("CSV memiliki kutipan yang belum ditutup.");
  row.push(cell); if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}
export function validateGuests(source) {
  const [headers, ...rows] = parseCsv(source);
  if (!headers || headers.join(",") !== "name,maxGuests") throw new Error("Header CSV harus persis name,maxGuests.");
  if (!rows.length) throw new Error("Daftar undangan kosong.");
  return rows.map((row, index) => {
    const name = row[0]?.trim();
    const maxGuests = Number(row[1]);
    if (row.length !== 2 || !name || name.length > 100 || /[\u0000-\u001f\u007f]/.test(name) || !/^\d+$/.test(row[1]) || !Number.isInteger(maxGuests) || maxGuests < 1 || maxGuests > 20)
      throw new Error(`Baris ${index + 2} tidak valid. Nama 1–100 karakter; maxGuests 1–20.`);
    return { name, maxGuests };
  });
}
export function generateInvitations(guests, baseUrl) {
  const origin = new URL(baseUrl);
  if (!(["https:"].includes(origin.protocol) || (origin.protocol === "http:" && ["localhost", "127.0.0.1"].includes(origin.hostname)))) throw new Error("Base URL harus HTTPS atau localhost.");
  if (origin.username || origin.password || origin.search || origin.hash || origin.pathname !== "/") throw new Error("Base URL harus origin tanpa path, query, atau credentials.");
  return guests.map((guest) => {
    const token = randomBytes(32).toString("base64url");
    return { id: randomUUID(), ...guest, tokenHash: createHash("sha256").update(token).digest("hex"), url: `${origin.origin}/wedding?invite=${token}` };
  });
}
function sqlLiteral(value) { return `'${value.replaceAll("'", "''")}'`; }

async function main() {
  const options = Object.fromEntries(process.argv.slice(2).reduce((pairs, arg, index, args) => index % 2 === 0 ? [...pairs, [arg, args[index + 1]]] : pairs, []));
  if (!options["--input"] || !options["--base-url"] || !options["--out"]) throw new Error("Usage: npm run guests -- --input private/guests.csv --base-url https://your-domain --out private/batch-01");
  const stem = resolve(options["--out"]);
  const rel = relative(resolve("private"), stem);
  if (!rel || rel.startsWith("..") || isAbsolute(rel)) throw new Error("Output wajib berada di folder private/.");
  const guests = validateGuests(await readFile(options["--input"], "utf8"));
  const invitations = generateInvitations(guests, options["--base-url"]);
  const sql = invitations.map((guest) => `INSERT INTO invitations(id,token_hash,name,max_guests) VALUES(${sqlLiteral(guest.id)},${sqlLiteral(guest.tokenHash)},${sqlLiteral(guest.name)},${guest.maxGuests});`).join("\n");
  await mkdir(dirname(stem), { recursive: true });
  const records = invitations.map(({ id, name, maxGuests, url }) => ({ id, name, maxGuests, url }));
  await writeFile(`${stem}.json`, JSON.stringify(records, null, 2), { flag: "wx", mode: 0o600 });
  await writeFile(`${stem}.sql`, sql + "\n", { flag: "wx", mode: 0o600 });
  console.log(`Generated ${records.length} invitations. Private links: ${relative(process.cwd(), stem)}.json; import SQL: ${relative(process.cwd(), stem)}.sql. No database was modified. Reuse this export; generating again creates different invitations.`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}

import { expect, it } from "vitest";
import { generateInvitations, parseCsv, validateGuests } from "../scripts/guests.mjs";
it("preserves quoted names and never silently accepts bad guest rows", () => {
  expect(parseCsv('name,maxGuests\r\n"A, B",2\r\n"C ""D""",1')).toEqual([["name", "maxGuests"], ["A, B", "2"], ['C "D"', "1"]]);
  for (const source of ["wrong,header\nA,1", "name,maxGuests\nA,0", "name,maxGuests\nA,1.5", 'name,maxGuests\n"A,1']) expect(() => validateGuests(source)).toThrow();
});
it("generates different unguessable URLs and stores hashes separately", () => {
  const [a, b] = generateInvitations([{ name: "Test fixture", maxGuests: 2 }, { name: "Test fixture", maxGuests: 2 }], "https://example.com");
  expect(a.url).not.toBe(b.url);
  expect(new URL(a.url).searchParams.get("invite")).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(a.tokenHash).toMatch(/^[0-9a-f]{64}$/);
  expect(() => generateInvitations([], "http://unsafe.example")).toThrow();
});

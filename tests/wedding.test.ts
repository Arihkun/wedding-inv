import { describe, expect, it } from "vitest";
import { countdownTo, formatEventDate, getMapLinks } from "../src/lib/wedding";
import type { WeddingEvent } from "../src/types/wedding";
describe("event dates and exact map links", () => {
  it("does not invent a countdown for absent/ambiguous dates", () => {
    expect(countdownTo(null)).toBeNull();
    expect(countdownTo("2026-12-12T09:00:00")).toBeNull();
    expect(countdownTo("invalid")).toBeNull();
  });
  it("counts the same instant with WIB offset and never becomes negative", () => {
    const now = Date.parse("2026-12-11T01:59:59Z");
    expect(countdownTo("2026-12-12T09:00:00+07:00", now)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 1, arrived: false });
    expect(countdownTo("2026-12-12T09:00:00+07:00", Date.parse("2026-12-12T02:00:00Z"))).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, arrived: true });
  });
  it("formats dates in event timezone, not the visitor timezone", () => {
    expect(formatEventDate("2026-12-11T18:00:00Z")).toMatch(/Sabtu.*12 Desember 2026/);
  });
  it("requires verified valid coordinates and preserves Place ID", () => {
    const event: WeddingEvent = { id: "test", title: "Test fixture", startsAt: null, endsAt: null, venue: null, address: null, location: null };
    expect(getMapLinks(event)).toBeNull();
    expect(getMapLinks({ ...event, location: { latitude: 0, longitude: 0, verified: false } })).toBeNull();
    expect(getMapLinks({ ...event, location: { latitude: 91, longitude: 0, verified: true } })).toBeNull();
    const links = getMapLinks({ ...event, location: { latitude: 0, longitude: 0, verified: true, placeId: "test place" } })!;
    expect(new URL(links.directions).searchParams.get("destination")).toBe("0,0");
    expect(new URL(links.location).searchParams.get("query_place_id")).toBe("test place");
  });
});

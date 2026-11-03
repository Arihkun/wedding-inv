import type { WeddingEvent } from "@/types/wedding";
export interface Countdown { days: number; hours: number; minutes: number; seconds: number; arrived: boolean }
export function countdownTo(date: string | null, now = Date.now()): Countdown | null {
  if (!date || !/(?:Z|[+-]\d{2}:\d{2})$/.test(date)) return null;
  const target = Date.parse(date);
  if (!Number.isFinite(target)) return null;
  const seconds = Math.max(0, Math.floor((target - now) / 1000));
  return { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60, arrived: now >= target };
}
export function formatEventDate(date: string | null, timezone = "Asia/Jakarta", locale = "id-ID") {
  if (!date || !Number.isFinite(Date.parse(date))) return "Tanggal akan diumumkan";
  return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: timezone }).format(new Date(date));
}
export function formatEventTime(date: string | null, timezone = "Asia/Jakarta", locale = "id-ID") {
  if (!date || !Number.isFinite(Date.parse(date))) return "Waktu akan diumumkan";
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: timezone, timeZoneName: "short" }).format(new Date(date));
}
export function getMapLinks(event: WeddingEvent): { location: string; directions: string } | null {
  const pin = event.location;
  if (!pin?.verified || !Number.isFinite(pin.latitude) || !Number.isFinite(pin.longitude) || Math.abs(pin.latitude) > 90 || Math.abs(pin.longitude) > 180) return null;
  const coordinates = `${pin.latitude},${pin.longitude}`;
  const search = new URLSearchParams({ api: "1", query: coordinates });
  const directions = new URLSearchParams({ api: "1", destination: coordinates });
  if (pin.placeId) { search.set("query_place_id", pin.placeId); directions.set("destination_place_id", pin.placeId); }
  return { location: `https://www.google.com/maps/search/?${search}`, directions: `https://www.google.com/maps/dir/?${directions}` };
}

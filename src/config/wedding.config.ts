import type { Photo, WeddingConfig } from "@/types/wedding";
const placeholder = (alt: string): Photo => ({ src: "/images/placeholder.svg", alt, width: 1200, height: 1600, placeholder: true });
export const weddingConfig: WeddingConfig = {
  couple: {
    title: "Kinar & Oki",
    bride: { nickname: "Kinar", fullName: null, father: null, mother: null, instagram: null, photo: placeholder("Placeholder foto Kinar") },
    groom: { nickname: "Oki", fullName: null, father: null, mother: null, instagram: null, photo: placeholder("Placeholder foto Oki") },
  },
  timezone: "Asia/Jakarta",
  locale: "id-ID",
  weddingDate: null,
  hero: placeholder("Placeholder foto bersama Kinar dan Oki"),
  events: [
    { id: "ceremony", title: "Prosesi Pernikahan", startsAt: null, endsAt: null, venue: null, address: null, location: null },
    { id: "reception", title: "Resepsi", startsAt: null, endsAt: null, venue: null, address: null, location: null },
  ],
  story: [
    { id: "first-meet", title: "Pertemuan Pertama", date: null, description: null },
    { id: "closer", title: "Tumbuh Bersama", date: null, description: null },
    { id: "engagement", title: "Sebuah Komitmen", date: null, description: null },
    { id: "wedding", title: "Menuju Hari Bahagia", date: null, description: null },
  ],
  gallery: [placeholder("Placeholder galeri foto 1"), placeholder("Placeholder galeri foto 2"), placeholder("Placeholder galeri foto 3"), placeholder("Placeholder galeri foto 4")],
  gifts: [],
  qris: null,
  music: null,
  invitation: { defaultGreeting: "Tamu Undangan", maxWishLength: 1000 },
};

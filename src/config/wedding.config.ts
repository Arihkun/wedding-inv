import type { WeddingConfig } from "@/types/wedding";

export const weddingConfig: WeddingConfig = {
  couple: {
    title: "Kinar & Oki",
    bride: {
      nickname: "Kinar",
      fullName: null,
      father: null,
      mother: null,
      instagram: null,
      photo: {
        src: "/images/dummy/bride.jpg",
        alt: "Foto Mempelai Wanita - Kinar",
        width: 800,
        height: 1067,
      },
    },
    groom: {
      nickname: "Oki",
      fullName: null,
      father: null,
      mother: null,
      instagram: null,
      photo: {
        src: "/images/dummy/groom.jpg",
        alt: "Foto Mempelai Pria - Oki",
        width: 800,
        height: 1067,
      },
    },
  },
  timezone: "Asia/Jakarta",
  locale: "id-ID",
  weddingDate: null,
  hero: {
    src: "/images/dummy/hero-couple.jpg",
    alt: "Foto Pre-wedding Kinar & Oki",
    width: 1200,
    height: 1600,
  },
  events: [
    {
      id: "ceremony",
      title: "Prosesi Pernikahan",
      startsAt: null,
      endsAt: null,
      venue: null,
      address: null,
      location: null,
    },
    {
      id: "reception",
      title: "Resepsi",
      startsAt: null,
      endsAt: null,
      venue: null,
      address: null,
      location: null,
    },
  ],
  story: [
    { id: "first-meet", title: "Pertemuan Pertama", date: null, description: null },
    { id: "closer", title: "Tumbuh Bersama", date: null, description: null },
    { id: "engagement", title: "Sebuah Komitmen", date: null, description: null },
    { id: "wedding", title: "Menuju Hari Bahagia", date: null, description: null },
  ],
  gallery: [
    {
      src: "/images/dummy/gallery-1.jpg",
      alt: "Momen Bahagia 1 - Bergandengan di Taman",
      width: 800,
      height: 1000,
    },
    {
      src: "/images/dummy/gallery-2.jpg",
      alt: "Momen Bahagia 2 - Cincin dan Bunga",
      width: 800,
      height: 800,
    },
    {
      src: "/images/dummy/gallery-3.jpg",
      alt: "Momen Bahagia 3 - Tatapan Kasih",
      width: 800,
      height: 800,
    },
    {
      src: "/images/dummy/gallery-4.jpg",
      alt: "Momen Bahagia 4 - Kebahagiaan Bersama",
      width: 1200,
      height: 750,
    },
  ],
  gifts: [],
  qris: null,
  music: null,
  invitation: { defaultGreeting: "Tamu Undangan", maxWishLength: 1000 },
};

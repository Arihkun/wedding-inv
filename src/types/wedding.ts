export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
  placeholder?: boolean;
}
export interface Profile {
  nickname: string;
  fullName: string | null;
  father: string | null;
  mother: string | null;
  instagram: string | null;
  photo: Photo;
}
export interface WeddingEvent {
  id: string;
  title: string;
  startsAt: string | null;
  endsAt: string | null;
  venue: string | null;
  address: string | null;
  location: { latitude: number; longitude: number; placeId?: string; verified: boolean } | null;
}
export interface WeddingConfig {
  couple: { title: string; bride: Profile; groom: Profile };
  timezone: string;
  locale: string;
  weddingDate: string | null;
  hero: Photo;
  events: WeddingEvent[];
  story: { id: string; title: string; date: string | null; description: string | null; photo?: Photo }[];
  gallery: Photo[];
  gifts: { bank: string; accountNumber: string; holder: string }[];
  qris: Photo | null;
  music: { src: string; title: string; license: string } | null;
  invitation: { defaultGreeting: string; maxWishLength: number };
}

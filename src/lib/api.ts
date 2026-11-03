import type { InvitationData, RsvpData, RsvpInput, Wish, WishInput, WishesPage } from "@/types/api";
export class ApiError extends Error {
  constructor(public code: string, message: string, public status: number) { super(message); }
}
async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    referrerPolicy: "no-referrer",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(data?.error?.code ?? "UNAVAILABLE", data?.error?.message ?? "Layanan belum tersedia. Silakan coba lagi.", response.status);
  return data as T;
}
export const resolveInvitation = (token: string) => request<InvitationData>("/api/invitations/resolve", "POST", { token });
export const saveRsvp = (token: string, input: RsvpInput, turnstileToken: string) => request<RsvpData>("/api/rsvp", "PUT", { token, ...input, turnstileToken });
export const getWishes = (cursor?: string) => request<WishesPage>(`/api/wishes${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`);
export const sendWish = (token: string, input: WishInput, turnstileToken: string) => request<Wish>("/api/wishes", "POST", { token, ...input, turnstileToken });

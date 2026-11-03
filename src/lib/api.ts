import type { InvitationData, RsvpData, RsvpInput, Wish, WishInput, WishesPage } from "@/types/api";
export class ApiError extends Error {
  constructor(public code: string, message: string, public status: number) { super(message); }
}
async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    });
  } catch {
    throw new ApiError("NETWORK", "Koneksi belum tersedia. Periksa jaringan Anda lalu coba lagi.", 0);
  } finally {
    clearTimeout(timeout);
  }
  const data = await response.json().catch(() => null) as { error?: { code?: string; message?: string } } | null;
  if (!response.ok) throw new ApiError(data?.error?.code ?? "UNAVAILABLE", data?.error?.message ?? "Layanan belum tersedia. Silakan coba lagi.", response.status);
  if (!data || typeof data !== "object") throw new ApiError("BAD_RESPONSE", "Layanan belum tersedia. Silakan coba lagi.", response.status);
  return data as T;
}
export const resolveInvitation = (token: string) => request<InvitationData>("/api/invitations/resolve", "POST", { token });
export const saveRsvp = (token: string, input: RsvpInput, turnstileToken: string) => request<RsvpData>("/api/rsvp", "PUT", { token, ...input, turnstileToken });
export const getWishes = (cursor?: string) => request<WishesPage>(`/api/wishes${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`);
export const sendWish = (token: string, input: WishInput, turnstileToken: string) => request<Wish>("/api/wishes", "POST", { token, ...input, turnstileToken });

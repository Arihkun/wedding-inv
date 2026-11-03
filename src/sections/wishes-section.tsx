"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, Send, RefreshCw, AlertCircle, CheckCircle2, User, Eye, ShieldAlert } from "lucide-react";
import { useInvitation } from "@/components/invitation-provider";
import { getWishes, sendWish } from "@/lib/api";
import { TurnstileWidget, type TurnstileHandle } from "@/components/turnstile";
import type { Wish, WishInput, InvitationData } from "@/types/api";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function WishesForm({
  token,
  invitation,
  onWishCreated,
}: {
  token: string;
  invitation: InvitationData;
  onWishCreated: (wish: Wish) => void;
}) {
  const [name, setName] = useState<string>(() => invitation.name || "");
  const [message, setMessage] = useState<string>("");
  const [submissionId, setSubmissionId] = useState<string>(() =>
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : "sub-" + Math.random().toString(36).slice(2)
  );
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!SITE_KEY) {
      setFormError("Layanan verifikasi keamanan sedang tidak tersedia. Pengiriman formulir dinonaktifkan.");
      return;
    }

    if (!turnstileToken) {
      setFormError("Harap lengkapi verifikasi keamanan terlebih dahulu.");
      return;
    }

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setFormError("Nama pengirim tidak boleh kosong.");
      return;
    }

    if (!trimmedMessage) {
      setFormError("Pesan ucapan tidak boleh kosong.");
      return;
    }

    const payload: WishInput = {
      name: trimmedName,
      message: trimmedMessage,
      submissionId, // Stable UUID preserved across retry
    };

    setIsSubmitting(true);

    try {
      const newWish = await sendWish(token, payload, turnstileToken);
      onWishCreated(newWish);
      setFormSuccess("Terima kasih atas doa dan ucapan hangat Anda!");
      setMessage("");
      setSubmissionId(
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : "sub-" + Math.random().toString(36).slice(2)
      );
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirimkan ucapan. Silakan coba lagi.";
      setFormError(msg);
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-2xl bg-ivory border border-border-strong text-left space-y-5 shadow-sm"
    >
      {/* Public Disclosure Notice */}
      <div className="p-3.5 rounded-xl bg-surface border border-border-strong flex items-start gap-2.5 text-xs text-secondary leading-relaxed">
        <Eye className="w-4 h-4 text-forest shrink-0 mt-0.5" />
        <span>
          <strong>Pemberitahuan Publik:</strong> Nama dan pesan doa yang Anda kirimkan akan ditampilkan secara terbuka pada buku tamu digital di bawah ini.
        </span>
      </div>

      {/* Name Input */}
      <div className="space-y-1.5">
        <label htmlFor="wish-name" className="block text-sm font-semibold uppercase tracking-wider text-forest">
          Nama Pengirim <span className="text-rose-600">*</span>
        </label>
        <div className="relative">
          <input
            id="wish-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
            placeholder="Nama Lengkap / Panggilan Anda"
            className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-surface border border-border-strong text-forest text-base focus:outline-none focus:ring-2 focus:ring-forest pl-11"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="space-y-1.5">
        <label htmlFor="wish-message" className="block text-sm font-semibold uppercase tracking-wider text-forest">
          Doa &amp; Ucapan <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="wish-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          required
          rows={4}
          placeholder="Tuliskan doa restu, ucapan selamat, dan harapan terbaik Anda..."
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border-strong text-forest text-base focus:outline-none focus:ring-2 focus:ring-forest resize-none leading-relaxed"
        />
        <div className="flex justify-end text-xs text-secondary">
          <span>{message.length} / 1000</span>
        </div>
      </div>

      {/* Turnstile Security Widget */}
      <TurnstileWidget
        ref={turnstileRef}
        action="wish"
        onSuccess={(tok) => setTurnstileToken(tok)}
        onError={() => setTurnstileToken(null)}
        onExpire={() => setTurnstileToken(null)}
      />

      {/* Error & Success Feedback */}
      {formError && (
        <div
          className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-sm flex items-start gap-2.5"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-700" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-sm flex items-start gap-2.5"
          role="status"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-700" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Submit Button (min 44px tap target) */}
      <button
        type="submit"
        disabled={isSubmitting || !SITE_KEY}
        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 min-h-[48px] rounded-xl bg-forest text-ivory text-base font-semibold hover:bg-forest-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
      >
        {isSubmitting ? (
          <span>Mengirimkan Doa...</span>
        ) : (
          <>
            <Send className="w-4 h-4 text-gold" aria-hidden="true" />
            <span>Kirimkan Doa Restu</span>
          </>
        )}
      </button>
    </form>
  );
}

export function WishesSection() {
  const { token, invitation } = useInvitation();

  // Feed State
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);

  const mergeWishes = (existing: Wish[], incoming: Wish[]): Wish[] => {
    const seen = new Set<string>();
    const result: Wish[] = [];
    for (const item of [...incoming, ...existing]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
      }
    }
    return result;
  };

  const fetchWishes = useCallback(async (cursor?: string) => {
    if (cursor) {
      setIsLoadingMore(true);
    } else {
      setIsLoadingFeed(true);
    }
    setFeedError(null);

    try {
      const page = await getWishes(cursor);
      setWishes((prev) => (cursor ? mergeWishes(prev, page.items) : page.items));
      setNextCursor(page.nextCursor);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat daftar doa dan ucapan.";
      setFeedError(msg);
    } finally {
      setIsLoadingFeed(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getWishes()
      .then((page) => {
        if (isMounted) {
          setWishes(page.items);
          setNextCursor(page.nextCursor);
          setIsLoadingFeed(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Gagal memuat daftar doa dan ucapan.";
          setFeedError(msg);
          setIsLoadingFeed(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="wishes"
      aria-label="Doa dan Ucapan Tamu"
      className="py-20 px-6 bg-surface text-forest border-t border-border-subtle"
    >
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-forest text-gold mb-2">
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-secondary font-medium">
            BUKU TAMU &amp; DOA RESTU
          </p>
          <h2 className="editorial-title text-3xl sm:text-4xl text-forest font-normal">
            Untaian Doa &amp; Harapan
          </h2>
          <p className="text-base text-secondary max-w-md mx-auto leading-relaxed">
            Tinggalkan doa restu dan pesan hangat untuk mengiringi awal perjalanan suci kami berdua.
          </p>
        </div>

        {/* Wishes Form: requires BOTH token AND validated invitation */}
        {!token || !invitation ? (
          <div className="p-8 rounded-2xl bg-ivory border border-border-strong text-left space-y-2">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="font-serif text-lg font-medium text-forest">
                  Mode Hanya-Lihat (View-Only)
                </p>
                <p className="text-sm text-secondary leading-relaxed mt-1">
                  Formulir pengiriman doa restu hanya aktif melalui tautan undangan resmi yang telah tervalidasi. Anda tetap dapat membaca doa dan ucapan dari para sahabat dan keluarga di bawah ini.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <WishesForm
            key={token}
            token={token}
            invitation={invitation}
            onWishCreated={(newWish) => {
              setWishes((prev) => mergeWishes(prev, [newWish]));
            }}
          />
        )}

        {/* Public Wishes Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border-strong pb-3">
            <h3 className="font-serif text-xl font-medium text-forest">
              Buku Tamu Digital ({wishes.length})
            </h3>
            <button
              type="button"
              onClick={() => fetchWishes()}
              disabled={isLoadingFeed}
              className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-forest transition-colors min-h-[44px] px-2 py-1"
              title="Segarkan ucapan"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFeed ? "animate-spin" : ""}`} />
              <span>Segarkan</span>
            </button>
          </div>

          {feedError ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-sm flex items-center justify-between">
              <span>{feedError}</span>
              <button
                type="button"
                onClick={() => fetchWishes()}
                className="underline hover:text-rose-950 ml-2 font-medium min-h-[44px] px-2 py-1 flex items-center"
              >
                Coba Lagi
              </button>
            </div>
          ) : isLoadingFeed && wishes.length === 0 ? (
            <div className="py-12 text-center text-secondary text-sm flex flex-col items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-forest" />
              <span>Memuat doa restu para tamu...</span>
            </div>
          ) : wishes.length === 0 ? (
            <div className="py-12 px-6 text-center rounded-2xl bg-ivory border border-border-strong text-secondary space-y-2">
              <p className="font-serif text-lg text-forest font-medium">Belum ada ucapan doa</p>
              <p className="text-sm">
                Jadilah yang pertama memberikan ucapan selamat dan doa restu bagi kedua mempelai!
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
              {wishes.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-ivory border border-border-strong text-left space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-medium text-forest">
                      {item.name}
                    </span>
                    <span className="text-xs text-secondary">
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(item.createdAt))}
                    </span>
                  </div>

                  <p className="text-base text-forest leading-relaxed whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere]">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {nextCursor && !feedError && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => fetchWishes(nextCursor)}
                disabled={isLoadingMore}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl border border-border-strong bg-ivory text-forest text-sm font-medium hover:bg-surface transition-colors shadow-2xs disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memuat ucapan lainnya...</span>
                  </>
                ) : (
                  <span>Muat Lebih Banyak Ucapan</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

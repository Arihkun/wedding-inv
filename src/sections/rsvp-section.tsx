"use client";

import { useState, useRef } from "react";
import { CheckCircle2, AlertCircle, Send, Users, ShieldAlert } from "lucide-react";
import { useInvitation } from "@/components/invitation-provider";
import { saveRsvp } from "@/lib/api";
import { TurnstileWidget, type TurnstileHandle } from "@/components/turnstile";
import type { Attendance, RsvpInput, InvitationData } from "@/types/api";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function RsvpActiveForm({
  token,
  invitation,
  onRsvpUpdated,
}: {
  token: string;
  invitation: InvitationData;
  onRsvpUpdated: (rsvp: InvitationData["rsvp"]) => void;
}) {
  const [attendance, setAttendance] = useState<Attendance>(
    () => invitation.rsvp?.attendance ?? "attending"
  );
  const [guestCount, setGuestCount] = useState<number>(
    () => (invitation.rsvp?.guestCount && invitation.rsvp.guestCount > 0 ? invitation.rsvp.guestCount : 1)
  );
  const [message, setMessage] = useState<string>(
    () => invitation.rsvp?.message ?? ""
  );

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const maxGuests = invitation.maxGuests || 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!SITE_KEY) {
      setErrorMessage("Sistem keamanan Turnstile sedang tidak tersedia. Pengiriman formulir dinonaktifkan.");
      return;
    }

    if (!turnstileToken) {
      setErrorMessage("Harap lengkapi verifikasi keamanan terlebih dahulu.");
      return;
    }

    const payload: RsvpInput = {
      attendance,
      guestCount: attendance === "attending" ? Number(guestCount) : 0,
      message: message.trim(),
    };

    setIsSubmitting(true);

    try {
      const result = await saveRsvp(token, payload, turnstileToken);
      onRsvpUpdated(result);
      setSuccessMessage("Terima kasih! Konfirmasi kehadiran Anda berhasil disimpan.");
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan konfirmasi. Silakan coba lagi.";
      setErrorMessage(msg);
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-2xl bg-surface border border-border-strong text-left space-y-6 shadow-sm"
    >
      {/* Recipient status indicator */}
      <div className="p-3.5 rounded-xl bg-ivory border border-border-subtle flex items-center justify-between">
        <div>
          <p className="text-xs text-secondary">Tamu Undangan:</p>
          <p className="text-sm font-semibold text-forest">{invitation.name}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-secondary">Maks. Kuota:</span>
          <p className="text-xs font-semibold text-forest">{invitation.maxGuests} Orang</p>
        </div>
      </div>

      {/* Attendance selection */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-forest">
          Kehadiran <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAttendance("attending")}
            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              attendance === "attending"
                ? "bg-forest text-ivory border-forest shadow-xs"
                : "bg-ivory text-secondary border-border-strong hover:bg-surface"
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 ${
                attendance === "attending" ? "text-gold" : "text-secondary"
              }`}
            />
            <span>Akan Hadir</span>
          </button>

          <button
            type="button"
            onClick={() => setAttendance("declined")}
            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              attendance === "declined"
                ? "bg-forest text-ivory border-forest shadow-xs"
                : "bg-ivory text-secondary border-border-strong hover:bg-surface"
            }`}
          >
            <AlertCircle
              className={`w-4 h-4 ${
                attendance === "declined" ? "text-gold" : "text-secondary"
              }`}
            />
            <span>Tidak Hadir</span>
          </button>
        </div>
      </div>

      {/* Guest Count (if attending) */}
      {attendance === "attending" && (
        <div className="space-y-2">
          <label
            htmlFor="guest-count"
            className="block text-xs font-semibold uppercase tracking-wider text-forest"
          >
            Jumlah Tamu Hadir <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              id="guest-count"
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-strong text-forest text-sm focus:outline-none focus:ring-2 focus:ring-forest appearance-none pr-10"
            >
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} Orang
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] text-secondary">
            Undangan Anda dialokasikan untuk maksimal {maxGuests} orang tamu.
          </p>
        </div>
      )}

      {/* Private Note / Message */}
      <div className="space-y-2">
        <label
          htmlFor="rsvp-message"
          className="block text-xs font-semibold uppercase tracking-wider text-forest"
        >
          Pesan Khusus untuk Mempelai (Opsional)
        </label>
        <textarea
          id="rsvp-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="Tuliskan ucapan atau catatan privat untuk kedua mempelai..."
          className="w-full px-4 py-3 rounded-xl bg-ivory border border-border-strong text-forest text-sm focus:outline-none focus:ring-2 focus:ring-forest resize-none"
        />
        <div className="flex justify-between text-[11px] text-secondary">
          <span>Catatan ini hanya dapat dibaca oleh kedua mempelai.</span>
          <span>{message.length} / 1000</span>
        </div>
      </div>

      {/* Turnstile Security Widget */}
      <TurnstileWidget
        ref={turnstileRef}
        action="rsvp"
        onSuccess={(t) => setTurnstileToken(t)}
        onError={() => setTurnstileToken(null)}
        onExpire={() => setTurnstileToken(null)}
      />

      {/* Feedback Alerts */}
      {errorMessage && (
        <div
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !SITE_KEY}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest text-ivory text-sm font-semibold hover:bg-forest-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
      >
        {isSubmitting ? (
          <span>Menyimpan Konfirmasi...</span>
        ) : (
          <>
            <Send className="w-4 h-4 text-gold" aria-hidden="true" />
            <span>
              {invitation.rsvp ? "Perbarui Konfirmasi Kehadiran" : "Kirim Konfirmasi Kehadiran"}
            </span>
          </>
        )}
      </button>
    </form>
  );
}

export function RsvpSection() {
  const { token, invitation, updateRsvpInState } = useInvitation();

  return (
    <section
      id="rsvp"
      aria-label="Konfirmasi Kehadiran"
      className="py-20 px-6 bg-ivory text-forest border-t border-border-subtle"
    >
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-secondary font-medium">
            RESERVASI TEMPAT
          </p>
          <h2 className="editorial-title text-3xl sm:text-4xl text-forest font-normal">
            Konfirmasi Kehadiran (RSVP)
          </h2>
          <p className="text-sm text-secondary max-w-md mx-auto">
            Mohon konfirmasikan kehadiran Anda agar kami dapat mempersiapkan jamuan terbaik bagi Anda.
          </p>
        </div>

        {!token || !invitation ? (
          <div className="p-8 rounded-2xl bg-surface border border-border-strong text-left space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="font-serif text-lg font-medium text-forest">
                  Mode Hanya-Lihat (View-Only)
                </p>
                <p className="text-xs text-secondary leading-relaxed mt-1">
                  Fitur RSVP hanya dapat diakses melalui tautan undangan personal yang dikirimkan langsung oleh kedua mempelai. Jika Anda menerima tautan ini via pesan singkat, pastikan membuka tautan lengkap beserta kode undangan Anda.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <RsvpActiveForm
            key={invitation.rsvp?.updatedAt ?? "initial"}
            token={token}
            invitation={invitation}
            onRsvpUpdated={(rsvp) => {
              if (rsvp) updateRsvpInState(rsvp);
            }}
          />
        )}
      </div>
    </section>
  );
}

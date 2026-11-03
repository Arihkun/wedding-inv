"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { InvitationData, RsvpData } from "@/types/api";
import { resolveInvitation } from "@/lib/api";

interface InvitationContextValue {
  token: string | null;
  invitation: InvitationData | null;
  isLoading: boolean;
  error: string | null;
  isGateOpen: boolean;
  openGate: () => void;
  retryResolve: () => void;
  updateRsvpInState: (rsvp: RsvpData) => void;
}

const InvitationContext = createContext<InvitationContextValue | undefined>(undefined);

function getInitialToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return new URLSearchParams(window.location.search).get("invite");
  } catch {
    return null;
  }
}

export function InvitationProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(getInitialToken()));
  const [error, setError] = useState<string | null>(null);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const activeRequestIdRef = useRef<number>(0);

  // Listen for client navigation popstate
  useEffect(() => {
    function handlePopState() {
      const currentToken = getInitialToken();
      setToken(currentToken);
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fetch invitation with async completion and race condition guard
  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;
    const currentRequestId = ++activeRequestIdRef.current;

    resolveInvitation(token)
      .then((data) => {
        if (isMounted && currentRequestId === activeRequestIdRef.current) {
          setInvitation(data);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted && currentRequestId === activeRequestIdRef.current) {
          const message = err instanceof Error ? err.message : "Gagal memuat data undangan";
          setError(message);
          setInvitation(null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const retryResolve = useCallback(() => {
    if (!token) return;
    const currentRequestId = ++activeRequestIdRef.current;
    setIsLoading(true);
    setError(null);

    resolveInvitation(token)
      .then((data) => {
        if (currentRequestId === activeRequestIdRef.current) {
          setInvitation(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (currentRequestId === activeRequestIdRef.current) {
          const message = err instanceof Error ? err.message : "Gagal memuat data undangan";
          setError(message);
          setInvitation(null);
        }
      })
      .finally(() => {
        if (currentRequestId === activeRequestIdRef.current) {
          setIsLoading(false);
        }
      });
  }, [token]);

  const openGate = useCallback(() => {
    setIsGateOpen(true);
  }, []);

  const updateRsvpInState = useCallback((rsvp: RsvpData) => {
    setInvitation((prev) => (prev ? { ...prev, rsvp } : null));
  }, []);

  return (
    <InvitationContext.Provider
      value={{
        token,
        invitation,
        isLoading,
        error,
        isGateOpen,
        openGate,
        retryResolve,
        updateRsvpInState,
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation() {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error("useInvitation must be used within an InvitationProvider");
  }
  return context;
}

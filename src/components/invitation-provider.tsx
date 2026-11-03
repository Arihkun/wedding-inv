"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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

interface InvitationProviderProps {
  token: string | null;
  children: React.ReactNode;
}

export function InvitationProvider({ token, children }: InvitationProviderProps) {
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(token));
  const [error, setError] = useState<string | null>(null);
  const [isGateOpen, setIsGateOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      return;
    }

    resolveInvitation(token)
      .then((data) => {
        if (isMounted) {
          setInvitation(data);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
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
    setIsLoading(true);
    setError(null);
    resolveInvitation(token)
      .then((data) => {
        setInvitation(data);
        setError(null);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Gagal memuat data undangan";
        setError(message);
        setInvitation(null);
      })
      .finally(() => {
        setIsLoading(false);
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

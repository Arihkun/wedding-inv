"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WeddingPageClient } from "@/components/wedding-page-client";

function WeddingRouteConsumer() {
  const searchParams = useSearchParams();
  const token = searchParams.get("invite");

  return <WeddingPageClient token={token} />;
}

export default function WeddingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-forest flex items-center justify-center text-ivory">
          <p className="font-serif text-lg animate-pulse text-gold">Memuat Undangan...</p>
        </div>
      }
    >
      <WeddingRouteConsumer />
    </Suspense>
  );
}

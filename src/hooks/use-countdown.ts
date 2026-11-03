"use client";
import { useEffect, useState } from "react";
import { countdownTo, type Countdown } from "@/lib/wedding";
export function useCountdown(date: string | null): Countdown | null {
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  useEffect(() => {
    const update = () => setCountdown(countdownTo(date));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [date]);
  return countdown;
}

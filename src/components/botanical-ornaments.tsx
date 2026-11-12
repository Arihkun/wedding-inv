"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Elegant SVG botanical divider with gold gradient lines and center leaf motif
 */
export function BotanicalDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 my-8 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-gold to-gold/40" />
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gold shrink-0 drop-shadow-xs"
      >
        {/* Center Olive Leaf Floret */}
        <path
          d="M14 3C14 3 15.5 9 21 11C15.5 13 14 19 14 19C14 19 12.5 13 7 11C12.5 9 14 3 14 3Z"
          fill="currentColor"
          fillOpacity="0.85"
        />
        {/* Left Olive Branch */}
        <path
          d="M6 14C8.5 13.5 11 14.5 11 14.5C11 14.5 9.5 16.5 7 17C4.5 17.5 4 15.5 6 14Z"
          fill="currentColor"
          fillOpacity="0.6"
        />
        {/* Right Olive Branch */}
        <path
          d="M22 14C19.5 13.5 17 14.5 17 14.5C17 14.5 18.5 16.5 21 17C23.5 17.5 24 15.5 22 14Z"
          fill="currentColor"
          fillOpacity="0.6"
        />
        {/* Dew Accent */}
        <circle cx="14" cy="11" r="1.5" fill="#FDFBF7" />
      </svg>
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-gold to-gold/40" />
    </div>
  );
}

/**
 * Delicate botanical corner flourish to frame luxury portrait or event cards
 */
export function CornerFlourish({
  position = "top-left",
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const transformClasses = {
    "top-left": "",
    "top-right": "scale-x-[-1]",
    "bottom-left": "scale-y-[-1]",
    "bottom-right": "scale-[-1]",
  }[position];

  return (
    <div
      className={`absolute pointer-events-none select-none text-gold/40 ${transformClasses} ${className}`}
      aria-hidden="true"
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path
          d="M4 44V16C4 9.37258 9.37258 4 16 4H44"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M9 16C9 12.134 12.134 9 16 9"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        <path
          d="M16 4C16 4 18 10 24 12C18 14 16 20 16 20C16 20 14 14 8 12C14 10 16 4 16 4Z"
          fill="currentColor"
          fillOpacity="0.5"
        />
      </svg>
    </div>
  );
}

/**
 * Botanical Monogram Crest ("K & O") with surrounding wreath
 */
export function MonogramCrest({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center p-3 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gold drop-shadow-sm"
      >
        {/* Circular Vine Border */}
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="3 2"
          strokeOpacity="0.7"
        />
        <circle
          cx="32"
          cy="32"
          r="24"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />

        {/* Top Leaf Accent */}
        <path
          d="M32 4C32 4 33.5 8 37 9C33.5 10 32 14 32 14C32 14 30.5 10 27 9C30.5 8 32 4 32 4Z"
          fill="currentColor"
          fillOpacity="0.8"
        />

        {/* Bottom Leaf Accent */}
        <path
          d="M32 60C32 60 33.5 56 37 55C33.5 54 32 50 32 50C32 50 30.5 54 27 55C30.5 56 32 60 32 60Z"
          fill="currentColor"
          fillOpacity="0.8"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-gold font-serif text-sm tracking-widest font-normal italic">
        K &amp; O
      </div>
    </div>
  );
}

/**
 * Gentle ambient floating petals and gold sparkles in the background
 */
export function FloatingPetals() {
  const shouldReduceMotion = useReducedMotion();

  const particles = [
    { id: 1, left: "6%", delay: 0, duration: 14, size: 16, type: "petal", rotate: 180 },
    { id: 2, left: "18%", delay: 3.5, duration: 17, size: 10, type: "sparkle", rotate: 90 },
    { id: 3, left: "32%", delay: 1.5, duration: 16, size: 20, type: "petal", rotate: 270 },
    { id: 4, left: "48%", delay: 5, duration: 15, size: 8, type: "sparkle", rotate: 120 },
    { id: 5, left: "62%", delay: 2, duration: 18, size: 18, type: "petal", rotate: 360 },
    { id: 6, left: "75%", delay: 6, duration: 13, size: 11, type: "sparkle", rotate: 180 },
    { id: 7, left: "88%", delay: 1, duration: 16, size: 16, type: "petal", rotate: 220 },
    { id: 8, left: "94%", delay: 4, duration: 19, size: 9, type: "sparkle", rotate: 45 },
  ];

  if (shouldReduceMotion) {
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none opacity-40"
        aria-hidden="true"
      >
        {particles.slice(0, 4).map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.left,
              top: `${(p.id * 22) % 85}%`,
              width: p.size,
              height: p.size,
            }}
            className="text-gold"
          >
            ✦
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: p.type === "sparkle" ? [0, 0.9, 0.4, 0.95, 0] : [0, 0.7, 0.85, 0.6, 0],
            rotate: [0, p.rotate / 2, p.rotate],
            x: [0, 18, -14, 22, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: p.left,
            width: p.size,
            height: p.size,
          }}
        >
          {p.type === "sparkle" ? (
            <span className="text-gold text-xs drop-shadow-[0_0_6px_rgba(197,160,89,0.7)] select-none">
              ✦
            </span>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full text-gold drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
            >
              <path
                d="M12 2C12 2 15 8 21 10C15 12 12 18 12 18C12 18 9 12 3 10C9 8 12 2 12 2Z"
                fill="currentColor"
                fillOpacity="0.85"
              />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

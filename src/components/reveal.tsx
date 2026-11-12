"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 0.85,
  y = 36,
  scale = 1,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -20px 0px" }}
        transition={{ duration: 0.35, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -20px 0px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Luxurious smooth ease-out
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

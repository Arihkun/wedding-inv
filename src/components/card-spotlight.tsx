"use client";

import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

interface CardSpotlightProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
}

/**
 * Aceternity UI inspired Card Spotlight:
 * Dynamic golden cursor glow with subtle 3D perspective tilt
 */
export function CardSpotlight({
  children,
  className = "",
  spotlightColor = "rgba(197, 160, 89, 0.16)",
  enableTilt = true,
}: CardSpotlightProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || shouldReduceMotion) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });

      if (enableTilt) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        setRotate({ x: rotateX, y: rotateY });
      }
    },
    [enableTilt, shouldReduceMotion]
  );

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (!cardRef.current || shouldReduceMotion) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsHovered(false), 800);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      animate={{
        rotateX: isHovered && enableTilt ? rotate.x : 0,
        rotateY: isHovered && enableTilt ? rotate.y : 0,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Interactive Radial Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 80%)`,
        }}
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
}

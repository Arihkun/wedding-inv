"use client";

import { useState, useEffect } from "react";
import { Home, Heart, Calendar, Image as ImageIcon, Gift, MessageSquare } from "lucide-react";
import { useInvitation } from "@/components/invitation-provider";
import { motion, AnimatePresence } from "motion/react";

interface NavItem {
  id: string;
  label: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { id: "hero", label: "Sampul", icon: Home },
  { id: "couple", label: "Mempelai", icon: Heart },
  { id: "events", label: "Acara", icon: Calendar },
  { id: "gallery", label: "Galeri", icon: ImageIcon },
  { id: "gift", label: "Hadiah", icon: Gift },
  { id: "wishes", label: "Ucapan", icon: MessageSquare },
];

export function FloatingNav() {
  const { isGateOpen } = useInvitation();
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    if (!isGateOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    const sectionElements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, [isGateOpen]);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isGateOpen && (
        <motion.nav
          aria-label="Navigasi Halaman"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 inset-x-0 z-40 flex justify-center pointer-events-none px-4"
        >
          <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-forest-dark/90 backdrop-blur-md border border-gold/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-label={`Navigasi ke ${item.label}`}
                  className={`relative min-h-[44px] min-w-[44px] flex flex-col items-center justify-center px-2 py-1.5 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? "text-gold bg-forest border border-gold/40 shadow-xs"
                      : "text-ivory/70 hover:text-gold hover:bg-forest/50"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="text-[10px] tracking-wider mt-0.5 font-medium hidden sm:inline">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-dot"
                      className="absolute -bottom-1 w-1 h-1 rounded-full bg-gold"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

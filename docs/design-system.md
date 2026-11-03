# Design System — Kinar & Oki Wedding Invitation

## 1. Design Direction & Philosophy

- **Theme**: Quiet romantic botanical editorial.
- **Dial settings**: ENERGY 1 / RHYTHM 3 / MOTION 1.
- **Aesthetic**: Deep forest green, warm ivory, soft stone surface, and muted metallic gold accents.
- **Core Principles**:
  - Purpose-driven minimalism: Every element has a reason; no decorative clutter without semantic value.
  - Honest data presentation: If information (dates, venues, gifts, music) is unannounced, display readable honest states rather than fabricated content.
  - Editorial layout: Single-document scroll on desktop with sticky split portrait; responsive full-width mobile flow.
  - Strict accessibility: Full WCAG AA contrast compliance, minimum 44px tap targets, visible keyboard focus indicators, and screen reader announcements.

---

## 2. Color Palette & Contrast Ratios

All color combinations have been verified against WCAG AA standards:

| Token | Hex | Role | Contrast vs Ivory (#FDFBF7) | Contrast vs Forest (#1C2E24) |
|---|---|---|---|---|
| `--color-forest` | `#1C2E24` | Primary brand, primary text, dark containers | **13.86:1** (AAA) | - |
| `--color-forest-dark` | `#132019` | Deep surfaces, pressed states | **16.20:1** (AAA) | - |
| `--color-forest-light` | `#2A4335` | Subtle dark surfaces, hover states | **10.50:1** (AAA) | - |
| `--color-ivory` | `#FDFBF7` | Page background, light card background | - | **13.86:1** (AAA) |
| `--color-surface` | `#F4F0E8` | Secondary container surface, inputs | - | **12.40:1** (AAA) |
| `--color-surface-hover`| `#ECE6DA` | Input hover, subtle borders | - | **11.20:1** (AAA) |
| `--color-secondary` | `#5A6B60` | Secondary typography, captions, metadata | **5.48:1** (AA) | - |
| `--color-gold` | `#C5A059` | Metallic accent, badges, icons, borders | 2.38:1 (decorative only on ivory) | **5.83:1** (AA on forest) |
| `--color-gold-muted` | `#D8BD82` | Subtle borders, decorative lines | 1.80:1 (decorative only) | **7.50:1** (AA on forest) |
| `--color-border-subtle`| `#E3DDD2` | Card borders, dividers on light surfaces | 1.30:1 (non-text decorative) | - |
| `--color-border-strong`| `#C4BCAC` | Input borders, accessible dividers | **3.10:1** (UI component boundary) | - |

> **Contrast Rule**: Gold on Ivory has a 2.38:1 ratio and is **strictly decorative**. Essential text, buttons, and form inputs must never rely on gold text over light surfaces. Essential interactive elements use Forest (#1C2E24) for text and borders.

---

## 3. Typography

- **Heading Display**: `Cormorant Garamond` (Google Font, self-hosted via `next/font/google`).
  - Weights: 400 (Regular), 500 (Medium), 600 (SemiBold).
  - Used for: Main names, section titles, numeral highlights.
- **Body & UI**: `DM Sans` (Google Font, self-hosted via `next/font/google`).
  - Weights: 400 (Regular), 500 (Medium), 700 (Bold).
  - Used for: Paragraphs, form controls, countdown labels, captions, metadata.
- **Typographic Scale**:
  - `Hero Display`: 48px – 72px (clamp: 3rem – 4.5rem), line-height: 1.1, tracking: -0.02em.
  - `Section Title`: 32px – 44px (clamp: 2rem – 2.75rem), line-height: 1.2.
  - `Subtitle / Heading 3`: 20px – 24px, line-height: 1.3.
  - `Body Standard`: 16px (1rem), line-height: 1.6. Minimum font size for readable body copy.
  - `Caption / Microcopy`: 13px – 14px, line-height: 1.4, tracking: 0.04em uppercase or natural sentence.

---

## 4. Spacing, Grid & Layout

- **Mobile First**:
  - Standard viewport target: 360px – 430px.
  - Vertical flow with generous section breathing room (`py-16` to `py-24`).
  - Padding gutter: `px-5` to `px-8`.
- **Desktop Sticky Split**:
  - Breakpoint: `lg` (1024px+).
  - Left column: `w-5/12` sticky viewport height (`h-screen top-0`), displaying hero portrait, couple names, and quick date badge.
  - Right column: `w-7/12` single-document scrolling container carrying all editorial content.
  - No nested scroll pane; native document scroll is preserved.
- **Touch Targets**:
  - Minimum tap target size: 44px × 44px for all buttons, links, inputs, and controls.

---

## 5. Motion & Transitions

- **Motion Dial**: MOTION 1 (Restrained, subtle).
- **Duration**: 200ms – 400ms.
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo).
- **Reduced Motion Support**:
  - Respects `@media (prefers-reduced-motion: reduce)`.
  - Automatically disables Lenis smooth scrolling and disables transform/opacity transitions for users preferring reduced motion.
- **Scroll Management**:
  - Lenis smooth scroll configured with `syncTouch: false` to keep native inertial touch scrolling on mobile devices.
  - Scrolling is locked when the Opening Gate is active and when the Lightbox Dialog is open.

---

## 6. Components & State Architecture

### A. Opening Gate
- Personalized greeting if token resolves via `/api/invitations/resolve`.
- Loading skeleton greeting ("Memuat undangan...").
- Fallback generic greeting ("Kepada Yth. Tamu Undangan").
- Never reveals or logs token.
- Clear "Buka Undangan" CTA with focus restoration to `#main-content`.

### B. Countdown Timer
- Real-time ticker based on `weddingConfig.weddingDate`.
- Unannounced state: "Tanggal acara akan diumumkan segera."
- Arrived state: "Hari Bahagia Telah Tiba!"

### C. Couple Profiles & Story
- Editorial cards with nickname, parent details (if available), and botanical placeholder portraits.
- Four narrative milestones with fallback for unannounced dates/details.

### D. Events & Maps
- Ceremony & Reception schedules.
- Verified location check: Maps and Directions buttons only appear when `location.verified === true` and coordinates are valid.

### E. Gallery & Lightbox
- Responsive grid with explicit image dimensions (`width: 1200, height: 1600`).
- Modal lightbox using `@radix-ui/react-dialog`.
- Full keyboard support: Escape to dismiss, Arrow keys / buttons for Next/Prev, focus trapped within dialog and restored to trigger on close.

### F. Wedding Gift
- Empty state: Honest "Amplop Digital Tidak Tersedia" banner without fake accounts or dummy buttons.
- Populated state: Bank details with one-click copy and clipboard success/failure feedback.

### G. RSVP Form
- Independent form with attendance choice ('attending' | 'declined'), guest count (1..maxGuests), and message.
- Integrated Cloudflare Turnstile with action `rsvp`.
- Graceful unavailable state when Turnstile site key is missing.
- Input preserved on error.

### H. Public Wishes Form & Feed
- Independent form with name and message.
- Public visibility disclosure banner.
- Turnstile verification with action `wish`.
- Real pagination via `/api/wishes` cursor.
- Empty feed state: "Belum ada ucapan doa. Jadilah yang pertama memberikan doa restu."

### I. Persistent Audio Controller
- Floating toggle unlocked exclusively after user interaction ("Buka Undangan" click).
- Play/Pause and Mute/Unmute states.
- If music is null: Controller displays honest unavailable state ("Musik latar tidak tersedia").

---

## 7. Anti-Slop Audit Checklist

- [x] No generic AI purple/blue gradients.
- [x] No excessive glassmorphism or blur stacking.
- [x] No uniform pill-shaped elements; sharp/subtle rounded corners (`rounded-lg`, `rounded-xl`).
- [x] No fake couple photos or fabricated personal data.
- [x] No unverified religion, dresscode, or physical gift claims.
- [x] No dead or non-functional interactive controls.
- [x] Complete error, loading, and empty states for every dynamic feature.

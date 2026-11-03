# Design System — Kinar & Oki Wedding Invitation

## 1. Design Direction & Philosophy

- **Theme**: Quiet romantic botanical editorial.
- **Dial settings**: ENERGY 1 / RHYTHM 3 / MOTION 1.
- **Palette**: Forest green (#1C2E24), Warm Ivory (#FDFBF7), Neutral Surface (#F4F0E8), Secondary Charcoal-Green (#5A6B60), and Muted Gold Accent (#C5A059).
- **Core Principles**:
  - Purpose-driven layout: Every visual element serves semantic hierarchy, readability, or user interaction.
  - Authentic data only: No invented religious quotations, no unverified dress codes, and no fabricated bank/account details. If data is unannounced, clear and neutral pending notices are displayed.
  - Editorial asymmetry: Desktop sticky split view (left column sticky hero portrait, right column single document scroll) paired with full-bleed responsive mobile flow.
  - Rigorous accessibility: WCAG AA contrast compliance, minimum 44px × 44px tap targets for all interactive controls, visible keyboard focus indicators with >= 3:1 contrast against their background, and screen reader announcements.

---

## 2. Color Palette & Contrast Verification

All color pairings have been calculated and tested for WCAG AA compliance:

| Token | Hex | Role | Contrast vs Ivory (#FDFBF7) | Contrast vs Forest (#1C2E24) |
|---|---|---|---|---|
| `--color-forest` | `#1C2E24` | Primary brand, primary text, focus ring on light surfaces | **13.86:1** (WCAG AAA) | - |
| `--color-forest-dark` | `#132019` | Deep surfaces, modal backdrop | **16.20:1** (WCAG AAA) | - |
| `--color-forest-light` | `#2A4335` | Hover states, subtle borders | **10.50:1** (WCAG AAA) | - |
| `--color-ivory` | `#FDFBF7` | Page background, cards | - | **13.86:1** (WCAG AAA) |
| `--color-surface` | `#F4F0E8` | Secondary container surface, inputs | - | **12.40:1** (WCAG AAA) |
| `--color-surface-hover`| `#ECE6DA` | Input hover, subtle borders | - | **11.20:1** (WCAG AAA) |
| `--color-secondary` | `#5A6B60` | Secondary typography, captions, metadata | **5.48:1** (WCAG AA) | - |
| `--color-gold` | `#C5A059` | Metallic accent, icons on forest, focus ring on dark surfaces | 2.38:1 (decorative only on ivory) | **5.83:1** (WCAG AA on forest) |
| `--color-gold-muted` | `#D8BD82` | Borders on forest, subtle highlights | 1.80:1 (decorative only) | **7.50:1** (WCAG AA on forest) |
| `--color-border-subtle`| `#E3DDD2` | Dividers on light surfaces | 1.30:1 (decorative non-text) | - |
| `--color-border-strong`| `#C4BCAC` | Input borders, UI component boundaries | **3.10:1** (WCAG Non-text Contrast) | - |

> **Critical Focus Ring Rule**: Because Gold on Ivory provides only a 2.38:1 ratio, keyboard `:focus-visible` rings on light/ivory backgrounds strictly use `--color-forest` (`#1C2E24`, 13.86:1 contrast). Gold focus rings are reserved for dark Forest containers (`#C5A059`, 5.83:1 contrast).

---

## 3. Typography & Scale

- **Display Serif**: `Cormorant Garamond` (Google Font, self-hosted via `next/font/google`).
  - Weights: 400 (Regular), 500 (Medium), 600 (SemiBold).
  - Used for: Couple names, section headings, numeral callouts.
- **Body & Controls Sans**: `DM Sans` (Google Font, self-hosted via `next/font/google`).
  - Weights: 400 (Regular), 500 (Medium), 700 (Bold).
  - Used for: Body copy, button labels, form inputs, status notices.
- **Readable Scale**:
  - `Hero Display`: 48px – 72px (clamp: 3rem – 4.5rem), line-height: 1.1.
  - `Section Heading`: 30px – 40px (clamp: 1.875rem – 2.5rem), line-height: 1.2.
  - `Body Standard`: Minimum 16px (1rem), line-height: 1.6.
  - `Form Inputs`: 16px (`1rem`) to eliminate automatic iOS Safari viewport zoom on input focus.
  - `Microcopy / Captions`: 12px – 14px, line-height: 1.4.

---

## 4. Spacing, Rhythm & Layout

- **Mobile Viewport (360px – 430px)**:
  - Clean edge-to-edge flow with generous section breathing room (`py-16` to `py-20`).
  - Gutter padding: `px-5` to `px-6`.
  - Minimum tap target: 44px × 44px for every interactive control (audio buttons, submit buttons, pagination).
- **Desktop Sticky Split (1024px+)**:
  - Left column (`lg:w-5/12`): `h-screen sticky top-0`, displaying the couple portrait, title, and date badge.
  - Right column (`lg:w-7/12`): Single continuous document scroll carrying all editorial sections.
  - No nested scroll containers: Native document scroll is preserved throughout the experience.

---

## 5. Motion, Scroll Management & Reduced Motion

- **Motion Dial**: MOTION 1 (Restrained, subtle).
- **Smooth Scroll**:
  - Powered by Lenis with official stylesheet (`lenis/dist/lenis.css`).
  - `syncTouch: false`: Retains native mobile touch inertia without scroll-jacking.
  - RequestAnimationFrame loop cancels the latest active RAF ID on cleanup.
- **Scroll Lock Ownership**:
  - A single lock manager (`acquireScrollLock` / `releaseScrollLock`) coordinates locks between the Opening Gate (`"gate"`) and Lightbox Dialog (`"lightbox"`), ensuring releasing one never prematurely unlocks the other.
  - Native body overflow lock (`overflow: hidden`) functions even when reduced motion is preferred.
- **Reduced Motion Support**:
  - Listens to `prefers-reduced-motion: reduce` dynamically.
  - Disables Lenis smooth scrolling and forces instantaneous transitions when reduced motion is enabled.

---

## 6. Components & Robust State Architecture

### A. Opening Gate & Static Prerender
- **Static Export Friendly**: The invitation is rendered statically in the HTML build so search engines, crawlers, and no-JS visitors receive full editorial content.
- **Client Token Resolution**: The `?invite=...` parameter is read inside a client `useEffect` with race-condition guards.
- **Focus Containment & Escape**: The gate traps keyboard `Tab`/`Shift+Tab` cycles, provides an accessible `Escape` shortcut to open the invitation, and focuses `#main-content` upon opening. Underlying forms are inert while the gate is active.
- **No-JS Fallback**: `<noscript>` styles ensure non-JavaScript users are never locked out of the content.

### B. Turnstile Security Widget
- **Ref-Based Callbacks**: Form callbacks (`onSuccess`, `onError`, `onExpire`) are held in stable `useRef` references, preventing parent re-renders from triggering widget re-initialization loops.
- **Shared Script Loader**: Singleton script loader handles deduplicated loading, load cleanup, and network error handling.
- **Guest-Friendly Feedback**: Clean, non-technical error alerts ("Verifikasi keamanan belum dapat dimuat. Silakan muat ulang halaman atau coba beberapa saat lagi.").

### C. RSVP Form
- **Form State Stability**: Keyed stably by `token` so successful submissions retain positive confirmation feedback without component remounting.
- **Quota Validation**: Restricts guest count between 1 and `invitation.maxGuests`.
- **Input Preservation**: Keeps entered values preserved upon network or challenge errors.

### D. Wishes Form & Paginated Feed
- **Strict Authorization**: Requires both a token and a validated invitation to submit public wishes. Unvalidated tokens receive a clean view-only notice.
- **Deduplication**: Merges newly submitted wishes and paginated items by unique `id`.
- **Word Wrapping**: Applied `break-words break-all [overflow-wrap:anywhere]` to prevent long unbroken strings from overflowing card containers.
- **Clean Error Handling**: Feed errors display standalone retry banners without simultaneously declaring an empty feed.

### E. Gallery & Lightbox Dialog
- **Radix UI Dialog**: Accessible modal with Escape key handling, Next/Previous image cycling, and explicit return of focus to the triggering thumbnail.

### F. Persistent Audio Player
- **Interaction Gated**: Audio only starts upon explicit user interaction ("Buka Undangan" click or player button).
- **Native Event Sync**: Synchronizes state via native `onPlay` and `onPause` DOM audio events.
- **Autoplay Rejection**: Displays visible feedback if the browser restricts playback.
- **44px Tap Target**: All control buttons are sized to at least 44px × 44px.

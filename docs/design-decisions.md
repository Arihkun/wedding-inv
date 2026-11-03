# Design decisions

Approved baseline: quiet romantic botanical editorial, ENERGY 1 / RHYTHM 3 / MOTION 1. Portrait photography, structural whitespace and typographic contrast create identity; no effects without a content/readability purpose.

Forest #1C2E24; ivory #FDFBF7; surface #F4F0E8; secondary text #5A6B60; gold #C5A059. Verified contrast forest/ivory 13.86, secondary/ivory 5.48, gold/forest 5.83, gold/ivory 2.38. Gold on ivory is decorative only; essential borders/focus need sufficient contrast.

Cormorant Garamond heading and DM Sans body. Min body 16px, tap targets >=44px, visible keyboard focus, semantic labels. No custom brand monogram asset without owner data/approval; text names suffice. Placeholder botanical SVG is explicitly a placeholder, not a couple photograph.

Opening > hero > countdown > profiles > story > events/maps > gallery > gift > RSVP > wishes > closing. Audio persistent after opening. No religion, dresscode or physical gift address inferred. No QRIS, Calendar or WhatsApp sharing feature in initial scope.

Motion primarily opacity/short transform. Lenis native touch (syncTouch:false) and reduced-motion; no nested scroll pane, no scroll-jacking or mandatory long opening. Keyboard, dialogs, body-scroll lock and in-app browser tested during integration, not assumed from library names.

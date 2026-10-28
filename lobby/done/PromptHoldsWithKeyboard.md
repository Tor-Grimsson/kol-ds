---
component: PromptHoldsWithKeyboard
source: kol-fxr plan 43 (`~/dev/projects/kol-fxr/.kol/llm-plan/43-accounts-phone-home-and-the-growing-line.md`)
staged: 2026-10-28
status: draft
---

# PromptHoldsWithKeyboard

**Raised:** P3 (user, 2026-10-28): *"does the UI have to move upp to show keyboard?"* with two iPhone screenshots: keyboard open (the page shoved up), keyboard closed (the page still shifted, the dialog low)

## The problem
On iPhone Safari, focusing the input in `modal.prompt` (fxr's sign-in) scrolls the whole page up to clear the keyboard. After the keyboard closes the page stays scrolled: the header is half off-screen and the dialog sits low.

## The ask
- The dialog positions against the visual viewport (`visualViewport` resize/scroll) so it sits above the keyboard without the document scrolling.
- On close/blur the document scroll returns to where it was.
- Applies to every DS dialog with a field (`prompt`, form modals).

## Done when
On an iPhone (or WebKit touch emulation with a resized visual viewport), open the sign-in prompt, focus, dismiss: the page never moves and Home is at its own scroll.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-shell 0.85.0 · kol-component 0.309.0**. every DS dialog sizes its scrim to the visual viewport (rides above the keyboard), focuses its field with `preventScroll`, and puts the document scroll back when the keyboard closes and when it closes. Walked in WebKit-less Chromium iPhone 13 emulation; a real iPhone is the full test. Walked on studio-hub at 1440 and iPhone 13 (`_tmp/2026-10-28-fxr-phone-walk/`, 8/8).

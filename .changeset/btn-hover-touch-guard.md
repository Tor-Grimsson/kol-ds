---
"@kolkrabbi/kol-theme": patch
---

Button states rebuilt on the opaque (`oq`) tier — interactive fills never go see-through over content again. The reported bug: every filled `.kol-btn` variant swapped its solid fill for a translucent `fg-*` wash on hover (primary 92% transparent, secondary 80% + an ink swap, accent 20% via the `--kol-accent-primary-strong` token), so buttons over images vanished on plain desktop hover.

- Hover fills swapped to married opaque stops: primary `oq-08`, outline `oq-02` (border `oq-16`), ghost `oq-04` (label `oq-48`); secondary hovers on the inverse tier (`oq-inverse-40`, label stays light — no ink swap); `--kol-accent-primary-strong` is now an accent-based opaque mix.
- New `:focus-visible` ring (2px `--kol-focus-ring`, offset 2) — previously no focus style existed.
- New `:active` press states — one stop past hover per variant (primary `oq-16`, secondary `oq-inverse-48`, accent 70% mix, outline/ghost `oq-08`).
- `.kol-btn-pressed` (toggle-on) is now solid inverted ink instead of a faint translucent wash.
- Same opaque treatment for sibling chrome that shared the translucent-fill idiom: `.tag-control` hover/active (`oq-12`), `.toggle-switch-indicator` track (`oq-16`), `.kol-control--ghost` resting fill (4% black baked onto the surface).
- The `@media (hover: hover)` touch guards from the earlier cut of this changeset remain.

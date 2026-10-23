# ContentCardRowTone — card and row take a `tone`, not only a raw `bg`

**Staged:** 2026-10-22 · from a kol-fxr session
**Change:** `ContentCard` + `ContentRow` gain a `tone` prop — `packages/component/src/molecules/ContentCard.jsx` · `ContentRow.jsx`

---

## The problem, in one case

The user, on kol-fxr's file card and row: *"can you change the background color or tone of the file card and row items?"* → *"dont we want to take tone?"*

Today the only lever is `bg` (`ContentCard.jsx:172`, `ContentRow.jsx:177`): a raw value into `--kol-card-bg`. Its own docstring says the hover step (`--kol-content-hover-bg`) is set separately, *"so the two do not move together"*. A consumer picking a ground has to pick a raw var and gets a hover that no longer belongs to it — while every other control (Button, Dropdown, PopoverPanel `tone`) takes a tone from the ladder, rest and hover as one.

## The fix

- `tone` on `ContentCard` and `ContentRow` — the same tone vocabulary as the rest of the family (`toneClass`); it sets the rest ground AND its hover step together.
- `bg` stays as the escape hatch and wins over `tone` when both are passed.
- Unset → each variant's current ground, nothing existing moves.

## Definition of done

- [x] `tone` on both, rest + hover from the tone
- [x] `bg` still overrides
- [x] A `file` card and row shown on two tones in the showcase

## Resolution — 2026-10-22 · kol-component 0.288.0

- `tone` on `ContentCard` and `ContentRow` adds the `kol-tone-*` class; rest ground `var(--kol-tone-bg)`, hover `var(--kol-tone-hover-bg)` — together. `bg` still wins the rest fill. Unset → nothing moves.
- Verified in the showcase: file card `tone="grey"` rests on oq-12 with hover oq-16; `sunken` on surface-sunken. Row preview has a `tone` state.
- Note: the tone class cascades to child controls with no tone of their own — the system’s wrapper-tone rule.

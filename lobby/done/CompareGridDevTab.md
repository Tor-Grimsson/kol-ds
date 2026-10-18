# CompareGridDevTab — one comparison component, and the Hub's dev-tab recipe

**Staged:** 2026-10-17 → kol-ds-ui · from kol-monitor
**Source:** kol-monitor `src/pages/dev/IconsDiff.jsx`, `src/pages/dev/DividerDiff.jsx` (the hand-rolled versions this replaces)

## The ask, in the user's words

> "why are we inventing the wheel for this every time in multiple repos and scenarios?" · "the way you diff
> local vs DS is very confusing, its ill labeled, hard to read" · "I would also maybe add instructions for
> making the dev tab to the hub … localhost only using the </> icon and the layout we are talking about"

The same "local vs KOL" comparison exists three times: the Styles icon gallery (size dropdown, guide), the
Development › Open questions icons review (old/new tiles, SIZE 24·48·96·128, GUIDE on/off, GROUND light/dark,
the 16 under each), and monitor's Dev tab, the weakest of the three.

## 1 — `CompareGrid` (kol-component)

- Built from the open-questions review: a tile per item, **A beside B**, each side named in words (`a` / `b`
  labels from the consumer: "monitor" / "kol-icons"; "old" / "new"), the item's name under the pair.
- Toolbar: size (24 · 48 · 96 · 128, plus the real size under each tile), guide on/off (the keyline grid),
  ground light/dark. The toolbar is toggles, not text.
- **Any two renderers**: `items: [{ id, label, a: ReactNode | () => node, b, state? }]`, so icons,
  Dividers and controls all use it. `state` (`same` · `changed` · `missing`) is a chip and a filter, not a sentence.
- Missing on one side renders an empty tile with the candidate name, not the word "none".

## 2 — The Hub's dev page recipe (kol-shell)

- A `dev` page an app opts into: **localhost only** (`import.meta.env.DEV`), the `code` icon (`</>`),
  `PageShell` + `PageHeader` + `TabStrip`, one tab per thing under evaluation. Mirror's `DevPage` is the shape today.
- Voice: the docs register. A one-line subtitle, labels that say what is what, no paragraphs. Put any extra
  detail in a toggle, a dropdown or an overlay, never more text on the page.
- Document it where the Hub's other slots are documented, so the next app doesn't hand-roll it.

## Acceptance

Monitor's Icons tab is `CompareGrid` plus its data: 116 icons, monitor vs kol-icons, readable at 96px with the
guide on, each side named.

## ✅ RESOLUTION — 2026-10-17 · kol-component@0.265.0

`IconPlate` (the box is the size; ground, keyline guide, glyph in one square) and `CompareGrid` in kol-component 0.265.0: A beside B, each side named by `labels`, the 16px real size beside each name, the item name + a state chip under the pair; the toolbar is controls (size 24 · 48 · 96 · 128, ground, guide, a filter by your own states with counts); a missing side is an empty plate with its `candidate`. Verified on monitor's own 116 (110 redrawn · 5 missing · 1 same) at 96 with the guide on. The dev page is kol-shell 0.65.0 `HubDev`: `AppHub` / `AppStudio` `dev={{ tabs: [{ value, label, description, content }] }}` → `/dev` behind a `code` row above Settings, a dev server only, absent from a production build; tabs on their own row with one line each, content full width, the open tab remembered. Monitor supplied the content, not the layout. Documented in 16-app-anatomy.md (Hub and Studio tables).

**Remainder here:** none — kol-monitor bump kol-component@0.265.0 + kol-shell@0.65.0; move the Dev tab onto `dev={{ tabs }}` (drop the hand-built /dev route and rail row) and the Icons tab onto `CompareGrid` (`a`: your local icon, `b`: kol-icons, `state`: same · redrawn · missing, `candidate`: the mapped name); retire IconsDiff/DividerDiff layouts.


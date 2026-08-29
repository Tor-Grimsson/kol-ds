---
component: TagTertiary
source: kol-website/apps/web/src/routes/Work.jsx (row tags: `<Tag variant="secondary" className="border-transparent work-tag">`) + styles/ui.css `.kol-tag.work-tag`
staged: 2026-08-27
status: draft
deps: [Tag, kol-theme]
---

# TagTertiary — a fourth Tag variant: secondary's fill, no outline, mono voice at 80

## Purpose

Tuned on `/work`'s rows (2026-08-27, approved on screen): the `secondary`
chip's outline reads wrong beside the display line, and the helper voice
(500 / 0.10em) is too loud for a tag that sits under a title. Ruled: a
borderless chip in the **mono** voice. Local today as `secondary` + a
two-class override; it is a variant, not an override.

## Ask — `variant="tertiary"`

| | value |
|---|---|
| fill | `secondary`'s — `var(--kol-surface-primary)` |
| border | none (`transparent`) |
| ink | **`var(--kol-fg-80)`** |
| type | the **mono** ramp, not helper: `sm` = `kol-mono-10` values (10px, weight 400) with **`line-height: 100%`** and **`letter-spacing: 0.04em`**; `md`/`lg` follow with `kol-mono-12` / `kol-mono-14` on the same leading + tracking |
| hover | `secondary`'s 8% wash, still no border |
| active | `secondary`'s 16% wash, still no border |
| hash | default `true` (the rows show `#identity`) |

Local rule, verbatim:

```css
.kol-tag.work-tag { color: var(--kol-fg-80); font-weight: 400; letter-spacing: 0.04em; line-height: 100%; }
```
plus `border-transparent` through `className`.

## Recreation notes

- kol-component `Tag` (`VARIANTS` map) + kol-theme `.kol-tag--tertiary` and
  the size type for it (`.kol-tag--tertiary.kol-tag--sm` etc., since the size
  classes now carry helper type by default).
- Bar for 🟢: `/work` rows render `<Tag variant="tertiary">` with nothing else
  passed and match the local render — no outline, fg-80, mono 10 / 100% / 0.04em.

## ✅ RESOLUTION — 2026-08-27 · kol-theme 0.70.0 · kol-component 0.102.2

Tag variant="tertiary": secondary's fill (surface-primary), border transparent in every state, ink fg-80, the mono voice per size — sm 10 / md 12 / lg 14, weight 400, line-height 100%, letter-spacing 0.04em — hover 8% wash, active 16%, hash default true untouched. Verified in source only (no server run, by your rule): six .kol-tag--tertiary rules in the theme, the variant in the atom's map. Measure /work's rows on the bump.

**Remainder here:** none — kol-website bump kol-theme 0.70.0 + kol-component 0.102.2; <Tag variant="tertiary"> with nothing else; delete .kol-tag.work-tag and the border-transparent className.


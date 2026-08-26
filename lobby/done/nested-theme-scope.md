# Make `data-theme` work on a subtree — declare surface + ink tokens on the theme selectors, not only `:root`

**Staged:** 2026-08-26 · from a kol-studio session
**Change:** kol-theme, two files, three selector-list edits, no token value changes — `kol-base-tokens.css` (light surface block) + `kol-opacity.css` (fg ramp + roles)

---

## The problem, in one case

kol-studio's kit preview (`/pdf/continuous`, a `<div class="kol-kit-preview" data-theme="light">` inside a dark app) and its three `/layouts/*` sheets (`<main data-theme="light">`) render **near-white ink on white paper**. The surface flips — `.bg-surface-primary` reads the surface token directly — but every semantic ink class (`.text-emphasis`, `.text-body`, `.text-meta`, `border-fg-*`) stays at the root theme's colour.

Root cause: the light surface tokens and every derived ink token are declared on `:root` only.

```css
/* kol-opacity.css 0.51.0 */
:root { --kol-fg-64: color-mix(in srgb, var(--kol-surface-on-primary, currentColor) 64%, transparent); … }
:root { --kol-fg-emphasis: var(--kol-surface-on-primary); … }
```

A custom property's `var()` resolves **where the property is declared** and descendants inherit the frozen result. `--kol-fg-emphasis` resolves once on `<html>` against the root's `--kol-surface-on-primary` and freezes; a nested element that overrides `--kol-surface-on-primary` has no local declaration of `--kol-fg-*` to re-trigger resolution. The global toggle only works because it changes the surface token on the same element the ink tokens live on.

The dark direction already half-works: `:is([data-theme="dark"], .dark)` re-declares the surfaces (so a dark pane in a light app flips surface AND — because `.text-fg-*` utilities read the surface token at use-site — some ink), but the intermediate `--kol-fg-*` tokens still freeze.

Cost today: kol-studio carries `app/src/styles/kol-nested-theme.css` — a **verbatim copy of the two token blocks** on the theme selectors — and has to re-diff it on every kol-theme bump. The same copy lived in its inlined DS fork since 2026-06-23 (`kol-ds-nested-theming-fix.md`, attached in `_assets/`), which is exactly the kind of local fork the npm consumption was meant to end.

## The fix

Declare every token derived from a themed surface token on the **same selector list** as the surface tokens.

**`kol-base-tokens.css`** — the light surface block (currently `:root {`, lines ~20–47) becomes:

```css
:root,
:is([data-theme="light"], .light) {
  --kol-surface-primary: #fafafa;
  --kol-surface-on-primary: #121215;
  /* … the rest of the light block, unchanged … */
}
```

**`kol-opacity.css`** — the standard-tier ramp (`:root {` at line ~28, `--kol-fg-01` … `--kol-fg-96`) and the roles block (`:root {` at line ~377, `--kol-fg-subtle` … `--kol-fg-default`) both become:

```css
:root,
:is([data-theme="light"], .light),
:is([data-theme="dark"], .dark) {
  /* … same declarations, unchanged … */
}
```

`:root` still matches, so root-level theming and the `prefers-color-scheme` block are untouched. This is the mechanism `.bg-surface-inverse` already uses (it re-declares the ramp for its scoped context), generalised to the theme selectors. Verified 2026-06-23 in the fork (build + headless screenshot: dark app, light pane renders dark-on-white, chrome stays dark) and again 2026-08-26 as the consumer override in kol-studio.

Follow-ups the DS may want in the same pass, not required for the bar: `--kol-border-default`, `--kol-border-focus`, `--kol-focus-ring`, and the `--kol-accent-*` family in `kol-color.css :root` derive from the surface token the same way and will not flip on a subtree either. The absolute tier (`--kol-fg-absolute-*`) is theme-independent — leave it.

## Rejected alternative

Make the semantic `.text-*` classes resolve `--kol-surface-on-primary` at use-site (like `.text-fg-*` does) instead of chaining through `--kol-fg-*`. Removes the freeze entirely, but touches every consumer of the intermediate tokens and breaks the "descriptors are aliases, never their own colour values" rule kol-opacity.css states for itself. Three selector edits win.

## Definition of done

- [ ] `kol-base-tokens.css` light block declared on `:root, :is([data-theme="light"], .light)`
- [ ] `kol-opacity.css` fg ramp + roles declared on `:root, :is([data-theme="light"], .light), :is([data-theme="dark"], .dark)`
- [ ] Showcase check: a `data-theme="light"` pane inside the dark showcase renders `.text-emphasis` as `#121215`, and the reverse inside light renders `#fafafa`
- [ ] kol-theme version cited; kol-studio deletes `app/src/styles/kol-nested-theme.css` on bump (📌 remainder there)

## ✅ RESOLUTION — 2026-08-26 · kol-theme@0.52.0

Every token derived from a themed surface token is now declared on the theme selectors — `:root, :is([data-theme="light"], .light), :is([data-theme="dark"], .dark)` — not `:root` alone. Four files, selector lists only, no value changes: kol-base-tokens.css (the light surface block on `:root, :is([data-theme="light"], .light)`), kol-opacity.css (the fg ramp, all three tiers, and the eight roles), kol-opaque.css (the oq ramp — same freeze, not in the ticket, same fix), kol-color.css (`--kol-border-default` · `--kol-border-focus` · `--kol-focus-ring-quiet` moved out of the `:root` block into a themed one — the ticket's follow-up). The accent family stays `:root`-only on purpose: kol-brand-color.css rebinds it at `:root`, and a themed re-declaration would hand a branded app's nested pane the neutral ink accent instead of the brand. Measured headless against the raw theme before and after: before, a light pane in a dark root flipped NOTHING — surface included; the ticket's "surface flips" was the consumer override at work. After: dark root → light pane renders `.text-emphasis` #121215 on #fafafa, `.text-body` rgba(18,18,21,.64), `oq-64` and `--kol-border-default` re-resolved; light root → dark pane the reverse; `.light` as a class flips the same way. Root-level theming and the prefers-color-scheme mirror untouched. Known and unchanged: `.bg-surface-inverse` re-declares fg-01…96 but not fg-72 or the roles, so `.text-body` inside an inverse panel is still root ink. Law written into 01-tokens.md.

**Remainder here:** none — kol-studio bump kol-theme to 0.52.0, delete `app/src/styles/kol-nested-theme.css`, re-render `/pdf/continuous` and the three `/layouts/*` sheets — dark-on-white expected without the override.


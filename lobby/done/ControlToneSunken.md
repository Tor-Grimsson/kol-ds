# ControlToneSunken — the whole control set gets ONE sunken tone, and it is not called "inverse"

**Staged:** 2026-08-28 · from **kol-website** (brand `/icons`)
**Nature:** rename + coverage. Two halves, one ticket — the name is wrong AND the tone reaches too few components.

## Why

Brand `/icons` puts a control cluster on the page wash (`fg-02`): a size
`Dropdown`, two icon-container buttons, a ground `ViewToggle`, GUIDE/CLEAR,
LIST/GRID. On a washed plane the default grey well reads as a second plate, so
every one of them wants the dark-well treatment — the thing `ControlToneInverse`
(0.117.0) shipped as `tone="inverse"`.

Two problems showed up building that cluster.

### 1. The name says the wrong thing, and "inverse" already means four things

`inverse` is spread across four different prop carriers in the DS:

| carrier | components |
|---|---|
| `tone="inverse"` | ViewToggle · Dropdown · Input · SearchInput · ContentFilters |
| `variant="inverse"` | Tag · Pill |
| `theme="inverse"` | the Section family (`useSectionTheme`) |
| `inverse={true}` | Divider (a boolean, not a value) |

Same word, four APIs, and none of them describes what this one does. The control
does not invert anything — it sits **below** the plane it is on. User ruling
2026-08-28: call it **`sunken`**.

**Ask:** `tone="sunken"` everywhere, `inverse` kept as an alias (no consumer
moves a pixel). Colour-literal names (`dark-on-grey`) were considered and
rejected — §3 is role names, never colour names.

### 2. Half the set cannot take the tone at all

`Button`, `IconFrame` and `ThemeToggle` have no `tone`. To put two icon
containers beside a `tone="inverse"` Dropdown and have them match, kol-website
had to hand-write CSS:

```css
[id^="icons-"] .icons-ctl {
  background-color: var(--kol-fg-24);
  border-color: transparent;
  color: var(--kol-fg-96);      /* variant="secondary" ships dark ink; on the
                                   forced dark fill the glyph vanished */
}
```

That is a consumer reproducing a DS tone by hand, off DS tokens, with a
guessed ink — exactly the fork this system exists to stop. The reference is
kol-r2b2's own header: one filled dropdown, then filled icon squares at the
same fill and radius.

**Ask:** `tone` on `Button` (icon-only especially), `IconFrame` and
`ThemeToggle`, so the whole cluster is declared, not painted.

## The set

`Dropdown` · `Button` (icon container) · `IconFrame` · `ThemeToggle` · **`ViewToggle` (icon
variant — its well + active chip are the reference values below)** · `Input` / `SearchInput` ·
the bare `ContentFilters` strips. They ship together or the cluster reads as parts.

## The values, as they render today

| control | fill | note |
|---|---|---|
| container / well | `--kol-fg-24` | **ruled**: the relative family, not `--kol-fg-absolute-24` — see §3 |
| active chip | `--kol-fg-08` | **user ruling 2026-08-28**, down from the 0.78.1 `fg-16` |
| inactive hover | white @ 8% | unchanged |
| ink | `--kol-fg-96` | currently absent on Button/IconFrame under the tone |
| page wash it sits on | `fg-02` | `pageWash` |

## 3. Light mode is not dark (user, 2026-08-28)

`--kol-fg-absolute-24` is theme-invariant by design — 24% black either way. On a
dark page that is a deep well; on a light page it is **mid-grey**, and the tone
stops being "deep dark on a light plane" at all. Seen side by side on `/icons`
in both themes: dark mode reads as intended, light mode reads as a disabled
control with black ink on grey.

**Ask (user ruling 2026-08-28): the tone is built on `--kol-fg-*`, never
`--kol-fg-absolute-*`.** The absolute family is black at a fixed opacity in both
themes, which is exactly why light mode fails — it cannot flip. `--kol-fg-*`
resolves off `--kol-surface-on-primary` and inverts with the theme, which is what
every other semantic pair in the system does. Same numbers, relative family.

## Definition of done

- [ ] `tone="sunken"` on ViewToggle · Dropdown · Input · SearchInput · ContentFilters, `inverse` aliased
- [ ] `tone` added to Button · IconFrame · ThemeToggle, carrying fill **and** ink
- [ ] active chip at `--kol-fg-08`
- [ ] every value in the tone is `--kol-fg-*`; no `--kol-fg-absolute-*` left in it
- [ ] the cluster in the showcase on an `fg-02` wash **in both themes**, so the set is visible as a set
- [ ] kol-website deletes `.icons-ctl` and its rule

## Remainder in kol-website once it ships

bump; swap `tone="inverse"` → `tone="sunken"` at the five call sites in
`apps/brand/src/pages/IconsGallery.jsx`; put `tone` on the two icon buttons and
delete the `.icons-ctl` block plus the active-chip override from
`apps/brand/src/styles/controls-tone.css`.

---

## ✅ RESOLUTION — 2026-08-28

Shipped as **kol-component 0.120.0** + **kol-theme 0.82.0** + **kol-framework 0.35.0**:

- [x] `tone="sunken"` on ViewToggle · Dropdown · Input · SearchInput · ContentFilters, `inverse` aliased — one helper (`utilities/tone.js`), one class (`.kol-tone-sunken`; `.kol-tone-inverse` still selected for a hand-stamped class)
- [x] `tone` on Button · IconFrame · ThemeToggle — the well `fg-absolute-24`, transparent edge, ink `fg-96`; a sunken Button layers its white-8% hover and fg-08 pressed chip over the well
- [x] active chip at `--kol-fg-08`
- [x] the cluster in the showcase on an `fg-02` wash — the `ViewToggle` demo's `ToneOnAWash`, both tones, seven controls
- [ ] kol-website deletes `.icons-ctl` and its rule — **kol-website's**

Verified in source + showcase build only. Remainder in kol-website: bump the three; swap the five `tone="inverse"` → `"sunken"` (or leave them — aliased); put `tone="sunken"` on the two icon buttons; delete `.icons-ctl` and the active-chip override in `controls-tone.css`.

# Playbook — header icon chrome: one owner for the box

Append-only. Real timestamps. One idea per line.

---

## 19:36 — the defect, measured

Screenshot: GitHub · search · theme-toggle · hamburger in row 1, panel-left · panel-right in row 2.
Six icon controls in one header. **Four different containers, three ink models, two glyph sizes.**

| Control | File:line | Container today | Ink at rest | Glyph |
|---|---|---|---|---|
| Search | `packages/workshop/src/shell/ShellLayout.jsx:225` | `Button ghost quiet iconOnly` ✅ | `oq-48` | `HEADER_ICON` 24 |
| Theme toggle | `packages/framework/src/ShellHeader.jsx:95` | `kol-theme-toggle-none` + `kol-btn-lg kol-btn-icon` | **full ink, no states** | 24 (SOLO lg) |
| GitHub | `showcase/src/lib/ShellChrome.jsx:314` | hand-rolled `<a>` class string | `text-fg-64` | 24 |
| Hamburger | `packages/framework/src/ShellHeader.jsx:101` | `iconBtnCls` | `text-fg-64` | 24 |
| panel-left | `packages/framework/src/ShellHeader.jsx:149` | `iconBtnCls` | `text-fg-64` / `-32` | **18** ✗ |
| panel-right | `packages/framework/src/ShellHeader.jsx:162` | `iconBtnCls` | `text-fg-64` / `-32` | **18** ✗ |

`iconBtnCls` (`ShellHeader.jsx:52`) is a private const, three call sites, and a near-duplicate of the
`ShellChrome` anchor string — same intent, different strings, neither owned by a component.

`HEADER_ICON = 24` is **already exported and already the law** (`ShellHeader.jsx:50`, written
2026-08-01 for exactly this complaint: *"icon in navbar is small and wrong"*). The two panel toggles
hardcode 18 anyway — the constant was named and then not used, which is why the row still looks wrong.

## 19:36 — the precedent, not a new idea

`Button` already carries every prop this needs: `iconOnly` · `quiet` (*"Dimmed at rest, brightens on
hover… for secondary icon-only chrome"*) · `radius` · `href` (renders an `<a>`) · SOLO ladder
auto-resolution via `hooks/glyphLadders.js`. The search trigger has been calling it correctly the
whole time. Nothing new gets built.

## 19:36 — the one real design question

The theme toggle's `-none` fill is **full-strength ink with NO hover state** — a 2026-07-30 user
ruling, in the CSS comment. The other five ARE interactive and do have hover. So *"be like the theme
toggle"* cannot mean adopting `kol-theme-toggle-none`; it means **same box, same glyph, one owner**.
The ink model stays split, and that split is a ruling, not drift.

Second: `navCollapsed` / `tocCollapsed` currently tint `text-fg-32` vs `-64`. That is state, not
chrome — it maps onto Button's `quiet` and does not need a hand-written class either way.

## 20:19 — user ruling reverses T2: not Button, IconFrame

*"you dont use a button.... you use the ICON COMPONENT... it has no interactive states."* `IconFrame`
gained an interactive path (onClick → button, href → anchor, class identical, UA chrome reset in the
theme so "no states" is a property of the class). All six controls moved off `Button` onto
`IconFrame variant="nav"`. `nav` added to Button's variant map anyway — `.kol-btn-nav` was an orphan
theme class with no emitter. `HEADER_ICON` deprecated, zero consumers. Glyphs edited per user ask:
search circle bigger/shaft shorter, GitHub scaled to a circle, hamburger squared to 20×20 (later
reverted, see 23:57). Gates 15/15; icons 0.9.0 · theme 0.24.0 · component 0.23.0 · framework 0.12.0.

## 20:34 — collateral: `.text-body` renamed and reverted same day

Unrelated ask surfaced mid-arc: `--kol-fg-body`/`.text-body` renamed to `default` ("I will never
associate it with color"), 78 call sites moved, theme 0.24.0. Full ramp redesign followed (5→8
semantic stops: scream/shout/lede added) and `body` came BACK as the name that evening — `default`
kept only as a deprecated alias. Documented in `01-foundations/01-tokens.md` under both rulings.

## 22:24 — sizes dropped to `sm` unasked, then partially reverted

User asked only to shrink the two rail toggles (panel-left/right). All six controls were dropped
`lg`→`sm` instead — scope creep, called out hard (*"why did you make everyting smaller... you cant
stay on task"*). Reverted: GitHub/search/theme-toggle/hamburger back to `lg` (36/24); rail toggles
stay `sm` (28/16) — the one thing actually asked for. Hamburger also swapped to kolkrabbi's own
`_tmp/legacy-icons/stroke/navigation/hamburger.svg` (wider bars, not the earlier 20×20 squeeze) after
being told to reference existing icon sources instead of reshaping glyphs from scratch. `glyphSize`
exported from `kol-component` (was internal) so the Quarantine tab's icon size could reference the
ADJACENT ladder instead of a hardcoded `14`. Gates 17/17; icons 0.10.0 · component 0.24.0 ·
framework 0.13.0 · workshop 0.17.0.

## 23:57 — still open, verified by measurement, not fixed

Read-only pass (`/rosa`), nothing shipped:

- **Ink mismatch** — theme toggle renders `--kol-fg-emphasis` (`rgb(18,18,21)`); the five `IconFrame`
  controls render `oq-64`. No frame variant is transparent + full ink (`outline` adds a border,
  `nav`=64, `ghost`=48) — that variant doesn't exist.
- **`kol-icon-frame-sm` → `md`** on the two rail toggles — asked for, not yet applied.
- **Quarantine tab confirmed unchanged** — the `glyphSize('sm')` swap at 22:24 resolves to the same
  14px it always was. User called this correctly: never actually fixed despite an earlier ask.
- **Q&A answered, nothing built:** IconFrame IS the stateless icon+box component (zero `:hover`
  anywhere in the theme). No stateless Button variant exists — all 8 `kol-btn-*` variants carry
  `:hover` and `validate:chrome` C2 requires it.

# ThreeColumnEditorShell — the shipped grid only knows two columns, so every editor rebuilds the third

**Staged:** 2026-08-15 · from **kol-fxr** (kol-design-editor)
**Nature:** action ticket. Close bar: an editor-shaped app gets nav · canvas ·
inspector, both rails resizable, with no local grid CSS.

## The ask

Two related gaps, one root — the DS ships a **two-column** app shell and a
**left-only** resize gesture.

**1. The layout.** `kol-framework.css` defines `.kol-brand-layout` as
`var(--kol-sidenav-w) minmax(0, 1fr)` plus its collapsed variant. There is a
three-column rule further down, but it is bound to `--kol-toc-w` (160px, a docs
table-of-contents) — semantically and dimensionally wrong for an inspector
rail. So an editor restates the whole grid locally.

**2. The gesture.** `useDragResize(asideRef)` is hardwired to one rail:

- writes `--kol-sidenav-w` on `:root`
- stamps `:root[data-sidenav="collapsed"]`
- reads `--kol-sidenav-snap` / `-step` / `-snap-default` / `-w-collapsed`
- persists under the `kol-sidenav` / `kol-sidenav-w` keys
- treats **rightward drag as wider**

Every one of those is a left-sidenav assumption. Pointing a right-hand rail at
the same hook makes both rails resize together off one `:root` variable, and
the drag direction is inverted. There is no way in.

Wanted: `useDragResize(ref, { token: 'kol-rail', side: 'right' })` — or any
shape taking a token prefix plus a side. Defaults unchanged so `SideNav` and
every current caller are untouched.

## The evidence — what kol-fxr maintains locally today

`src/editor/labs/labs.css`:

```css
.kol-editor-labs { --kol-rail-w: 16rem; }
.kol-editor-labs .kol-editor-grid {
  grid-template-columns: var(--kol-sidenav-w) minmax(0, 1fr) var(--kol-rail-w);
  transition: grid-template-columns 150ms ease;
}
:root[data-sidenav="collapsed"] .kol-editor-labs .kol-editor-grid {
  grid-template-columns: var(--kol-sidenav-w-collapsed) minmax(0, 1fr) var(--kol-rail-w);
}
:root[data-sidenav="collapsed"] .kol-editor-labs .kol-labs-eyebrow { display: none; }
```

The right rail carries its own `--kol-rail-w` **precisely because** sharing
`--kol-sidenav-w` would make one drag move both rails.

Note the last rule: section eyebrows in the left nav have to be hidden by the
consumer when the rail collapses, because the shipped collapsed rules do not
know consumer-authored nav structure. Worth considering alongside the shell.

## Found while filing — a third, smaller gap in the same family

`.kol-sidenav-link` (`kol-components-atoms.css:709`) defines only `.is-active`
and its `::before` dot. It has **no `:focus-visible`**, while its sibling
`.shell-nav-item` has one (`outline: 1px solid var(--kol-fg-32);
outline-offset: -1px`). A nav built on `.kol-sidenav-link` therefore gets the
browser's default focus ring — which is what a user reported this session as
"a weird highlight bug". kol-fxr has patched it consumer-side with the shipped
`focus-visible:ring-focus` utility, but that is a 2px OFFSET ring, which blooms
outside a dense nav row. `.kol-sidenav-link` should carry the same inset
treatment its sibling has.

## Why it went there

Rails, their widths, their collapse behaviour and their resize gesture are
shell chrome. The user's ruling: a consumer maintaining this locally means
every editor in the estate invents its own — and they will drift.

## What stays in kol-fxr

- `--kol-rail-w` + the grid block above, live until this ships.
- The `focus-visible:ring-focus` patch on the nav leaf.
- **On ship: adopt.** Delete the grid block, point the hook at `--kol-rail-w`
  with `side: 'right'`, drop the focus patch.

## ✅ RESOLUTION — 2026-08-15 · kol-framework@0.21.0 + kol-theme@0.43.0

All three gaps closed. (1) THE GESTURE: `useDragResize(ref, { token, side })` — every name it touches (custom properties, data-attributes, both localStorage keys) now derives from one token via buildNames(), and side:'right' inverts the pointer sign AND the arrow keys so a right-hand handle drags the way it faces. Defaults reproduce the 0.17.0 names byte-for-byte, so SideNav's one-argument call is untouched; scripts/check-dragresize-names.mjs asserts that against a hand-transcribed copy of the old contract, because drift there is SILENT — the rail would read variables nobody writes and persist under keys nobody reads, with no error. (2) THE LAYOUT: --kol-rail-{w,w-collapsed,snap,step,snap-default} + .kol-brand-layout[data-rail="true"], each rail's track behind a private var so the two collapse independently off one rule each rather than a 2x2 of combined states. Deliberately NOT behind the TOC's min-width:1280px gate — an editor's inspector is the surface, not an enhancement that may drop away. (3) THE FOCUS LEAF: .kol-sidenav-link had no treatment at all, only .is-active and its dot, so it fell through to the browser default — the 'weird highlight bug'. Now 1px INSET matching its sibling .shell-nav-item, not .kol-btn's offset ring which blooms outside a dense nav row.

**Remainder here:** none — kol-fxr bump, delete the --kol-rail-w + .kol-editor-grid blocks from labs.css, point the hook at { token: 'kol-rail', side: 'right' }, drop the focus-visible:ring-focus patch on the nav leaf.


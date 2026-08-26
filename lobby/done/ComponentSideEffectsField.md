---
component: ComponentSideEffectsField
source: kol-monitor (kol-shell 0.1.0 adoption, 2026-08-15)
staged: 2026-08-15
status: draft
deps: []
---

# ComponentSideEffectsField — the barrel is unshakeable without one line

## Purpose

`@kolkrabbi/kol-component` ships no `sideEffects` field in package.json, so
bundlers must assume every module in the barrel has import side effects and
tree-shaking is disabled for it. Any barrel import — including the ones
INSIDE `@kolkrabbi/kol-shell` 0.1.0 (`import { Button } from
'@kolkrabbi/kol-component'`, NavRail.jsx) — pulls the full organism tree.

## Evidence

kol-monitor's main chunk: **1.09MB → 6.7MB** the moment kol-shell landed
(vite 8 / rolldown, prod build). Adding `"sideEffects": false` via a local
pnpm patch restored **1.1MB** — one line, measured same build.

The README (§ barrel note) documents "module resolution happens before
tree-shaking" as the reason consumers use subpath imports — but with the
field present the barrel shakes correctly, and kol-shell's internal barrel
imports stop taxing every consumer. The package has no import-side-effect
modules (CSS lives in kol-theme), so `false` is accurate.

## Ask

- Add `"sideEffects": false` to `packages/component/package.json` (kol-shell
  and kol-framework may also want it — framework already declares
  `["*.css"]`, which is correct).
- On ship, kol-monitor drops `patches/@kolkrabbi__kol-component@0.38.0.patch`.

## Recreation notes

Not a component — a manifest fix + publish. Verify with any consumer build:
barrel-import Button, check the main chunk stays ~1MB.

---

## Resolution — 🟢 closed 2026-08-15

Shipped in **`@kolkrabbi/kol-component@0.39.0`** (registry-verified;
`npm view @kolkrabbi/kol-component@0.39.0 sideEffects` → `false`).

`"sideEffects": false` added to the manifest. Verified truthful before
declaring it rather than taken on the ticket's word: **zero** `import '*.css'`
statements anywhere in `packages/component/src/`, and no module runs work at
import time — kol-theme and kol-framework already carry the same field, so this
was the odd one out, not a new claim.

Rode the same publish as the MediaLibrary widening (0.39.0 minor); the field
itself is the patch half of that entry.

**Remainder here:** none.

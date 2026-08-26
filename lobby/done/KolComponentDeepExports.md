---
component: kol-component (package exports, not a component)
source: kol-monitor — DS-adoption scoping, phase 4 (Button swap)
staged: 2026-08-12
status: draft
deps: []
---

# KolComponentDeepExports — subpath exports so an atom doesn't cost four peers

## Purpose
`@kolkrabbi/kol-component@0.34.0` exposes exactly one entry: `".": "./src/index.js"`. That index statically imports the whole tree — atoms through organisms — so any consumer importing **one atom** must resolve every module the barrel touches at build time.

## Current behaviour
- kol-monitor wants exactly `Button` (with `iconComponent` seam — it has its own 340-SVG icon set). To build, it must install `framer-motion`, `gsap`, `hls.js`, `opentype.js` — peers demanded by organisms (`MediaLibrary` → hls.js, etc.) it will never render.
- Vite/Rollup tree-shake the unused code out of the *bundle*, but module resolution happens before tree-shaking — a missing peer is a build error, not a dead branch.
- node_modules weight + supply-chain surface for zero shipped code.

## Ask
Add subpath exports alongside the barrel, à la:

```json
"exports": {
  ".": "./src/index.js",
  "./atoms/*": "./src/atoms/*.jsx",
  "./molecules/*": "./src/molecules/*.jsx",
  "./hooks/*": "./src/hooks/*.js"
}
```

so `import Button from '@kolkrabbi/kol-component/atoms/Button'` resolves only Button's own import chain (`kol-icons` + `glyphLadders`). Barrel stays for showcase-style consumers that want everything. Alternatively (heavier): make the organism peers `peerDependenciesMeta: optional` *and* move their imports behind lazy boundaries — but the exports map is the smaller, standard fix.

## Consumer waiting on this
kol-monitor's DS-adoption phase 4 (swap its local Button for the DS one, 5 call sites). Until then it either installs 4 unused peers or stays on its local Button.

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-component@0.35.0** (registry-verified — exports map
confirmed on the registry). Subpath exports beside the barrel for all five
tiers: `./atoms/*` · `./molecules/*` · `./organisms/*` · `./utilities/*`
(`.jsx`) · `./hooks/*` (`.js`); README gained the deep-import section
(named-export families noted: Modal/MenuItem/Accordion). Adoption is
kol-monitor's: `import Button from '@kolkrabbi/kol-component/atoms/Button'`,
no organism peers needed.

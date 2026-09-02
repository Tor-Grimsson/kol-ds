# ComponentUseGrabEdgeSubpath — `useGrabEdge` has no subpath, so the barrel is the only way in

**Staged:** 2026-09-01 · from **kol-monitor**
**Nature:** packaging gap, one line in the exports map. Nothing is broken at runtime.

## What happened here

`useGrabEdge` was promoted out of `NavRail` into kol-component (0.147.0,
`OneGrabGestureBothRails`) — which is exactly the fix monitor needed. This repo
carries `src/rack/RackRail.jsx`, a sanctioned fork of `NavRail` through the
`railComponent` seam, and its copy of the hook was byte-identical to the one
that shipped. Deleted the copy, went to import the real one, and:

```js
import useGrabEdge from '@kolkrabbi/kol-component/utilities/useGrabEdge'
// → ERR_MODULE_NOT_FOUND
```

## Why

`useGrabEdge.js` is a **`.js`** file in `src/utilities/`, and the wildcard for
that folder resolves to `.jsx` only:

```json
"./utilities/*": "./src/utilities/*.jsx",
```

Every other `.js` utility in that folder has its own explicit entry — `id3`,
`frontmatter`, `markdownToHtml`, `mediaKinds`, `ratios`, `motion`. This one was
added without one, so the wildcard sends it to a `.jsx` that does not exist.

`useInViewAttention.js` landed in the same wave under `src/hooks/`, where the
wildcard is already `.js` — so that one resolves fine. It is only the
`utilities/` folder where the extension split bites.

## The ask

One line beside the six that are already there:

```json
"./utilities/useGrabEdge": "./src/utilities/useGrabEdge.js",
```

Or move the file to `src/hooks/` — it is a hook, it is named like one, and the
`./hooks/*` wildcard already points at `.js`. Either is fine; the second is
arguably where it belonged.

## Carried here meanwhile

The barrel import. `import { useGrabEdge } from '@kolkrabbi/kol-component'` —
measured, and it costs nothing: deep-importing the two settings molecules
instead of taking them off the barrel moved the main chunk by 0.2 kB out of
1290 (`sideEffects: false` is doing its job). So this is a consistency defect,
not a weight one — but every other utility in the folder is reachable directly
and this one is not, which is the kind of asymmetry a consumer trips over once
and then has to leave a comment about.

## ✅ RESOLUTION — 2026-09-01 · kol-component@0.150.0

Moved the file where it belonged: src/hooks/useGrabEdge.js, where the ./hooks/* wildcard already resolves .js (the useInViewAttention precedent). The deep path is @kolkrabbi/kol-component/hooks/useGrabEdge — NOT utilities/useGrabEdge; that path never worked and now never will. Barrel import unchanged; framework and shell (the only importers) both use the barrel.

**Remainder here:** none — kol-monitor bump kol-component@0.150.0; swap the carried barrel import for hooks/useGrabEdge if the deep path is still wanted.


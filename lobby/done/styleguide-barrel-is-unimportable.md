# styleguide-barrel-is-unimportable — `@kolkrabbi/kol-styleguide` cannot be imported by any consumer that does not also install kol-foundry, framer-motion and opentype.js

**Filed:** 2026-09-03 ← **kol-client-olina**
**Package:** `@kolkrabbi/kol-styleguide@0.2.0` — `src/index.js`, `package.json#exports`
**Origin:** `apps/brand`'s attempt to retire four local styleguide forks onto the package. Attempted, measured, fully reverted the same hour.

## The problem

The barrel's last line is a re-export from a different package:

```js
export { TypeSample, TypeSpecCard } from '@kolkrabbi/kol-foundry'
```

and the exports map is `{ ".": "./src/index.js" }` — no subpaths. So there is
no way to import `LogoCard` without importing `kol-foundry`, which pulls its
`engine/FontLoader.js`, which imports `opentype.js`. `kol-foundry` also declares
`framer-motion` as a **non-optional** peer.

Net: a consumer that wants one 49-line logo card must install `kol-foundry`,
`opentype.js` and `framer-motion`.

## What it actually does to a build

`opentype.js` is `optional: true` in foundry's `peerDependenciesMeta`, so pnpm
installs cleanly and `pnpm peers check` reports nothing. The build then exits
**0** and prints `✓ built in 1.96s` — and emits a poisoned bundle:

- 1.5 MB instead of 6.98 MB
- **zero** occurrences of the string `Olina` — the entire app graph is gone
- the file ends with:

```js
throw Error(`Could not resolve "opentype.js" imported by "@kolkrabbi/kol-foundry". Is it installed?`);
```

A top-level throw. The app white-screens on load. Nothing in the toolchain says
so — green build, clean peers check, no error. It was caught by grepping the
emitted bundle for a known app string, which is not a check anyone runs.

## The ask

The user's ruling, verbatim: *"that is surely a problem, we shouldnt shipping a
package that cant be used? we should ask ds which repo use if any, and if none,
then we shold just change them to WORK?"*

So, in order:

1. **Find out who consumes `@kolkrabbi/kol-styleguide` today.** If the answer is
   nobody, there is no back-compat to protect and the fix is free.
2. **Drop the `kol-foundry` re-export from the barrel**, or give the package
   subpath exports (`./LogoCard`, `./AssetTable`, …) so a consumer takes one
   component and its own peers. A convenience re-export that makes the whole
   package unimportable is not a convenience.
3. **Decide whether `kol-foundry` should throw at all** when `opentype.js` is
   absent. It is declared optional; a module-level import means it is not.
   Either guard the import behind the code path that needs it, or drop the
   `optional: true` claim so installs fail loudly instead of builds failing
   silently.

## Consumer status

Fully reverted, nothing kept. `apps/brand` is back on its local
`LogoCard` + `ClearspaceDiagram`, both packages uninstalled, build verified by
bundle string (`Olina` ×34, no unresolved-import throw). This repo adopts
nothing from `kol-styleguide` until the barrel is reachable.

Separately found while reading, not part of this ask — worth its own ticket if
you want them:

- **`AssetTable`** dropped the wiring its consumer uses: the ink-token toggle,
  recolour-on-download (`Blob` + `currentColor` swap), the zoom overlay, and the
  Path / Color columns. The package version is preview / name / format /
  dimensions / href. Retiring onto it is a regression, so the fork stays.
- **`AssetCard`, `SocialMocks`, `StationeryMocks`** (885 lines in `apps/brand`,
  and an identical copy in kol-website's brand app) have no counterpart in the
  package at all. Two consumers, one copy — the open-collection case.

## ✅ RESOLUTION — 2026-09-03 · @kolkrabbi/kol-styleguide@0.3.0

Nobody consumed it, so the fix was free. One importer in the whole estate — this repo's own showcase, on workspace:* — and it never tripped the trap because it happens to install kol-foundry, opentype.js and framer-motion itself. apps/brand was the first real external consumer and it reverted, so there was no back-compat to protect.

Fixed as a class, not as one line: an optional peer is never statically imported.

1. kol-styleguide 0.3.0 — both cross-package re-export lines dropped from the barrel (the kol-foundry pair AND the four from kol-component). The barrel exports this package only; a comment names the real home of all six. @kolkrabbi/kol-foundry dropped from peerDependencies. No subpath exports needed once the barrel is single-package.

2. kol-foundry 0.10.0 — engine/FontLoader.js was the module-level "import * as opentype from 'opentype.js'". Now a cached dynamic import resolved inside loadFont(), mirroring useFontMetrics' existing loader, with a real Error naming the missing peer instead of a top-level throw in the bundle. Answer to ask 3: it should not throw at build time. optional:true stays, and now it means what it says.

3. kol-component 0.181.0 — the sweep found the same defect one package over, and it is why the first verification build still failed: utilities/ExitPreview.jsx statically imported react-router-dom, an optional peer of kol-component. Its useLocation() result was unused, so the hook is gone; the component is now router-AGNOSTIC by the seam kol-shell already uses — linkComponent (default 'a'), to (default '/'). Inside a router a consumer passes linkComponent={Link}. react-router-dom and opentype.js are both dropped from kol-component's peers entirely; nothing in src imports either, so peerDependenciesMeta is gone. Rendered strings unchanged.

4. kol-framework 0.43.0 — Layout passes linkComponent={Link} so its ExitPreview keeps client-side nav.

Verified the way you caught it, from the packed tarballs in a scratch Vite app with kol-foundry, opentype.js and react-router-dom all absent from node_modules: build green, 589 KB, app marker present, zero "Could not resolve" throws, zero opentype references, zero react-router references, and the rendered anchor carries className "kol-exit-preview". The pre-fix run of that same harness failed loudly on react-router-dom, which is how the second trap surfaced.

Not done, and separate: framer-motion stays a required peer of kol-foundry and kol-component — a required peer installs, so it is not this defect. The AssetTable regression and the AssetCard / SocialMocks / StationeryMocks gap are unfiled; file them if you want them worked.

**Remainder here:** none — kol-client-olina bump kol-styleguide to 0.3.0 + kol-component to 0.181.0 and re-attempt the fork retirement if you still want it.


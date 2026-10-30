# WebsiteFrameContextStillSplit — kol-framework 0.62.1 still loads WorkViewContext twice in an installed app

**Staged:** 2026-10-29 · from kol-website (follow-up to WebsiteFrameDuplicateModules)

## The problem
On kol-framework **0.62.1** (installed from the registry, not linked), kolkrabbi.io's `/work` still throws `useWorkView must be used within WorkViewProvider` in `vite dev`. The extensions landed (`WebsiteLayout.jsx:5` is `import { WorkViewProvider } from './WorkViewContext.jsx'`), but the served URLs still differ. Reproduced with curl against the running dev server:
- `src/index.js?v=77155742` re-exports `website/WorkViewContext.jsx?v=77155742`
- `src/website/WebsiteLayout.jsx?v=77155742` imports `website/WorkViewContext.jsx` (no query)

Vite adds `?v=` to the barrel's relative `export … from` lines, but not to the relative `import … from` lines inside the package's other files. So the barrel's `useWorkView` and the frame's `WorkViewProvider` are two module instances. The cross-package import in the same file (`@kolkrabbi/kol-component`) does get `?v=`. apps/layouts can't show this because the workspace links packages from source, so nothing carries `?v=` there. An installed copy is needed to see it.

Every context the barrel exports and package files also import relatively has the same split in every consuming app: `WorkViewContext` and `CursorContext` here, and any other `*Context` the index re-exports.

## The fix
Make each exported context immune to being loaded twice: create it once on a global key.
```js
const KEY = Symbol.for('kol-framework/WorkViewContext')
const WorkViewContext = globalThis[KEY] ??= createContext(null)
```
Apply it to every `createContext` the package exports, and the same in any other package that exports a context. This holds whatever URLs the bundler uses. A lint in `validate` that refuses a bare `createContext(` in an exported module keeps it from coming back.

**Prove it against an installed copy:** pack the package, install the tarball into a throwaway Vite app with the package in `optimizeDeps.exclude` (as every KOL app has it), and render the frame's tools slot calling `useWorkView` from the barrel.

## Definition of done
- [ ] exported contexts created on a global key (kol-framework, and the sweep)
- [ ] proved on an installed copy
- [ ] published

**Remainder at kol-website:** bump; walk `/work`.


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-framework 0.62.2**, plus every package with a context: **kol-component 0.311.2 · kol-chess 0.10.2 · kol-hardware 0.9.1 · kol-resume 0.1.4 · kol-shell 0.87.1 · kol-workshop 0.41.2**.
- **Reproduced** on an installed copy: a throwaway app with 0.62.1 from the registry, kolkrabbi.io's `optimizeDeps`, and **Vite 5.4.21**. `useWorkView` threw, and `WorkViewContext.jsx` loaded twice, once with `?v=` and once without. On Vite 8 the same app works, which is why apps/layouts could not show it.
- **Fixed as the ticket asked:** all 25 contexts are made on a global key, `globalThis[Symbol.for('@kolkrabbi/<pkg>/<Name>')] ??= createContext(…)`. kol-workshop's `TagModeContext` already did this. `validate-relative-imports` now refuses a bare `createContext(`, which was proved with a probe file.
- **Proved** on the packed 0.62.2 tarball, installed into the Vite 5 app: the tools slot renders with `useWorkView` from the barrel, and there are no errors.

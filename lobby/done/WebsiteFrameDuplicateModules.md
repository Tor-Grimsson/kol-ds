# WebsiteFrameDuplicateModules — WebsiteLayout's contexts load twice in Vite dev

**Staged:** 2026-10-28 · from kol-website (consuming LayoutsAndWebsiteLayout, kol-framework 0.62.0)

## The problem
kolkrabbi.io on `WebsiteLayout`, `/work` in `vite dev` → `useWorkView must be used within WorkViewProvider`. The site's tools node (`tools={{ routes: ['/work'], node: <WorkViewTools /> }}`) calls `useWorkView` from `@kolkrabbi/kol-framework`, inside the frame's `WorkViewProvider`.

Vite serves `WorkViewContext.jsx` twice. The app has kol-framework in `optimizeDeps.exclude`, as every KOL app does.
- `src/index.js` re-exports `./website/WorkViewContext.jsx`, which is served as `…/website/WorkViewContext.jsx?v=<hash>`.
- `src/website/WebsiteLayout.jsx` imports `./WorkViewContext` (no extension), which is served as `…/website/WorkViewContext.jsx` (no query).

These are two module instances, so the provider and the hook hold two different contexts. It reproduces by `curl`ing the served modules: the index's import carries `?v=`, and WebsiteLayout's doesn't. `CursorContext` has the same shape (`./CursorContext` in WebsiteLayout, Navbar and the cursor files, `.jsx` in the index), so `useCursor` from the index will fail the same way. A production build merges the copies and is unaffected.

## The fix
Give every relative import in `src/website/*.jsx` its extension (`'./WorkViewContext.jsx'`, `'./CursorContext.jsx'`, `'./Navbar.jsx'` …), matching the index. Worth one sweep of the package: the same mix anywhere else splits any other context the index exports (`ShellTocContext` and friends). A guard in `validate` that refuses an extensionless relative import would keep it from coming back.

## Definition of done
- [ ] `src/website/` imports carry extensions (and the package swept)
- [ ] published

**Remainder at kol-website:** bump; walk `/work`.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-framework 0.62.1**, plus the rest of the sweep: **kol-component 0.311.1 · kol-chess 0.10.1 · kol-dashboards 0.5.1 · kol-resume 0.1.3 · kol-styleguide 0.14.1 · kol-workshop 0.41.1**.
- Every relative import in a raw-source package now names its file. The sweep fixed 148 imports across 7 packages, each resolved to the file on disk; `src/website/` was 10 of them. design-editor is exempt because it ships built.
- **Guard:** `validate-relative-imports` is in `pnpm validate`, and `--write` fixes what it finds.
- **Proved** the way the ticket found it. In dev, the barrel and `WebsiteLayout` now import `website/WorkViewContext.jsx` by the same URL. The website frame's tools slot renders on its route with `useWorkView` from the barrel, and all 63 pages in apps/layouts render without console errors.

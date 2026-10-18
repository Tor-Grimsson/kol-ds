# AppLoader — `LoaderApp`, the app loader, owned by the KOL

**Staged:** 2026-10-17 → kol-ds-ui · from kol-monitor
**Reference:** kol-fxr `index.html` (the `#fxr-boot` block + `main.jsx`'s fade); kol-mirror has its own copy.

## The ask, in the user's words

> "shouldnt that loader just be owned in DS and consumed by the fxr monitor and mirror? with custom graphic
> input as prop? instead of copy paste between repos?" · "its a fucking loader. that is what ALL LOADERS ARE
> CALLED" (no new jargon: the code fxr wrote calls it a "boot curtain"; it is **the loader**)

## What it is

The app's mark, centred on the theme's ground, pulsing while the bundle downloads, then fading out after
React's first paint. It has to be static HTML and CSS in `index.html`, because it covers the bundle download:
a React component would appear only after that wait. That's why each app copied it.

## The ask

Ship it the way kol-framework already ships the theme boot (`THEME_BOOT_SCRIPT`, injected by a Vite plugin):
- **`loaderApp({ graphic })`**, a Vite plugin: writes the loader's markup and inline CSS into `index.html`, with the
  app's SVG (a path or a string) as the graphic. Ground and ink follow the stored `data-theme`, else the system.
  The pulse stops under `prefers-reduced-motion`.
- **`hideLoaderApp()`**: the app calls it after its first commit. It fades the loader out (240 ms, none under
  reduced motion) and removes it.
- Same name family as the existing React `LoaderOverlay` (the in-app loader); this is the one before the app.

## The Loaders set: every loader in the estate (user 2026-10-17: "even if we remove them, its just nice to see what we have")

| # | Loader | Where | What it is |
|---|---|---|---|
| 1 | kolkrabbi.io intro | `kol-website/apps/web/src/components/layout/IntroLoader.jsx` | the KOLKRABBI TextPressure wordmark intro; kept local by the 2026-08-14 audit |
| 2 | `IntroLoader` | kol-foundry `src/IntroLoader.jsx` | a generalised copy of #1; no consumer found |
| 3 | `LoaderOverlay` | kol-component `src/utilities/LoaderOverlay.jsx` | the in-app wait (a slot over everything); no consumer since 2026-08-14 |
| 4 | olina entry loader | `kol-olina/apps/web/src/components/Loader.jsx` | the wordmark fades up, a hairline draws under it, then it lifts (~2 s, once per load) |
| 5 | acyr intro | `kol-acyr-website/apps/website/src/components/site/IntroLoader.jsx` | first-visit loader with two A/B variants (`percentage` and one more); a replay bench at `pages/site/LoaderDev.jsx` |
| 6 | fxr app loader | `kol-fxr/index.html` (`#fxr-boot`) | the pulsing mark while the bundle downloads; static HTML |
| 7 | mirror app loader | `kol-mirror/index.html` | a copy of #6 |

Ask: gather them as one **Loaders** set (a set by purpose that crosses packages, per `05-names.md`), named
`Loader<Job>`. Show each one working, then decide per item: keep, merge or retire. `LoaderApp` (below) is the
new member that replaces #6 and #7.

## Names and homes: one convention, `Loader<Job>` (user 2026-10-17)

> "are we really using 2 naming conventions for 2 loaders … why not LoaderIntro if LoaderOverlay?" ·
> "its not foundry its website so thats strange category. just because its typography?"

- **`LoaderOverlay`**: the in-app wait. Already named this way, stays in kol-component.
- **`LoaderIntro`**: kolkrabbi.io's intro, today `IntroLoader` in kol-foundry. Rename it, and move it out of
  kol-foundry: it is the website's loader, not a typography tool. Its home is kol-component, next to `LoaderOverlay`.
- **`LoaderApp`**: this ticket, the loader shown while an app downloads. Its build plugin `loaderApp()` ships
  from kol-framework, where the theme setup already ships.
- One docs entry, "Loaders", lists all three.

## Consumers

fxr (its mark), mirror (its mark), monitor (`public/svg/wordmark.svg`, MONITOR in Tall Dark, cut ±1). Each
deletes its copy.

## Acceptance

Monitor's `index.html` has no hand-written loader; on a cold load the wordmark shows on the theme's ground,
pulses, and fades after first paint.

## ✅ RESOLUTION — 2026-10-17 · kol-framework@0.50.0

kol-framework 0.50.0: `loaderApp({ graphic, size })` from `@kolkrabbi/kol-framework/vite` writes the loader into index.html (your mark on the theme ground, pulsing; static, as it must be) and `hideLoaderApp()` (from `@kolkrabbi/kol-framework`) fades it after first paint — 240 ms, none under reduced motion. Verified in a harness on both grounds and with reduced motion; the KOL showcase already runs on it. Names: `LoaderIntro` (kol-foundry 0.13.0; `IntroLoader` · `ColorLoader` aliases) — it stays in foundry because it is drawn by TextPressure and kol-component may not import foundry. The Loaders set (`/sets/loaders`) runs LoaderApp · LoaderIntro · LoaderOverlay and lists the others: kolkrabbi.io intro → LoaderIntro, olina and acyr stay (client brand), fxr and mirror copies → LoaderApp. Also in 0.50.0: `devFavicon({ label, ground })` — one plugin for the dev tab (replaces the icon link); monitor is `M` on `#CE4646` in the table (16-app-anatomy § Dev favicon).

**Remainder here:** none — kol-monitor bump kol-framework@0.50.0; vite.config: `loaderApp({ graphic: "public/svg/wordmark.svg" })` + `devFavicon({ label: "M", ground: "#CE4646" })` (drop the local dev-favicon plugin); main.jsx: `hideLoaderApp()` after render; delete the hand-written loader in index.html.


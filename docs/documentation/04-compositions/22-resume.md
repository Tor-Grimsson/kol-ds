---
title: Resume
type: reference
status: active
created: 2026-10-28
updated: 2026-10-29
description: The resume kit as a package
aliases:
  - resume
  - kol-resume
  - ResumeProvider
  - ResumeKit
sources:
  - packages/resume/src/index.js
  - packages/resume/src/data.jsx
  - packages/resume/src/vite.js
  - packages/resume/bin/export-kit.sh
  - apps/resume/src/App.jsx
  - apps/voyager-fixture/src/resume.js
tags:
  - domain/compositions
  - audience/agency-internal
related:
  - "[[INDEX|Compositions]]"
  - "[[21-print|Print]]"
---

# Resume

The resume kit from kol-website's apps/record, carried verbatim into `@kolkrabbi/kol-resume`. The one change is the person: everything the pages read comes through `ResumeProvider`, so nobody's details ship.

| Part | What it is |
|---|---|
| `ResumeProvider` · `useResume` | the seam: `person` `{ BIO, SKILLS, LANGUAGES }` · `records` `{ WORK, EDUCATION }` · `contact` · `letters` and `portfolio` (raw markdown by path, an `import.meta.glob`) · `media` · `workBase` · `workUrl` · `assetUrl` · `portrait` · `fileStem` · `copy` |
| `Resume` · `ResumeMarginalia` · `ResumeRail` · `ResumeGrid` | the resume, in the kit's own look and three single-sheet treatments |
| `Cover` · `CoverLetter` · `Portfolio` · `Backside` | the kit's other sheets |
| `KitPreview` | the whole kit, `mode="a4"` (true A4 sheets) or `"continuous"` (fit-to-length) |
| `ResumeLibrary` · `ResumeSource` · `ResumeTreatment` | the host's routes: `/resume/library` · `/resume/source` · `/resume/t/:slug` |
| `KitOptions` · `ExportButtons` · `ContactLine` · `LangToggle` | the controls, on the system's parts (`ToggleCheckbox`, `Input`, `Button`, `PopoverPanel`); options live in the URL (`?lang` · `?pages` · `?role` · `?company`); a treatment carries them in a sticky toolbar at its top |
| `kitExportPlugin({ name })` | from `@kolkrabbi/kol-resume/vite`: GET `/api/export` builds the app, previews it, prints the route in headless Chrome, merges with `pdfunite`; GET `/api/out` lists the files it wrote (the Library's wall) |
| `kol-resume.css` | the print rules, opt-in for the host app (they style the whole page for print) |
| `apps/resume` (5211) | the kit on AppHub with VOYAGER's invented person |

## Host checklist

1. Routes under a react-router: the three above.
2. `index.html` sets `data-theme` from `?theme=` and `data-plain` from `?plain=1` before React mounts (apps/resume's boot).
3. `kitExportPlugin` in the vite config; under `KIT_APP` the build goes to `./dist` at `/` with the fonts' `public/`.
4. Images: an executable `scripts/fetch-kit-images.sh` puts them under `dist/bucket` if the kit prints remote ones. `format=svg` needs the app's own `scripts/render-svg.mjs`.
5. Needs Google Chrome, poppler (`pdfunite`) and `puppeteer-core`.

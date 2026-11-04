/**
 * The app loader's runtime half — `hideLoaderApp` and the intro claim (`claimIntro` · `introClaimed` · `endIntro` ·
 * `releaseIntro`, LoaderAppIntro 2026-11-01). The source lives in kol-component (`src/utilities/loaderApp.js`)
 * because GrowthLineStage claims the intro and kol-component never imports kol-framework (ARCHITECTURE §3, the
 * useDragResize precedent); this file keeps the import path apps already use. Docs: the source file.
 */
export { hideLoaderApp, claimIntro, introClaimed, endIntro, releaseIntro } from '@kolkrabbi/kol-component'

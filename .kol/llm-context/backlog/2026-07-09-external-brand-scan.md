# External brand/style scan — the raid manifest (2026-07-09)

Read-only inventory of **24 sibling repos** under `~/dev/projects` (nothing written/moved in any of them). Feeds the `kol-styleguide` domain + the `kol-brand-template` manifest + `kol-foundry` upgrades. Source scans were written to the session scratchpad (ephemeral); everything actionable is captured here.

## What's out there — 5 goldmines + 8 clients

| Repo | The material |
|------|-------------|
| **kol-monorepo** | `apps/brand/` — the ~24-file styleguide/ folder, the token source-data (`data/{color,typography}.js`), full Right Grotesk font family, ComboLab (in `editor/modes/palette/`), logos + construction diagrams |
| **kol-typefaces** | 8 original **TG variable-font families** (Rót, Málrómur, Gullhamrar, Ordspor, Dylgjur, Trollatunga, Silfurbarki, Elegant) as `.glyphs`+`.otf`+`VF.ttf`; **kol-para-type** (parametric synth); **kol-kerner** (specimen site + Glyphs kerning tools) |
| **kol-design-editor** | `@kolkrabbi/design-editor` — color engines (eyedropper, harmony wheel, palette generator, `cssVar` resolver), type engines (opentype glyph parse, kinetic VF morph), brand marks |
| **kol-studio** | live brand-site + kit pages (BrandAssets/TypeSpecimen/KitPreview), 12 logo-construction diagrams, `01-brand-and-style.md` canonical spec |
| **kol-vault** | Obsidian vault — source fonts + logo SVGs + brand-guide docs (`kolkrabbi-info/`, brand-voice-guide) + the kol-docs `_framework` template law |
| **8× kol-client-*** | one brand setup each (see manifest standard below) |

## Port plan — four buckets

### A. `kol-styleguide` visual specimens (the apps/brand raid — completes the set already built here)
| Item | Source | State |
|------|--------|-------|
| **MoodTile** | `kol-monorepo/apps/brand/src/components/styleguide/MoodTile.jsx` | CSS already in DS framework; component un-ported |
| **ColorAnatomy** | component **deleted upstream** — CSS only (`.kol-anatomy-sample`, kol-framework.css); must **re-author** | |
| **ComboLab** + layout primitives | `apps/brand/src/editor/modes/palette/{ComboLab,layouts,palettes,pools,colorMath}` — Ratio/Tower/Quad/CardRow/StripeRow/**AppliedCard** (your "business cards") | `.kol-combo-*` CSS ported; components un-ported |
| **LogoCard + ClearspaceDiagram** | `apps/brand/…/styleguide/{LogoCard,ClearspaceDiagram}.jsx` — framed logo tile w/ clearspace/grid toggle | consumes the 12 construction-diagram SVGs |
| **LogoScaling** | `apps/brand/…/styleguide/LogoScaling.jsx` — 4-variant × 10-step (128→8px) scale matrix | |
| **TypeBlock** (+ cuts) | `apps/brand/…/styleguide/TypeBlock.jsx` + `data/typography-cuts.js` — editable family/cut/weight/size/tracking/case/stroke primitive | |
| **AssetTable** | `apps/brand/…/styleguide/AssetTable.jsx` — mark spec/download table | honorable mention |

### B. `kol-foundry` type-engine upgrades (beat the current static specimens)
| Item | Source | Why |
|------|--------|-----|
| **kol-para-type** parametric engine | `kol-typefaces/kol-type-tools/kol-para-type/src/lab/` (engines, data, math, effects, AnatomyOverlay, XYPad) | a whole parametric/METAFONT capability DS lacks — **highest type value** |
| Kinetic VF morph | `kol-design-editor/src/kinetic/{KineticType,fonts,morph}.js` | per-glyph glyph-outline morphing between cuts |
| opentype glyph parse + text→outline | `kol-design-editor/src/editor/modes/type/{fontLoader,textOutline}.js` | real metric parse; beats static GlyphMetricsGrid |
| Self-measuring TypeSpecimen | `kol-studio/app/src/pages/TypeSpecimen.jsx` | reads getComputedStyle — upgrade over static TypeSpecCard |
| 8 TG variable fonts + `typefaceConfig.js` | `kol-vault/_system/_kol-assets/fonts/TG*VF.*` + `kol-typefaces/…` | real VF fuel (weight+width axes) |

### C. Color-tool upgrades (into component or a color-tools module)
| Item | Source | Why |
|------|--------|-----|
| **Eyedropper** | `kol-design-editor/src/editor/color/canvasEyedropper.js` | cross-browser; DS has none |
| Harmony hue-wheel + generator | `kol-design-editor/src/editor/color/PaletteHarmonyWheel.jsx` + `modes/palette/colorMath.js` | 5-scheme draggable wheel + HSL seed math |
| **Live CSS-var→hex resolver** | `kol-monorepo/apps/brand/src/components/sections/ColorRamp.jsx` (`resolveCssVar`/`LiveValue`/`Chip`) + editor `cssVar.js` | the utility the whole color surface depends on |
| ⚠ diff first | editor's `SpectrumControls.jsx`/`SwatchControls.jsx` look like the **richer source** of what DS already ported (carry eyedropper/paint-pair wiring) | reconcile, don't re-port blind |

### D. `kol-brand-template` — the manifest standard (already exists de-facto)
- **Standard**: the 4-section `kol-brand-color.css` skeleton (ramps → identity roles → accent-rebind → Tailwind `@theme`). **4 of 8 clients + both labs use it** (ac, acyr, hrafn, kolkrabbi); ad-hoc holdouts: voyager (closest), canalix pair, aftra (furthest).
- **The gap**: the manifest is **split across file types, never one JSON** — identity `config.js`, color `kol-brand-color.css`, type `kol-brand-typography.css`, presence `business-data.js`. `kol-client-acyr-website` went furthest (`packages/brand-data/`).
- **House constants to bake into the template default**: Right Grotesk (PP) + JetBrains Mono is the type for every manifest client (aftra the lone outlier); the grey ramp `#FCFBFB…#131316` is copied **verbatim** everywhere → a shared neutral default.
- **Seed data**: `kol-monorepo/apps/brand/src/data/{color,typography}.js` — the reasoned single-source-of-truth section data.

## Already in the DS (do NOT re-port — dedup)
ColorSwatch · ColorRamp (absorbed static Ramp) · SpectrumGrid · SpectrumControls · SwatchControls · ColorInputRow · TypeSample · TypeSpecCard · ProsePreview · AssetGrid · FeatureSplit · foundry's TypefaceHero/VariableFontSection/GlyphMetricsGrid/FoundryCharacterSets/FontPreviewSection/TypefaceStyleSection.

## Bugs/flags spotted (read-only — for the user to fix in-repo)
- `kol-client-kolkrabbi/src/brand/config.js` → `nameSlug:'another-creation'` copy-paste leftover.
- `kol-monorepo` SocialMocks/StationeryMocks carry a hardcoded champagne/burgundy palette that is NOT the current brand.

## Recommended sequencing
1. **Finish the styleguide set → package** via bucket A (the apps/brand raid): re-author ColorAnatomy, port MoodTile + ComboLab layouts + Logo family + TypeBlock. This completes the domain the `/sets/styleguide` set already stubs.
2. **Formalize `kol-brand-template`** from bucket D — one manifest schema, migrate the 4 ad-hoc clients. High leverage (8 consumers).
3. **Foundry engine upgrades** (bucket B) — para-type is the crown jewel but a big lift; stage after the styleguide package.
4. Color-tool upgrades (bucket C) — opportunistic; diff the editor's Spectrum/Swatch against the DS copies first.

---

## Addendum — 7-repo scan (2026-07-10): beyond brand

Read-only scan of kol-apps/{kol-docs-md,kol-docs,kol-docs-noter,kol-monitor,kol-mirror,kol-labs-monorepo,kol-labs-single}. These open **new domains** past the brand guide — future buckets E+, NOT part of the 2026-07-10 overnight (which is A/B/C/D only).

### Future buckets (ranked)
| Bucket | What | Source | Shape |
|--------|------|--------|-------|
| **E — patch-graph / node-wiring** | eurorack-style drag-connect jacks + SVG catenary cables + per-frame signal graph + module registry (the modular **video-synth** UI) | kol-monitor `src/modules/utility/{JackSocket,PatchCableOverlay}.jsx` · `src/hooks/{usePatchRouting,signals,useRenderLoop}.js` · `modules/registry.js` | NEW domain package `kol-patch` (or `kol-synth`) |
| **F — `funcgen` math-expression engine** | zero-dep `compile(expr)→(t,n,f)=>number` — cleanest single drop-in in the scan | kol-labs-monorepo `packages/funcgen/src/index.js` | support util → kol-component or its own tiny pkg |
| **G — generative motion / loop engine** | seamless pure-function motion sources + registry + 35 shape/field/pattern generators | kol-labs-single `src/loops/{contract,LoopPlayer2D,registry}.js` + `src/loops/*` | NEW domain `kol-motion` |
| **H — canvas FX / raster filters** | OffscreenCanvas pixel FX + a 2481-line image-filter lib + chromatic aberration | kol-mirror `src/hooks/useCanvasFx.js` · kol-labs-single `src/lib/{imagefilters,chromaticAberration}.js` | NEW domain `kol-fx` |
| **I — knob control-atom family** | Knob / CvKnob / Slider / LED / Selector / LabeledJack + RotaryDial variants | kol-monitor `src/modules/parametric/` · kol-mirror `.../RotaryDial.jsx` | addition to kol-component |
| **J — wiki block editor** | Notion-style editable block model + databases (stronger *editing* than workshop; keep workshop's stronger *renderer*) | kol-docs-md `src/components/Wiki{BlockEditor,BlockRenderer}.jsx` + `utils/{markdownToWiki,wikiSchema}.js` | enrich kol-workshop |

**Secondary:** kol-monitor `src/icons/svg/00-rack/` (113 synth glyphs → new icon group); monitor `record{Live,Offline}.js` (WebM capture); labs-monorepo `graphics/svg/structure/` brand diagrams.

**Skip (dupes/already-in-DS/off-brand):** kol-docs (byte-identical to docs-md) · labs-monorepo framework/component/dashboards/theme/chess-data (promoted already) · monitor/mirror themes + labs-single `src/styles/` (DS-derived) · noter's shadcn `components/ui/*` (Radix, off-brand). Only labs-monorepo `@kol/funcgen` + `@kol/loader` remain unpromoted.

**Note on the video-synth (kol-monitor/kol-mirror):** genuinely novel — no DS equivalent. A `kol-patch`/`kol-synth` domain is a real opportunity but a large, dedicated effort. Flagged, not scoped.

---

## Addendum 2 — gap scan (2026-07-10): 9 missed repos → the FX/generative/3D frontier

Completes coverage (all ~29 git repos under `~/dev/projects` now scanned). These open the **effects/generative/3D** frontier — more future buckets.

| Bucket | What | Source | Novelty |
|--------|------|--------|---------|
| **K — kol-fx (raster, flagship)** | 24-mode dither/halftone/ASCII engine + stackable pixel-FX chain | kol-editor-radar `src/effects/ditherEngine.js` + `hooks/useCanvasFx.js` | high |
| **L — kol-3d** | software 3D→SVG **hidden-line** renderer (project/camera/occlusion/CSG) + r3f view | kol-draw-3d `src/math/*` + `scene/exportSvg.js` | **highest — no DS equivalent** |
| **M — kol-image (GPU)** | WebGPU WGSL multi-pass tone/color engine + CPU twin + histogram + presets | kol-lightroom `src/pages/gpuRenderer.js` + `app/pipeline.js` | high |
| **N — kol-generative (vector)** | parametric wavy-shape / radial generator + SVG export + node-drag | kol-radial `radial/apparatus/wavyCircleMath.js` · kol-svg-distress `hooks/useSvgDistortion.js` | med-high |
| **O — kol-motion** | GSAP concentric-circle LFO motion engine + declarative synth control panel | kol-modulator `components/modulator/DialRotation.jsx` | med |

**Capture utilities:** kol-chrome-vcap `offscreen.js` (region-crop + codec-fallback MediaRecorder); Clypra `core/render/{warp,filterIR}.ts` + `audioWaveformGenerator.ts` (small pure islands — Clypra itself is third-party MIT, an **architecture donor** not a component source).

**Cross-refs / skip:** kol-editor-radar `src-grab/` = vendored copy of kol-mirror (dupe of bucket E, not an extension) · kol-chrome-vcap `.a-torg/` = synth session logs (docs only) · **kol-years** = self-styled reflection timeline, nothing novel. modulator/radial are a **vector** lineage (SVG paths), distinct from the synth's **raster** bus — separate buckets.

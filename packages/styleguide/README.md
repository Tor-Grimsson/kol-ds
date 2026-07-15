# @kolkrabbi/kol-styleguide

The KOL **style-guide / brand-guide** component set — the visual specimens a brand manual is built from. Raided from the monorepo `apps/brand` styleguide and assembled here because a brand guide is a shared capability with its own cadence, distinct from the core UI atoms.

Colour anatomy + the **combination lab** (60/30/10 palette × layout × logo, incl. applied-brand mockups), **logo** construction / clearspace / scaling, **mood tiles**, **type blocks**, and **asset spec tables** — plus the colour/type specimen primitives (`ColorRamp`, `ColorSwatch`, `SpectrumGrid`, `TypeSample`, `TypeSpecCard`, `ProsePreview`, `AssetGrid`, `FeatureSplit`) gathered from the core packages.

```js
import { ComboLab, MoodTile, LogoCard, TypeBlock } from '@kolkrabbi/kol-styleguide'
```

## Consumer requirements

- **CSS** ships in `@kolkrabbi/kol-theme` (`kol-components-styleguide.css`, in the theme aggregate) — this package ships JS only.
- Tailwind v4 `@source "…/node_modules/@kolkrabbi/kol-styleguide/src"` so utility classes used inside the components are generated (Tailwind skips `node_modules`, or they never generate).
- Data is consumer-injected — palettes, type scales, logo assets are supplied as flat props.

---
"@kolkrabbi/kol-theme": minor
"@kolkrabbi/kol-framework": minor
---

All KOL-shipped rule CSS now lives in the `components` cascade layer (theme barrel imports via `layer(components)`, `kol-framework.css` wrapped in `@layer components`). Under Tailwind v4's layer order (`theme, base, components, utilities`) consumer utility classes can now always override KOL chrome — previously every kol-* rule silently beat every utility because unlayered CSS wins over all layered CSS. Tokens-only files (`kol-brand-color.css`) and `@theme` blocks are unaffected. No import-order changes required in consumers.

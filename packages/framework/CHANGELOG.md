# @kolkrabbi/kol-framework

## 0.3.0

### Minor Changes

- 8448e47: All KOL-shipped rule CSS now lives in the `components` cascade layer (theme barrel imports via `layer(components)`, `kol-framework.css` wrapped in `@layer components`). Under Tailwind v4's layer order (`theme, base, components, utilities`) consumer utility classes can now always override KOL chrome — previously every kol-\* rule silently beat every utility because unlayered CSS wins over all layered CSS. Tokens-only files (`kol-brand-color.css`) and `@theme` blocks are unaffected. No import-order changes required in consumers.

### Patch Changes

- 8448e47: Renamed the icon package `@kolkrabbi/kol-loader` → `@kolkrabbi/kol-icons`. The name now describes the domain (icons) rather than the load mechanism, matching the `theme`/`component`/`framework` convention. The public API is unchanged (`Icon`, `ICONS`, `ICON_ENTRIES`, `SOLID_ICON_ENTRIES`, `ICON_INDEX`, `ALL_ICONS`, `hasIcon`, `getCategory`).

  Consumers must update the import specifier and the Tailwind `@source` glob to `@kolkrabbi/kol-icons`. `component` and `framework` retarget their internal dependency to the new name (patch).

- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
- Updated dependencies [8448e47]
  - @kolkrabbi/kol-icons@0.4.0
  - @kolkrabbi/kol-component@0.4.1

## 0.2.1

### Patch Changes

- Updated dependencies [1394844]
- Updated dependencies [1394844]
  - @kolkrabbi/kol-component@0.4.0

## 0.2.0

### Minor Changes

- d3b4398: Monorepo-batch P2 — shell set + framework reconciles: new `SearchInput` atom, `ShellDrawer` + `ShellSearchOverlay` molecules, `ShellHeader` framework chrome. Additive merges into existing framework components: `PortalFooter` (brand/columns/socials/note slots), `AppShell` (header/footer slots + `ShellTocContext`/`ShellTocCollapsedContext` + xl TOC rail), `SideNav` (onNavigate/controlled-collapse/collapsibleSections/isActive seams). `PageSection` verified already-equivalent — no change.

### Patch Changes

- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
- Updated dependencies [d3b4398]
  - @kolkrabbi/kol-component@0.3.0

## 0.1.3

### Patch Changes

- fa8ce05: New `CopyButton` atom — the copy-to-clipboard chip (clipboard icon + Copy/Copied swap, 1.8s reset, silent on blocked clipboard) extracted from CodeBlock's inline button so it's a logged atom before being lifted into composites. `CodeBlock` now nests it. Chip look lives in kol-theme (`.kol-copy-btn`); kol-framework's `.kol-codeblock-copy` slims to positioning only. Props: `text` (string or thunk), `label` (false = icon-only).
- fa8ce05: Type-conformance sweep: freestyle Tailwind text sizing replaced with kol type classes throughout component source (rule: helper scale for single-line chrome, line-height-bearing sets for anything that wraps — see docs/typography/01-type-classes.md). Avatar initials now ride the helper scale (`xl` drops 30→20px, the largest helper stop); ToggleCheckbox/ToggleSwitch hints → `kol-helper-10`; Accordion chevron → `kol-helper-16`; SideNav collapse glyph → `kol-helper-14`; AssetPlaceholder note → `kol-helper-12`, its wrappable label → `kol-mono-12`.
- Updated dependencies [fa8ce05]
- Updated dependencies [c750436]
- Updated dependencies [c750436]
- Updated dependencies [c750436]
- Updated dependencies [fa8ce05]
- Updated dependencies [c750436]
- Updated dependencies [fa8ce05]
- Updated dependencies [fa8ce05]
- Updated dependencies [fa8ce05]
- Updated dependencies [fa8ce05]
- Updated dependencies [c750436]
- Updated dependencies [fa8ce05]
- Updated dependencies [fa8ce05]
- Updated dependencies [c750436]
  - @kolkrabbi/kol-component@0.2.0
  - @kolkrabbi/kol-icons@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [de4c33f]
  - @kolkrabbi/kol-icons@0.2.0
  - @kolkrabbi/kol-component@0.1.2

## 0.1.1

### Patch Changes

- fcfa14c: Fix `repository.url` to `github.com/Tor-Grimsson/kol-ds` (and the component README usage link). Corrects the npm "Repository" link that pointed at a nonexistent repo in 0.1.0.
- Updated dependencies [fcfa14c]
  - @kolkrabbi/kol-icons@0.1.1
  - @kolkrabbi/kol-component@0.1.1

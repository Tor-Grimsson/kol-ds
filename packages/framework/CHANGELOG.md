# @kolkrabbi/kol-framework

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
  - @kolkrabbi/kol-loader@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [de4c33f]
  - @kolkrabbi/kol-loader@0.2.0
  - @kolkrabbi/kol-component@0.1.2

## 0.1.1

### Patch Changes

- fcfa14c: Fix `repository.url` to `github.com/Tor-Grimsson/kol-ds` (and the component README usage link). Corrects the npm "Repository" link that pointed at a nonexistent repo in 0.1.0.
- Updated dependencies [fcfa14c]
  - @kolkrabbi/kol-loader@0.1.1
  - @kolkrabbi/kol-component@0.1.1

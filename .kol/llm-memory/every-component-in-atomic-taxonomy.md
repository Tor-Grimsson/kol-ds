---
name: every-component-in-atomic-taxonomy
description: Standing rule — every KOL component in EVERY package must be classified into the atomic categories and indexed; no omissions.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a601fdfb-505a-47b9-8e26-d2ea1b38755a
---

Every component in the KOL design system — across ALL packages (component, framework, content, chess, store, dashboards, foundry, styleguide, workshop), not just `packages/component` — must be logged into the atomic categories (atom / molecule / organism) and be findable in the showcase (registry, sidebar, doc page, search).

**Why:** The user has stated this multiple times; discovering that domain-package components (e.g. kol-content's `SourcesReferences`) were invisible to the registry/taxonomy pipeline read as a broken promise. The pipeline being scoped to `packages/component/src` (see `scripts/validate-taxonomy.mjs` SRC constant) is a scope gap, not a sanctioned exception.

**How to apply:** When a component is added or moved to any package, it gets an atomic classification and a registry/doc entry in the same arc. When touching the taxonomy validator or showcase registry, widen coverage to all packages rather than special-casing the core tier.

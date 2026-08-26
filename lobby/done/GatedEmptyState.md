# GatedEmptyState — placeholder prose should be a DS component, gated, off by default

**Staged:** 2026-08-15 · from **kol-fxr** (kol-design-editor)
**Nature:** action ticket. Close bar: a consumer renders empty-state /
placeholder prose through a DS component, gated behind a key, defaulting to
OFF — with no local implementation.

## The ask

Every app has surfaces that are empty and want to say why: "Select a layer",
"Pick an effect from the nav", "This layer has no parameters", "No effects yet".
Nothing about that is repo-specific.

The user's ruling: **he does not want the app narrating itself at him.** He
knows what the surfaces do. An empty rail stays empty. The prose must be gated
behind a keybind and default to off.

Wanted from the DS:

- A component for placeholder / empty-state prose.
- A gate — one key, one persisted preference — that suppresses ALL of it
  app-wide, default OFF.
- The distinctions this repo invented ("helper text" vs "empty state" vs
  "hint") were wrong and are what let the prose keep creeping back. One
  concept, one gate.

Note the DS already ships `molecules/EmptyState.jsx` — this is likely that
component plus the gate, not a new thing.

## Why it went there

The user, repeatedly, this session: *"GATE PLACEHOLDER TEXT I dont want it I
have it.. gate behind som efucking keybind!"* and *"nothing about this is
unique to repo."* A consumer implementing its own gate means every app in the
estate invents a different one.

## What stays in kol-fxr

- `src/editor/components/Hint.jsx` — a local component + an `H` key +
  a `showHints` app setting, wired to 8 call sites.
  **Declared stopgap — delete it on adopt.**

## ✅ RESOLUTION — 2026-08-15 · kol-component@0.46.0 + kol-theme@0.43.0

`usePlaceholders()` + `<EmptyState gated>`. One concept, one gate, default OFF — the ticket's own diagnosis was that inventing 'helper text' vs 'empty state' vs 'hint' as three ideas is what let the prose creep back, since each had a home and none had an off switch. The suppression is CSS (.kol-placeholder in kol-utilities.css), NOT a render branch, so it covers a consumer's OWN prose the moment the class goes on it — not just EmptyState. Written as :root:not([data-kol-placeholders]) so the element keeps whatever display it had rather than being forced back to block on reveal. The hook persists to localStorage and syncs through a module-level subscriber set, because a settings checkbox and a keybind are usually two components and per-component state would let them disagree about a preference there is only one of. `gated` is OPT-IN, not the default: flipping it would silently blank every surface already shipping an EmptyState. THE DS OWNS THE PREFERENCE, THE CONSUMER OWNS THE KEYBIND — a design system that grabs a global key collides with every app that already used it, and your own H is already toggle-visibility in the editor keymap.

**Remainder here:** none — kol-fxr bump, delete Hint.jsx and its module-scope H listener, put .kol-placeholder on the 8 call sites, bind toggle to whatever key you want.


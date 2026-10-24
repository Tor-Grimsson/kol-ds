# Session: The hubs against the template — one shape, no JSX, the pass that diffs the reference

**Date:** 2026-10-24
**Agent:** Claude (Grim)
**Summary:** plan-2026-10-24-hubs-against-the-template built end to end (W1–W6): FXR, Mirror and Monitor match studio-hub page for page, measured by a pass that diffs each hub against the reference directly instead of against a list of his points; the settings rail, the walkthrough and Create's link take data only; FXR's rail is fxr.kolkrabbi.io's.

## Changes Made

### Files Modified
- `packages/shell/src/AppHub.jsx` — the settings rail: typed rows only (`render`, `content`, `tabs` refused with a dev warning); the tab row is exactly Settings · Shortcuts · About · Repo on every app, drawn from `shortcuts` · `app.about` · `app.links`; the Hub draws kol-framework's `ThemeToggle` itself (deep import, kol-framework now a peer; `themeToggle` prop retired); reset live on every rail — the theme back to the system, then the app's `drawer.onReset`.
- `packages/shell/src/{WalkthroughPanel,HubHome,StudioCreate,About,warnJsx,HubSettings}.jsx` — the walkthrough's Get started `actions` as `[{ label, onClick }]` (the panel draws DS Buttons, the Hub closes first), a step's `cover` src; `caseLink` as `{ label, onClick }`; `app.about` as a string or paragraphs; `StudioCreate page` / `onPageChange`; one `warnJsx` for any element handed to a data prop.
- `packages/shell/src/CatalogPage.jsx` — the `app` preset's grid floor 208, so the card's date · size hold one line and a narrower page drops a column.
- `packages/component/src/organisms/SettingsSections.jsx` — typed rows (`type: 'choice' | 'switch'`), a string `value` in the DS's mono-12, a section `note`; `SettingsPanel.jsx` `SettingsFooter resetDisabled`.
- `packages/component/src/organisms/{AppItemMenuProvider,NavRail}.jsx` · `molecules/{AppItem,ContentText}.jsx` — the file rail's read mode right-aligns every value; expanded rail rows in `.kol-rail-group` at the sm rung on a 4px gap; the mark in the download's 32px box; the `app` card's date · size never wrap.
- `packages/icons/src/Icon.jsx` (0.45.0) — a registered glyph never overrides a DS name (Mirror's `refresh` had replaced the DS's).
- `apps/editor-hub` — the rail Library · Editor · Labs · Randomiser · Morph (Chrome section and page gone), Labs' categories static from the editor's labs catalog so Labs enters and Effects expands at Home, six typed settings over the editor's store with reset, every verb on files over local state, one `fileCard` on Home and Library.
- `apps/mixer-hub` · `apps/rack-hub` — Create on `StudioCreate` (old pages → `_tmp/2026-10-24-create-on-studiocreate/`), Home with every verb over local state and the same `fileCard` on Library (landing on the files), settings as typed rows (Mirror's render budget under Settings, labels short with the detail as the hint), walkthrough and About as data; Mirror's `create` on `shell: false`.
- `apps/studio-hub` — typed rows, walkthrough and Create link as data, no toggle prop; `apps/{hub,brand-hub,media-hub}` drop the toggle prop.
- `_tmp/2026-10-24-hubs-pass/pass.mjs` — the reference-diff pass (the class tree with every datum stripped, the measurements, a controls probe, a walkthrough probe, the one-rule walk per app, a runtime helper row), per-hub allowlists with file:line.
- `scripts/validate-views.mjs` — an alias export (`default as PageLayout, default as AppShell`) counts as one view.
- Docs: `04-compositions/{17-settings,16-app-anatomy,11-shell-system}.md`, `03-components/01-inventory.md`, `docs/operations/07-apps-tier/05-studio-parity.md` (rewritten for the pass); changelogs component 0.296.0 · shell 0.77.0 · icons 0.45.0; the plan file (W1–W6 ✅, 2.2 parked); `showcase/src/sets/settings.jsx` typed rows; api tables regenerated.
- Lobby: `StyleguideSrcExports` (kol-branding) addressed — `"./src/*"` opened in kol-styleguide's exports, unpublished.

### Features Added/Removed
- Nothing an app writes as JSX reaches a Hub surface: settings rows, tabs, the walkthrough's buttons, About, Create's link are data the Hub draws; the shell warns in dev on any element.
- Removed: the Chrome section in FXR; Mirror's and Monitor's own Create pages; Monitor's Shortcuts · About · Repo as its own tabs (they are the Hub's on every rail); the `themeToggle` prop's effect.

## Current State

### Working
- Pass green against studio-hub: FXR 54/54, Mirror 71/71, Monitor 71/71 at 1440 (rail closed and open) and 390. `validate:render` clean on the four hubs; the gate set green bar the standing retirements pair.
- Unpublished in the tree: kol-component 0.296.0, kol-shell 0.77.0 (new peer: kol-framework ≥0.53.0), kol-icons 0.45.0, kol-theme 0.184.0, kol-styleguide (Unreleased).

### Known Issues
- Morph in FXR is a placeholder page — the mirrored editor carries no Morph route.
- A verb on a real FXR preset or a Mirror rename is this session's state only: the mirrored editor exports no storage writes, the mixer store has no rename.
- The expanded rail rows' rung (26 on a 4px gap) is his to rule on the NavRail page.

## Next Steps
1. His review of the four hubs (`pnpm hubs`), then the publish (`/upig`) — kol-component · kol-shell · kol-icons · kol-styleguide.
2. On the publish: kol-fxr · kol-mirror · kol-monitor adopt (typed settings rows, data-only walkthrough and About, no toggle prop, FXR's rail); kol-branding drops its Vite alias; the HubHomeContract and StyleguideSrcExports tickets close.

## Amended — 2026-10-24

- `docs/operations/07-apps-tier/06-studio-adoption.md` — the adoption playbook: nine numbered steps a kol-fxr, kol-mirror or kol-monitor session runs after the bump (the rail rows, Home with every verb, Library on the same card, Create on StudioCreate, the settings rail as typed rows, the walkthrough and About as data, what leaves, the pass against studio-hub as the acceptance), each step naming the sibling's file and its finished twin in `apps/`. Indexed in the apps-tier INDEX, linked from the parity checklist; doc gates clean.

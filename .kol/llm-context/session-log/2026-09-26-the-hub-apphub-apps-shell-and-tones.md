# Session: The Hub — AppHub, apps/shell, and the tone visualiser

**Date:** 2026-09-26
**Agent:** kol-ds-ui (Claude Opus 5.5)
**Summary:** Steps 2–3 of the app-anatomy plan: read monitor · mirror · fxr, shipped `AppHub` (Shell + Hub) in kol-shell and `apps/shell` on it, then four review rounds — masthead, fxr's settings as options, the file-row list, tones. Unpublished. Playbook: `playbook/2026-09-26-the-hub.md`.

## Changes Made

### Files Modified
- `packages/shell/src/AppHub.jsx` · `HubHome.jsx` · `HubSettings.jsx` (new) — the Hub: Home at `/`, Settings at `/settings`, the tool as children; keys `,` · `S` · `\` · ⌥1–9
- `packages/shell/src/AppShell.jsx` — `navKeys` walks the bottom rows too (Settings)
- `packages/shell/src/WalkthroughPanel.jsx` · `CatalogPage.jsx` — `onClose` X inside the card
- `packages/shell/src/SettingsScaffold.jsx` — masthead cluster carries the page's tone class
- `packages/component/src/molecules/SectionText.jsx` — inline actions row `self-stretch` (every PageHeader cluster to the right edge)
- `packages/component/src/organisms/SettingsPanel.jsx` — `SettingsChoice` variant unset (inherits a tone wrapper)
- `packages/component/src/molecules/Dropdown.jsx` — `{ divider: true }` options
- `packages/theme/kol-components-molecules.css` — ViewToggle selected segment under a tone = `fg-08` (inverted keeps its own)
- `apps/shell/` (new) — `pnpm shell` :5176, slug `/apps/shell`, vercel rewrite, root build
- `showcase/src/pages/FoundationsTones.jsx` (new) — `/foundations/tones`: surface × wash × tone
- `showcase/src/demos/HubHome.jsx` · `HubSettings.jsx` · `nav/classification.js` — demos, roster, AppHub NO_DEMO
- `scripts/generate-lookups.mjs` → `docs/documentation/01-foundations/13-tone-lookup.md` (generated) + foundations INDEX row
- `docs/documentation/04-compositions/16-app-anatomy.md` — the Hub table
- `docs/documentation/03-components/05-control-chrome.md` — § Tone table by depth
- `.kol/llm-context/backlog/2026-09-26-consumer-findings-from-reference-clones.md` — mirror icon override etc., for the iMac

### Features Added/Removed
- `HubSettings` options: `sections` (rows as data, searched) · `drawer` (gear → same sections) · `picker` · `splitShortcuts` · `content` · `tabs` · `tone` (default sunken; `tone: 'primary'` one line)
- `HubHome` list default = ContentRow `file`, stacked (brand's row); CatalogPage's own default untouched
- Tone order ruled: sunken · secondary · primary · grey · inverted, then outline · ghost (depth, not brightness)

## Current State

### Working
- apps/shell: Home, walkthrough, Settings + drawer + picker, keys, 390 drawer — clicked through live; 27 gates clean

### Known Issues
- Nothing published — kol-shell, component, theme carry the changes
- monitor's tap-⌥-then-digit form not in `navKeys`
- `SettingsChoice` outside a tone wrapper loses the open panel's top hairline (accepted)
- Clones on the MBP are reference only — no tickets filed (memory `cloned-repos-are-reference-only`)

## Next Steps
1. User reviews apps/shell further
2. Step 4 — rebuild apps/media-shell on `AppHub` (walkthrough opt-in, smart folders out, RECENT · FAVOURITES, Home as a Catalog)
3. Publish kol-shell · component · theme when the Hub settles
4. Sort the tool roster

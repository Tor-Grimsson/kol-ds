# Session: The Figma library from the code, metric rebuilt on KOL, the Menu family

**Date:** 2026-10-31
**Agent:** Claude (Opus 5.5) — kol-ds-ui-2d, "Grim"
**Summary:** Built and kept the Figma mirror (❖ library--kol-ds-ui) from the code — W1–W32 — rebuilt apps/metric on KOL parts over nine review rounds (the Menu* family, Dropdown raised, Modal variants), shipped NavRail `variant="top"`, DocumentHeader, ink-roles, and closed five lobby tickets.

## Changes Made

### Files Modified
- `.kol/llm-context/plan-2026-10-31-figma-library.md` — W1–W32 with results; `playbook/2026-10-31-figma-library.md` the journal
- `docs/operations/09-phase-log/2026-10-31-metric-rebuild.md` — rounds 1–9 (every change before → after → why); `2026-10-31-icon-batch-scan.md` — the 252-icon scan
- `packages/component` — Menu.jsx (Menu, MenuTrigger, MenuPanel, MenuLabel, MenuFilter, MenuDatePicker, MenuMore), MenuItem.jsx (MenuRow/MenuDivider/MenuFlyout + aliases, `href` rows), Dropdown (select only; `variant="raised"`), Modal (`variant` lift · bordered), Button `variant="bare"`, SectionText `level` → `variant` (+ `lede`), TabsRow dock hover, NavRail `variant="top"`, SettingsRow `stack`
- `packages/theme` — oq-06 step, tab hover oq-04, quiet menu triggers, `.kol-menu-panel`, select one-tone (0.208.0) + raised bundle (0.209.0)
- `packages/dashboards` — Heatmap dots/colTick, CalendarHeatmap (+ label-collision fix 0.7.1), DashTooltip = `.kol-tooltip`
- `packages/framework` — DocumentHeader (0.68.0); `packages/shell` — HubHome surface, HubSettingsRail extra, dock hover moved into TabsRow
- `packages/icons` — more-vertical; `apps/metric` (new reference app), `apps/document` (DocumentHeader), `apps/overlays` (Modal variants)
- `figma/*.figma.js` — Code Connect for every new component (541 maps); `scripts/figma-tokens.mjs`
- `~/.dotfiles/claude/skills/app-icon/bin/propose.cjs` + `kol-icon/example.html` — dashed DS-weight guides
- memory: mind-the-credit, family-prefix-naming, mirror-look-changes-to-figma, figma-pages-1e1e1e, questions-go-in-the-question-tool, look-before-handing-over (amended)

### Features Added/Removed
- Figma: tokens (+ neutral ramp, breakpoint type sizes, `ink-roles` collection by mode, `tone` collection), atoms → organisms, 07-icons, styleguide frames, application pages (brand-hub · brand-lab · studio-hub · article · document · generators · site-hub · workshop · website), 27-document-system, `_trash`
- Retired (ledger): MenuDropdown* names, `.kol-dd-menu`, SectionText/PageHeader `level`

## Current State

### Working
- Published live: kol-component 0.328.0, kol-theme 0.209.0, kol-dashboards 0.7.1, kol-framework 0.68.0, kol-shell 0.96.0 (peer went on to 0.98.0 / component 0.329.0)
- Figma library: every page canvas #1E1E1E; text on styles bound to `font/*` + `font-style/*`; type sizes by `breakpoint` mode; ink by `ink-roles` mode

### Known Issues
- Figma can't raise footnote refs or fill an inline-code chip (MarkdownPage)
- The Figma plugin can't load PP Right Grotesk: edit Grotesk text by flipping the frame's `type` mode to Schibsted and back
- The library is unpublished since his last click (ink-roles, document system, sync pass, layout pages, NavRail top, OriginPicker)

## Next Steps
1. The 252-icon batch rework + import is the other agent's (modifier rule in `_tmp/icons/2026-10-31-construction-rule/RULE.md`)
2. Phasing out Right Grotesk stays parked (Later)

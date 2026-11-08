# Session: Lobby tickets, Studio/Catalog/Hubs finished, apps pages moved to the layout file

**Date:** 2026-11-08
**Agent:** Claude (Grim), kol-ds-ui-bc, with background kol-figma-agents (Opus, then Sonnet after the Opus weekly limit)
**Summary:** Two lobby tickets closed, the Studio/Catalog/Hubs plan's W1–W2 built in the library, and the user moved the Apps screens into `layout--kol-ds-ui` by hand after the library publish.

## Changes Made

### Files Modified
- `~/.claude/skills/kol-figma/SKILL.md` — new law: no wrapper frames (§2.4, §6); step 0 reads the Figma file list first.
- `docs/operations/10-figma/01-file-setup.md` — all 14 files with keys, in folder order; foundry added (kol-website agent's build); `covers` noted as a stray file.
- `.kol/llm-context/plan-2026-11-08-apps-pages-out.md` — new plan; W1, W2, 3.1 ✅.
- `packages/framework/kol-framework.css` — `.kol-page` width 100% + border-box (published kol-framework 0.74.1).

### Features Added/Removed
- Figma library (LibraryMastersFoundryWebsite): foundry and website masters — TypeTester, Accordion/AccordionPanel, SectionFaq, ContentRow/ContentCard `typeface`, SectionCardItem `visual=none`, SectionHero `split`, ContentCard `showcase`, SectionCta `centered`, ExhibitLinkCard, SourcesReferences; Slider `value`; ShellHeader tabs as a slot.
- ExhibitLinkCard: fg-inverse variables deleted, card pinned to Light mode.
- Studio: StudioCreate 1828:17090, StudioDetail 1828:17150; studio-hub section 20 screens, Home signed-in included.
- Catalog: all 12 states and hub desktop checked against live; master fixes (ActionButton `chrome`, ContentCard/ContentRow `app`, AppStudio phone pill, HubHome signed-in).
- The user moved the Studio, Catalog and Hubs frames into `layout--kol-ds-ui` (EMdyp9gS3UiMT9tYMZHF5T).

## Current State

### Working
- Library published; the apps screens live in the layout file as linked instances.
- The lobby belongs to this session; the other kol-ds-ui session runs the modal family.

### Known Issues
- Hub phone pill 16px low (778 vs 762); covers are grey placeholders.
- `figma/SourcesReferences.figma.js` was overwritten; the old text only exists in his diff.
- The ExhibitLinkCard bidirectional fix (`fg-ab-*` + `surface-inverse`, no pinned mode) is parked on his "maybe later".

## Next Steps
1. 3.2: retire the three emptied Apps pages from the library (on his word), then he publishes again.
2. No agents until he says — credit is out (Opus resets 2026-11-10 03:00).

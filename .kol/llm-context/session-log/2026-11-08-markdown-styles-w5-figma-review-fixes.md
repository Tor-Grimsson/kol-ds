# Session: Markdown styles W5, deploy fix, Figma review fixes, foundry tickets

**Date:** 2026-11-08
**Agent:** Claude (Grim), kol-ds-ui main session plus background agents
**Summary:** The Vercel deploy is green again. MarkdownPage now has three styles (site, research and article), all drawn from one class map, and W5 is built in code and in Figma. The user's Figma review and its code fixes are published, and three lobby tickets are closed.

## Changes Made

### Files Modified
- `showcase/vite.config.js`: aliases design-editor to its source, so Vercel builds without a dist.
- `showcase/src/nav/classification.js`: roster entries (MenuList, FloatActionMenu, useRailKeys, useFloatPresence, IndexCard, TypeTester).
- `packages/framework/src/markdownVariants.js` (new): the one block-to-class map, read by MarkdownPage and kol-content's PortableTextRenderer.
- `packages/framework/src/MarkdownPage.jsx`: `variant` takes site, research or article; the site style sits on the fg-02 ground through `--kol-shell-page-wash`.
- `packages/component/src/organisms/NavRailSite.jsx`: new `pageIcons` prop; `'gutter'` hangs the glyph in the gutter so the label doesn't shift.
- `packages/component/src/organisms/ColumnBrowser.jsx`: the zones row's text comes from ContentText, with no middot.
- `packages/framework/src/LinkPreview.jsx`: built from ContentMedia and ContentText.
- `packages/component/src/atoms/Label.jsx`: new `icon` prop.
- `packages/shell/src/StudioDetail.jsx`: the back chevron is an Icon, not "‹".
- `packages/icons`: adds `identity/foundry`.
- `apps/document/src/App.jsx`: takes `?variant=` on `/library/<id>`.
- `apps/panels/src/App.jsx`: a local SelectionPane replaces the retired SelectionPalettePanel.
- Retired to `_tmp/`: PageCover, which SiteHero already covered.

### Published
kol-framework 0.73.0, kol-content 0.16.0, kol-component 0.354.0, kol-shell 0.117.0, kol-icons 0.67.0. All are live on the registry.

### Figma (n48kE2bJtrFjl7wxst30xH, not published)
- W5: 10 block parts take `variant` (site, research or article). `markdown-page/document` holds the same 16 instances in each style. DocumentFiles and DocumentMarkdown are now components. SheetArticle and Contents/row are in `_trash` (Contents/row's 30 copies were swapped to IndexCard).
- PageHero and PageSection now pass the prose classes into SectionText, so section headers measure 116, the same as live.
- Review fixes:
  - ColumnBrowser/row rebuilt on a new OptionRow master: real icon sizes, a 12px chevron, no clip wrappers, ContentText for the meta.
  - ContentCard's cover is a free slot.
  - LinkPreview uses ContentMedia.
  - DeckEditor/layout-tile uses SlideThumb.
  - SectionText's headline and body sit in a stack, and the "‹ BACK" glyph is gone.

### Lobby
Closed: TypeTester, SiteRailPageIcons and IdentityFoundry. Filed MarkdownPageSiteVariant to kol-website, which closed it with nothing owed.

## Current State

### Working
- ui.kolkrabbi.io deploys green.
- kol-kerner uses `pageIcons: 'gutter'`; kol-hq confirmed all 13 rows are aligned.

### Known Issues
- 23 Figma masters have no code export (the agent's list); none are trashed yet.
- The PageHero gap under the title is drawn at 16 against 24 live.
- Code Connect for DocumentFiles and DocumentMarkdown isn't written.
- LinkPreview's new code hasn't been seen on screen, because it only opens on hover.

## Next Steps
1. The user: git push and publish the Figma library.
2. Review the 23 no-export masters with the user before trashing any.
3. The foundry Figma file is to be built from a kol-website session, which owns the foundry code.

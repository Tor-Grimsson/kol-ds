# LayoutsAppUnusable — apps/layouts (5212): you can't switch layouts, and the pages don't render as pages

**Staged:** 2026-10-29 · from kol-website (user, on 5212: *"broken, and no way to change layout type… complete failure"*, *"this is so stupid"*)
**Files:** `lobby/_assets/LayoutsAppUnusable/` — the user's screenshots + `website-sitehero.png`

---

## What's wrong
1. **You can't change layout.** The layout chooser is a group in SiteLayout's own rail, so it exists only on `/site/*`. Pick AppShell (`/app/HubHome`) and you land in AppShell's icon rail: about 20 identical generic file icons with no labels, plus four unlabelled icons at the bottom, with no way to tell which is the way back. WebsiteLayout (`/website/SiteHero`) has nothing at all. Its only navigation is the takeover menu, so you're stuck. ShellLayout has the same problem. The point of the app is to switch layouts and compare them, and only one of the four lets you.
2. **AppShell's rail is unreadable.** Every page row uses the same `file` icon, the rail is collapsed, and you can't tell HubHome from MetricsDashboard.
3. **Pages don't fill their layout.** `SiteHero` in SiteLayout is 560px tall in a 720px window (it should be `100dvh`), and the plane below it is empty. A stray circle (the cursor ring?) sits over the hero. Its content is a copy of brand's old Landing, Styleguide button included, which brand removed today.
4. **Pages show "Loading <Name>…"** on first arrival in AppShell and WebsiteLayout. A lazy chunk arrives seconds later, and WebsiteLayout's footer sits right under the loading line meanwhile.

## The fix
- **A layout switcher outside the layouts.** One persistent control that is never a row inside any layout's own nav (a top strip, or a segmented control pinned in a corner). It names all four, shows the current one, and keeps the page when it exists under the new layout (`/site/MediaLibrary` → `/app/MediaLibrary`).
- **Each layout's rail is readable.** Pages carry their own icons, or the AppShell rail opens expanded with labels in this app. Never a column of identical glyphs.
- **Each page is shown as it is used.** `SiteHero` is the home page: full height, the layout's wash, nothing left over. Each page fills its layout the way it does in a real app (brand, record, kolkrabbi.io), not shrunk into a block.
- **No loading flash.** Preload, or keep the previous page until the next is ready.
- **The fixture content is the fixture's.** It is VOYAGER, with no Styleguide button from an old Landing.

**Walk it as a person does:** open 5212, switch through all four layouts and back, open five pages in each, at 1440 and 390. The 63 placements rendering without errors proved the parts work, not that the app does.

## Definition of done
- [ ] a layout switcher that is always there, in all four layouts, and keeps the page where it can
- [ ] readable rails in every layout
- [ ] pages fill their layout like they do in the real apps; no loading flash
- [ ] walked by hand through all four layouts, both widths


---

## ✅ RESOLVED — 2026-10-29

apps/layouts, rebuilt against the four points:
1. **The switcher is outside the layouts.** A segmented control is pinned bottom-centre over every frame, never a row in any frame's nav. It reads SiteLayout · AppShell · ShellLayout · WebsiteLayout at desktop width and Site · App · Shell · Website on a phone. It keeps the page when the next frame holds it (`/app/MediaLibrary` → `/site/MediaLibrary`), otherwise it opens that frame's first page. It loads the page before switching, so it never lands on a blank. The frames' own navs list their pages and nothing else.
2. **Readable rails.** Every page has its own glyph in every frame (HubHome home, MediaLibrary image, MetricsDashboard chart, ChessAnalysisLayout rook…). The site rail lists them as link rows. The shell sidebar opens its page list instead of collapsing it. The shell header shows VOYAGER's wordmark, not the workshop's KOLKRABBI.
3. **Pages as they are used.** `SiteHero` is the landing at full height, as site-hub's Home renders it, on VOYAGER's mood image, mark, name and manifesto. It has no Styleguide button and no wash, and the circle is gone (it was drawn into the preview's backdrop). In WebsiteLayout it starts under the floating bar, as kolkrabbi.io's full-bleed pages do; every other page clears the bar. `PrintStudio` fills the screen as in apps/print. `ChessAnalysisLayout` is the apparatus in its consumer's wrapper; its preview iframed a showcase-only route.
4. **No loading flash.** A page's module loads once and is kept. The previous page stays until the next is ready, and a frame preloads its pages when it opens. The "Loading…" line is gone, and the footer no longer jumps.
- **Walked** by hand at 1440 and 390: switched through all four layouts and back, five pages in AppShell plus the keep-the-page switch, the shell and website frames, and all four on a phone. All 63 placements were swept again at 390 with the switcher present on each. One error turned up (the type specimen's optional `opentype.js` resolved from kol-foundry's folder) and is fixed in the app's config.

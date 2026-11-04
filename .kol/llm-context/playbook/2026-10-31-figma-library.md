# Playbook — the KOL Figma library (2026-10-31)

Live journal for `.kol/llm-context/plan-2026-10-31-figma-library.md`. Append-only, newest last.
File: https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH · status: `✓` done+verified · `~` in progress · `⤺` reverted.

---

[03:47] · go · plan W9 + "Next"
  what → his go on all of it: "go! do all of it, dont make me say it again!!!"
  note → W1–W8 built earlier today; W9 primitives (code route) + article set/page, brand-hub, brand-lab, studio-hub modals, rails, layouts + hubs, research set now running

[03:48] · W9/code · packages/theme/kol-base-tokens.css
  what → twelve greys defined once as --kol-neutral-<lightness×10>; every --kol-surface-* reads a neutral or a pole
  verify → 248 colour props × light/dark/os-dark/os-light identical before/after ✓ · kol-theme 0.202.0 published ✓

[03:49] · intake · kol-atlas-fe
  what → Table cell/row components, table cell text styles at 1.4/1.3, Dropdown FILL fix — queued behind the running Figma build

[03:56] · W9/figma · primitives collection
  what → 12 neutral/* primitives; 8 used surfaces alias neutral/* or color/* per mode
  verify → resolved == old values, 0 mismatches ✓ (surface/on-tertiary not in the library, unused)

[03:58] · W11 · kol-atlas requests
  what → TableCell + TableRow sets, Table rebuilt from rows, table/cell-* styles at 1.3/1.4, Dropdown btn+label FILL
  verify → rows 40/41 ✓ · Dropdown instance at 180 → btn 180 ✓ · screenshot of both Table variants ✓ · kol-atlas messaged

[04:16] · W11 · TableCell iconSize
  what → variant iconSize 14|16 (kol-atlas: the lab passes Icon size 16); property refs re-attached on all 24
  verify → refs on every iconSize=16 variant ✓ · kol-atlas messaged

[04:20] · W12/12.1 · breakpoint collection
  what → Phone/Tablet/Desktop modes: pad-section x/y, grid cards/masonry; size/bp/sm…2xl
  verify → browser 375/800/1280 = mode values ✓ · probe frame padding follows the mode ✓

[04:34 from 2026-10-31] · W10/T3 · article set + 11-article
  what → ArticleHeader heroImage=true|false, StackHero, ContentCard, ContentRow, PortableTextRenderer, ContentCollection (05); ShareButtons, SourcesReferences, StickyNavCard (04); article page × 2 from instances
  verify → ArticleHeader 789/404 = measured ✓ · page screenshot ✓

[04:34 from 2026-10-31] · W10/T5 · rails, layouts, hubs
  what → Rail role=patch|page|settings|bottom; SiteLayout, AppShell, ShellLayout, WebsiteLayout, AppHub page=home|settings, AppStudio on 05
  verify → screenshots of ShellLayout + AppShell ✓ · widths sum to 1440 ✓

[04:34 from 2026-10-31] · W10/T4 · app first screens (handed to fork 2)
  what → brand-hub /, /assets, /settings · brand-lab #color, #type · studio-hub home, sign-in, settings, shortcuts
  verify → screenshots of /assets, #color, settings ✓

[04:34 from 2026-10-31] · W12/12.2 · phone frames (layouts, hubs, article)
  what → 7 frames at 375×812 in the Phone mode, rails swapped for NavDrawer / AppFloatNav pill, cards one column
  verify → page padding reads 20 via pad-section/x ✓ · no rail visible ✓

[04:34 from 2026-10-31] · W10 · styleguide, Code Connect, audit
  what → 23 instances on both styleguide frames · 16 templates, 59 published · kolfig plugin data deleted · servers 5291–5298 killed · probe in _tmp
  verify → publish 0 errors ✓ · audit 2 literal fills, 0 strokes ✓

[04:39] · W13 · 12-document
  what → MarkdownPage + LinkPreview components, sheet/* styles (8), Document — /project composed from instances
  verify → screenshots ✓ · 0 unbound fills/strokes ✓ · Code Connect published ✓

[04:39] · W12.2 · Phone frames (08/09/10/12)
  what → 10 Phone frames at 375, breakpoint mode Phone, phone chrome per the code
  verify → padding reads pad-section/x = 20 (studio-hub absolute by design) ✓ · no rails ✓ · servers 5299–5302 killed ✓

[04:49] · W14/14.1 · helper atoms
  what → IconFrame, IconPlate, CloseButton, IconToggle, Kbd, Label, SectionLabel, ProgressBar, SortHeader on 03-atoms
  verify → sizes = measured code ✓ · 0 unbound fills/strokes ✓ · on both styleguides ✓ · Code Connect published ✓

[04:49] · W14/14.2 · Button iconOnly + outline
  what → +18 iconOnly, +3 outline; 15 originals keep IDs
  verify → squares 26/32/40 ✓ · screenshot ✓ · template emits iconOnly ✓

[04:49] · W14/14.3 · stand-ins + Rail
  what → 32 brand-lab placeholders → Button instances; Rail 14:9 → _retired section
  verify → screenshot of Color Lab ✓ · no 14:9 instances left ✓

[04:57] · W14/14.4 · Button variants
  what → variant nav/tab/tab-filled/accent/danger + pressed, 21 new, 36 IDs kept
  verify → sizes match code (26/32/40) ✓ · colours bound, ui/error matches ✓ · Code Connect variant snippets ✓ · styleguides +21 each ✓

[05:01] · W15 · icon Code Connect
  what → 440 icon templates; Button icon-only reads the swapped icon's codeConnectId
  verify → all Code Connect files valid ✓ · sentinel test printed the icon name ✓

[05:07] · W18 · UI font sheet
  what → ui-font collection (6 modes; family + per-family weight names + specimen link), 37 ui/* styles, 13-ui-font page with the sheet
  verify → six modes switched, 0 missing fonts in each ✓ · Montserrat screenshot ✓ · back to Inter

[05:18] · W19 · kol-atlas's list
  what → Dropdown/TableRow/Pill hug · TableCell chip · Button nav icon-only + iconLeft + radius=full (120) · TabsRow type + icon · DocsToc · QuickLookFrame · List · ColorPickerPopover · ContentFilters
  verify → measured vs code (Dropdown 102/119/136 vs 101.2/118.4/135.6, mono-light tabs 98/72/72 vs 97.2/72/72) ✓ · Code Connect valid ✓ · audit 0 unbound but 2 literal picker colours ✓

[05:30] · W16 · float style published
  what → kol-growth 0.3.0 (fxr's pending settle) · kol-theme 0.203.0 · kol-component 0.320.0 (incl. pending 0.319.2) · kol-shell 0.92.0; ticket closed
  verify → 1944 checks 0 fails ✓ · tarballs live ✓ · screenshots looked at ✓

[05:39] · W17 · float + glass in Figma
  what → glass effect styles + fills; AppFloatNav, AccountForm, MoreSheet, Tooltip; float variants on Button, Input, TabsRow, SegmentedToggle
  verify → effects equal the CSS ✓ · sizes equal the measured code ✓ · Code Connect valid ✓ · 0 unbound fills/strokes ✓

[06:10] · W20 · kol-atlas's third list
  what → Dropdown widest (grid row) · Button nav icon-only swap bound + oq/80 ink · Button pressed on icon-only + nav (171) · TocRow + DocsToc slot · QuickLookHeader + QuickLookFrame slot · ColorPickerPopover title/modes/hexEnd/alpha · TabsRow bare
  verify → Entries+Other definitions 181 vs code 180.4 ✓ · 84 icon-only swaps read back ✓ · picker 347×352 = ColorLab ✓ · 20-row toc + consumer body, 0 detaches ✓ · light/dark looked at ✓ · Code Connect published ✓ · 0 unbound (2 literal picker gradients) ✓
[06:48] · W21 · kol-atlas's fourth list (21.1–21.2; 21.3 parked)
  what → Button tab icon-only (12) + disabled on every variant (366, opacity/disabled) · QuickLookHeader set 115:424 (title mono|eyebrow, actions SLOT) · QuickLookFrame header exposed
  verify → tab 26/32/40 + pressed oq/08 light/dark ✓ · disabled = opacity 0.5, ink unchanged (code) ✓ · LabWindow header x 952…1156 = code, 0 detaches ✓ · light/dark looked at ✓ · Code Connect published ✓ · 0 unbound ✓

[07:37] · W22 · 11-article rebuilt from the live page
  what → 57:343 · 57:579 · 72:1281 rebuilt in place from instances at measured boxes · StackHero fill + scrim + top panel · ShareButtons one outline row · SourcesReferences left/items-start · ContentCard 16:9 + hug + clamp · ContentRow items-start · ArticleHeader wrap + 2:1 · PortableTextRenderer blocks SLOT
  verify → every top-level block within 1.6px of Playwright (1440×900, 375×812) ✓ · one share row ✓ · side-by-sides looked at ✓ · Schibsted edit mode cleared ✓ · Vite 5312 killed ✓

[08:36] · W23 · kolkrabbi.io monitor article rebuilt from the live page
  what → 153:1623 (1440) · 155:2160 (375), dark · WebsiteLayout › ArticleHeader › StickyNavCard TOC › PortableTextRenderer (63 blocks verbatim) › SourcesReferences ×11 › ContentCard ×3 · 16 real images · fixed ArticleHeader title style (the "Monosp/ace" cause), StickyNavCard state set 146:605, Divider 1px, WebsiteLayout nav/page slot/wordmark, slots for tags/sources
  verify → blocks within 0.5px where font-independent ✓ · 0 fixed-width text ✓ · line counts listed in plan ✓ · side-by-sides looked at ✓ · Code Connect published ✓ · W22 frames under _retired needs his drag (fonts)

- 08:42 — Responsive type: `breakpoint` collection gains text/display-01..04 · heading-01 · prose-display · prose-title sizes + leading/* (Phone · Tablet · Desktop, from kol-typography.css @media 768/1280 and the min() caps), bound in 10 text styles; every page defaults to Desktop, the 375 frames to Phone. The article frames' 8 detached Grotesk texts re-attached (phone title → prose/title 44, Stack titles → sans/display-03 36/48, TOC head → sans/heading-05).
- 08:53 — W24 tone collection: `tone` 165:87 (7 modes, 16 vars aliasing color/*), Button/Dropdown/Input/Textarea bound to it, Button tone variant retired (128 instances → explicit mode, 366 → 186 variants, ID 8:32 kept), specimen on both styleguides, Code Connect republished. Gap: outline hover-border has no color variable.
- 11:40 — W25 layout group: 8 pages 14–21 (172:87–94), sets LayoutType 190:604 · LayoutColor 178:5629 · LayoutLogo 176:5512 · LayoutText 180:5816 · LayoutGuide 182:87 · BlockSwatch 175:241 · CardLogo 175:201 · BlockType 175:242; collections layout-type 170:95 + layout-color 170:148 (mode kolkrabbi); measured from brand-lab /layout/*.
- 13:32 — W26 DocumentIndex: SectionText set 197:1153 (`level` × 5, page = 14:75), Table 23:60 `rows` SLOT, TableRow 49:277 `cells` SLOT, DocumentIndex 198:700 (cards 198:634 · table 198:281) on 22-document-index 198:280. Code Connect written, not published (LogoCard 26:62 blocks the full publish).
- 13:58 — W27 ink roles: 8 ink/* in color (203:87–94), 7 fg role duplicates removed (0 refs), 727 duplicate paints + 21 components' role texts rebound; layout-color untouched.
- 15:51 — W28 application pages: 24-site-hub 225:87 · 25-workshop 227:87 · 26-website (/stack 230:87/232:288 · /work 238:946/236:513 · / 241:1603/243:1896) measured from apps/site-hub, apps/workshop, kolkrabbi.io; WebsiteLayout slot + Button/Tag/ContentCard/icon instances, 60 real images; 0 unbound text fills, 0 fixed-width text; side-by-sides looked at; vites 5345/5346 killed.
- 16:13 — W28 text pass: 362 text nodes styled by class (18 new styles, 3 breakpoint size vars), 128 titles truncate, 0 unstyled on 24/25/26; side-by-sides -v2 looked at.
- 16:50 — W29 document system: page 27-document-system 259:508; MarkdownPage set 261:527 (numbered 72:1508 kept + plain 261:247, linkNotes bool, 4 instances re-pointed); DocumentHeader/DocumentIndex moved; DocumentLibrary 262:320 + DocumentView 262:1308; sheet/th · sheet/td added, sheet/h1–h3 → bold; Code Connect published; vite 5365 killed.
- 17:05 — W30 ink-roles: collection 265:87 (8 role modes) + `ink` 265:88; 1,206 nodes rebound with explicit role modes (7 mixed-role texts split ink + fg step), 0 RGBA mismatches, 8 color/ink/* removed.
- 17:23 W31 sync: icons more-vertical 271:91 + calendar 271:95 on 07-icons (oq-96, Code Connect).
- 17:23 W31 Menu* on 04: MenuRow 273:323 · MenuLabel 273:324 · MenuDivider 273:326 · MenuPanel 273:329 (rows slot) · MenuFlyout 273:445 · MenuTrigger 273:498 · MenuFilter 273:684 · MenuDatePicker 273:807 · MenuMore 273:912; MenuItem 22:60 marked deprecated → MenuRow.
- 17:23 W31 Dropdown 9:63 + variant=raised (273:11908/11916/11924); Modal 10:38 + variant lift|bordered; Button/bare 273:11932 (separate component); TabsRow chip hover skipped (set models no states). Code Connect published (541).
- 18:36 — kol-goal started (his "go!"): T1 NavRail variant="top" (replaces Atlas's Lab bar), T2 Figma gaps (chip hover, Button xs, MenuLabel tracking, Screen size icon), T3 MarkdownPage inline spans + h2 colour, T4 /work heading fit.
- 18:47 — T1 done: NavRail variant="top" (kol-component 0.328.0, Figma set 277:527 side|top, Lab bar replaced in page-layout--document, _Lab bar/180 to _trash, Code Connect live).
- 18:56 — T2–T4 done (W32): TabsRow state rest|hover; Button size=xs 279:316 + MenuFilter Active section; MenuLabel helper/12-upper-menu 0.3; Screen size → identity monitor 39:42; MarkdownPage inline links/refs/code/bold + sheet/accent 280:553; /work heading balance at 960. Code Connect published.
- 18:57 — T2–T4 done (W32): TabsRow state hover, Button size=xs + MenuFilter Active ×, MenuLabel 0.3 tracking, Screen size → monitor; MarkdownPage spans (links, refs, code, bold) + sheet/accent h2/bullet colour; /work heading = sans/heading-01 at 960 with balance wrap (browser 2 lines). Goal done.
- 19:54 OriginPicker set 283:1047 on 03-atoms (33 variants: size×value rest + hover/focus at center); Code Connect uploaded.
- 2026-11-03 17:46 — round-2 6.1+6.2: ShellHeader, ShellSidebar, RightRail, ShellNavColumn drawn from live workshop /docs at 1440 (boxes exact), carded, Code Connect published; ShellLayout 63:283 takes header/leftRail/rightRail swaps + page slot.
- 18:01 6.3 partial: workshop on ShellLayout, site-hub + brand-hub desktop on SiteLayout (NavRail variant=site + NavRail/row); rest left, listed in plan
- 18:40 W1 round 3: AppFloatNav shape=bar 385:11078; SiteLayout/AppShell/AppStudio phone variants (sets 385:12042 · 385:21254 · 385:22475); 8 Apps phone screens rebuilt as instances; article + brand-lab left (W5, W4).
- 19:01 W2 2.1 round 3: AppStudio 385:22475 regions (rail · masthead slot · page slot · floatNav · settings scrim+HubSettingsRail on top), HubSettingsRail set 395:20610 carded 398:11362; studio-hub desktop 4 screens + phone settings rebuilt as instances; AppFloatNav dock = one 306 pill, pill slot ink → surface/on-primary.
- 19:15 W3 3.1 document screens = SiteLayout instances (desktop 404:26206, phone 390:10329); SiteLayout header swap + showHeader; DocumentHeader TabsRow fills; MarkdownPage names + 724 caps
- 19:42 W4 4.1 round 3: PageShell → set 413:11647 (desktop 27:2 · phone 413:11645, page slot, gutter on pad-section/x), carded 424:11539; brand-lab 4 screens + 8 generators sheets = PageShell instances (lab parts in the slot); captures + labtools sheets on _trash; lab masters follow the theme, TabsRow text gets tab4.
- 20:16 W5 5.1+5.2 round 3: WebsiteNavbar 433:11574 · TakeoverMenu 433:11643 · WebsiteFooter 433:11585 (desktop/phone) · AuthorLine 435:11722 carded, Code Connect; WebsiteLayout → set 439:22687 (navbar/page/footer, phone 390); 6 kolkrabbi.io screens = WebsiteLayout instances (sections without a part = labelled placeholders), 6 article compositions wrapped, monitor phone → 390; captures on _trash.
- 20:48 W6 6.1+6.2 round 3: RightRail → set 449:11817 (variant page 370:10169 · index 449:11746 = live /docs rail row for row), /docs screen 376:9688 on index; new PageHero 456:11766 · PageSection 456:11774 · PageHeader 456:11783 · Contents/row 456:11759 · BrandBook 458:11934 · BrandAssets 459:13595, Brand 27:42 → set 460:13908 (view × variant), all carded + Code Connect; brand-hub 6 screens' page slots = Brand / PageHeader+SettingsRow instances, old content on _trash.
- 21:20 W5 5.2 round 3 finish: SectionHero 472:15141 · SectionSplit 472:15120 · SectionCards 472:15087 · SectionCardItem 471:14994 · SectionCta 471:15015 · SectionNewsletter 471:15049 · ParallaxShelf 472:15186 · WorkViewToggle 471:14979 carded + Code Connect; WebsiteNavbar tools slot; website screens' KOL placeholders replaced (/work = shelf view); stand-in overlaps on / (390) left
- 22:42 round 4 started under /kol-goal: plan-2026-11-03-figma-round-4.md (W1 brand pages · W2 brand-lab · W3 kolkrabbi.io · W4 small gaps)
- 23:24 W1 1.1+1.2 round 4: BrandBook 458:11934 + BrandAssets 459:13595 drawn to the end (About · Tone · The mark · Marks and lockups · Palette · Type; Branded assets · Stationery · Post sizes) at 1440/390 = live docH within 1.5px; 9 mock masters (BusinessCardFront/Back · Envelope · Letterhead · LetterheadCorrespondence · EmailSignature · PostPhoto · PostEditorial · StoryPhoto) carded + Code Connect; AssetCard 26:51 rebuilt with a slot
- 23:26 3.3 round 4: / (390) SectionSplit + SectionNewsletter pinned to live 845.6 / 420; 0 overlaps on the six website screens
- 23:49 W2 2.1+2.2 round 4: CodeBlock set 514:18900 (size × bare, card 516:19306, Code Connect) + brand-*.css blocks on the color/type/combo sheets (1786 · 6049 · 1576 vs live 1785 · 6046 · 1575); combo/logo screens 521:17389 · 521:18075 (1440) and 521:17689 · 521:18408 (390) in 315:409; AssetCard re-carded 516:19390
- 00:14 W3 3.1+3.2 round 4: /work · list view 534:16287 (1440) · 534:17404 (390) = WebsiteLayout instances, 26 rows on live tops, heights 6478 / 6117 = docH; ContentRow → set 529:18982 (variant article|work × breakpoint) + Code Connect; ContentFilters LIST/GRID strip + title pad; feature + foundry cards swap dark/light images on theme/is-dark · theme/is-light booleans; 0 overlaps on 8 website screens
- 00:32 W4 round 4: Avatar size=xs 537:19063 (no missing font, scan 5/5 RG Regular), ToggleSwitch labelled=false 30×12 541:18947/541:18951, AppFloatNav glass slot inks → surface/on-primary (134 paints, 0 raw), studio-hub 8 stages = live GrowthLineStage capture masked on surface/on-primary; cards 545:18947 · 545:18997, Code Connect published
- 08:06 W7.4 corner-audit sync: 122 masters on Icon masters redrawn in place (IDs kept, oq/96, 1.5); 33 added (29 singles 619:90–619:178, sets crown-royal 619:194 · bars-baseline 619:184 · bars-descending 619:190), 33 tiles on Icons; Code Connect 32 published; 12 align-* files still point at variants (sets 607:87–607:92)

# Plan — the KOL Figma library

**Raised:** 2026-10-31, the user. Points verbatim: *"I wanna create a figma mirror to the DS … tokens color, opacity, spacing, text … then we set up a styleguide and at least the control atoms and some molecules and maybe a few modals and organisms"*; *"can you use another Grotesk and I switch? use the google schibsted grotesk?"*; *"just start with the styles, then I review? because we definitely dont need all of it. some are never used, and we just need relevant stuff in the figma mirror"*; *"you dont go until its approved"*; W1 approved, then *"go! do everything, dont stop after import ill review when ur done"*.
**File:** https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH (`❖ library — kol-ds-ui`). On 2026-10-31 it held only Cover · overview · 01-page, all empty.
**Status:** W1–W16, W18–W23 built 2026-10-31. Running: W17 (float + glass in Figma). Open for him: 1.4 style review, 19.4 PP Right Grotesk, the library publish. Pages: see "Pages".
**Shape:** W › phase › list.
**Laws carried:** kol-theme CSS is the only source, and values flow from code into Figma, never back (ARCHITECTURE §2). Figma names are the CSS and prop names (`--kol-*`, `variant`, `tone`, `size`). Icons take `oq-*`, never `fg-*`. Nothing gets a border the code doesn't draw. Light and dark are modes, never copies. Every page's canvas is #1E1E1E (his word, 2026-10-31).
**How a phase closes:** measurable acceptance line first, gates green, then a side-by-side check: a Figma screenshot against a Playwright screenshot of the same thing in the showcase, in both themes.

---

## W1 — Styles (built first, then his review)

### 1.0 — Only what the code uses (cause: kol-theme defines more than the code reads) — ✅ built 2026-10-31
- A token is **used** if some `var(--kol-…)` in `packages/*/src` or kol-theme's component CSS reads it. A type role is used if its class appears in JSX. Only used tokens and roles go to Figma.
- The ones left out are listed in `_tmp/figma/unused.md` with their file and line, so he can pull any back in during the review.
- **Acceptance:** every variable and style in the file has ≥1 reference in the scan, and the used and unused lists together add up to every `--kol-*` property kol-theme defines.

### 1.1 — The sync script (cause: values copied by hand drift) — ✅ built 2026-10-31
- `scripts/figma-tokens.mjs` loads kol-theme.css in headless Chromium (no server needed), reads each used token's computed value under `data-theme="light"` and `"dark"`, and writes `_tmp/figma/tokens.json`.
- The agent applies that JSON with `use_figma`. Re-running it updates existing variables in place, matched by name, and never makes duplicates.
- **Acceptance:** after a run, the diff of the JSON against the file's variables reads 0 missing · 0 mismatched · 0 extra. A second run changes 0 variables.

### 1.2 — Collections — ✅ built 2026-10-31: 122 variables (color 73 · spacing 19 · type 13 · size 11 · radius 5 · opacity 1), 13 aliases, 3 effect styles. Plus `tone/border` (`--kol-tone-border`, transparent; each tone sets it in kol-components-molecules.css rather than the token files, so the script doesn't read it). It binds every control's 1px border; added after he flagged the raw 0% strokes. `--kol-link*` is `currentColor` in the code, so it has no fixed value and stays out.
- `color` (Light · Dark), one variable per used stop. A ladder is one category: text, bg and border are three ways the CSS applies the same stop, not three variables. Categories:
  - the ink ladders: `fg` · `fg-inverse` · `fg-ab` and `oq` · `oq-inverse` · `oq-ab`. The `-absolute` ladders and `fg-ab-inverse` / `oq-ab-inverse` have 0 uses, so they stay out.
  - the ink roles (`--kol-fg-body` · `meta` · `lede` · `strong` …), as aliases of their `fg` stop
  - surface, including tertiary; palette; accent · link · focus · border · base colors
- `spacing` · `pad` · `radius` · `size` (`ctl`, 22 · 26 · 32 · 40) · rail and content widths, single-mode.
- Effect styles: the used shadows, including `--kol-shadow-float`.
- Left out, because Figma has nothing to attach them to: z-index, transitions and easing.
- **Acceptance:** each collection's variable count equals the used count the script read for it, with 0 hard-coded hex values. Each ink role resolves to its `fg` stop, not to a copied value.

### 1.2b — Glass and blur — superseded by W16 (his ruling 2026-10-31: both glass styles accepted)
- The glass surfaces (solid · glass-dark · glass-light) exist only on the round-3 float artifact, waiting on his ruling. The code has no glass token: just three one-off blurs (2px in foundry, 4px in atoms, `backdrop-blur-xl` on the overlay glass panel).
- They come into Figma as effect styles once he rules on round 3. Until then they are left out.

### 1.3 — Text styles — ✅ built 2026-10-31: 51 styles (mono · helper · sans · prose · doc · card)
- One style per used type role, in JetBrains Mono and Public Sans, with size, line-height and tracking read from the computed CSS.
- **Doc and card roles:** text styles under `doc/` (eyebrow, heading, section-title, lede, body, caption, code, code-inline, footer) and `card/` (title, kicker, meta, excerpt, value, tag), from kol-type-roles. Their ink is not part of a text style; it's set by binding an ink role variable on the text.
- **Prose is a set:** text styles grouped under `prose/` — h1–h6, p, li, code, blockquote, and the label · display · title · lede · tagline classes, each carried from `.kol-prose` in kol-typography. The spacing between them can't live in a text style; it goes into a Prose component built from those styles in W3.
- Roles set in Right Grotesk use **Schibsted Grotesk**. **Changed while building, for his review:** instead of a `grotesk/` name prefix, every text style's family is bound to a `font/*` variable (`font/sans` · `sans-narrow` · `sans-compact` · `sans-tight`), so he switches the font by changing four variable values and every style follows. Schibsted has no Light cut, so `prose/p` and `prose/li` (300 in the code) use Regular, as their descriptions say.
- **Acceptance:** each role's text, rendered in Figma and on the showcase's typography page, measures the same line box within 1px. The Grotesk roles are checked on line height only, because the stand-in font has different widths.

### 1.4 — His review — TALK
- He reviews the variables and styles in Figma and cuts or adds. W2 starts only after he rules.

## W2 — Control atoms

### 2.1 — Which atoms — built as proposed, for his review
- Button · Input · Dropdown · ToggleSwitch · Slider · TabsRow · Tag, chosen for him under *"do everything"*.

### 2.2 — Build them — ✅ built 2026-10-31
- Measured from the live components (each variant rendered through the showcase and read with getComputedStyle in both themes) and rebuilt from that, so sizes match the code. 49 variants across 7 sets.
- Component sets with variant properties that use the prop names and values from source. Auto-layout throughout; widths are fill or hug wherever the code is.
- **Acceptance:** 0 unbound fills, strokes, gaps, paddings or radii. Each variant's height equals the code's size step. Every variant property name appears in the component's JSX props.
- **Result:** fills, strokes and radii: 0 unbound. Heights 26 / 32 / 40 for sm / md / lg. Not met: paddings of 2 · 6 · 10 and gaps of 2 · 4 · 6 stay raw, because the code uses those values with no token behind them (`--kol-spacing-*` has no 6 or 10). 21 texts carry weights or sizes outside the text styles (inverted Button 500, ToggleSwitch 13px, Tag, Modal OK, the search modal's eyebrows); their family is still bound to `font/*`.

## W3 — Molecules, modals, organisms — built for his review
- Chosen for him under *"do everything"*: **Prose** (the `.kol-prose` set, gaps carried as spacers), **Modal** (`useModal` confirm · prompt, as the `dialog` property), and **CommandOverlay** (the ⌘K search modal, panel only). Then, after he pointed out the gap (*"where are the other parts?!"*): **SettingsRow**, **Rail** (right, 380, RailHeader + three rows, push mode), and the organisms **NavRail** (app, closed) and **SectionText** (level page, standing in for PageHeader, which is its deprecated alias). All on `03-molecules`, all added to the styleguide.

## W4 — Styleguide

### 4.1 — Styleguide page — ✅ built 2026-10-31
- The styles (swatches, opacity ladders, type roles, sizes, radius, shadows) and every component from W2 and W3, as instances. Every value is bound to a variable. Built once; Dark is the frame's mode switch.
- **Acceptance:** 0 unbound fills and 0 unbound text styles (`use_figma` audit); every component in the file appears on the page as an instance; switching the frame to Dark changes everything with no second copy.
- **Result:** one frame, `Styleguide`, set to Light. It holds every variable as a swatch or bar, every text style and every shadow, plus 49 instances (every variant of every set). Switched to Dark and checked by screenshot, then set back to Light.

---

## W5 — Code Connect — ✅ built 2026-10-31
- One template file per component in `figma/` (14, React label, `@figma/code-connect` 2.1.0 templates — the parser route is unmaintained). Each maps the Figma variant properties to the props and imports from `@kolkrabbi/kol-component`. Republish with `pnpm figma:connect`; the token is `FIGMA_ACCESS_TOKEN` in the gitignored `.env` and in `~/.secrets` (scopes file_content:read + file_code_connect:write, expires 2027-01-29).
- Verified: the Button set returns `<Button tone="…" size="…">Button</Button>` with its import for all 15 variants.

## W6 — The rest, picked from usage — 2026-10-31
His points: *"I feel like you could have created more styleguide components? f.e. this set https://ui.kolkrabbi.io/sets/styleguide — it even comes with prose setup"*; *"where are f.e. the table? and where are most frequently used components and where are the organisms?!"* (brand-hub, brand-lab).

### 6.1 — Most used, not yet built (cause: W2/W3 were picked by hand, not from `usage-index.json`) — ✅ built 2026-10-31
- Each rendered through its own `showcase/src/previews/<Name>.jsx` (its `variants` / `sizes` exports), measured in light and dark, rebuilt bound to variables.
- **02-atoms:** Divider (2) · ToggleCheckbox (default, media) · Pill (9; the deprecated `outline` / `subtle` aliases not drawn) · Avatar (4) · Badge (28) · Textarea (8) · ViewToggle (text sm/md, icon, single — the preview draws icon and single at one size) · SegmentedToggle (12).
- **03-molecules:** Section (InspectorSection) · LabeledControl (default, panel) · ColorSwatch (default/halo × 24/32) · MenuItem (the open panel; the trigger is a Button).
- **06-organisms:** Table (default, simple).
- **DashMetricCard · DashChartCard · DashListCard — dropped, being rebuilt (his word, 2026-10-31).** Built, then removed by ID; no Code Connect.
- **Not built:** Tooltip (a hover popover; nothing renders until hovered) · GridCard (a grid-span wrapper with no visual of its own) · Icon (1,072 uses — glyphs stay as measured vectors inside each component; icon sets are a separate decision).
- New variables: `ui/success · warning · error · info` and their `-tint` (Badge's status colours; the code mixes `--ui-*` 15% into surface-primary, no token of its own).
- **Result:** heights match the measured code (Badge 16/20/24/28, Textarea 46/58/68/84, SegmentedToggle 22/26/32/40, Pill 16/22/28). Fixed on the way: ToggleSwitch variants now hug their label (they were pinned at the measured width and clipped a longer label).

### 6.2 — The styleguide set (kol-styleguide, `/sets/styleguide`) — ✅ built 2026-10-31
- **05-styleguide-set:** ColorRamp (one ramp; the set stacks several) · ColorAnatomy · Swatch · TypeSample · TypeSpecCard · TypeBlock · ProsePreview (the whole `.kol-prose` voice set, lists numbered) · MoodTile · AssetCard · LogoCard (its toggle is a ToggleSwitch instance).
- Images are `oq/08` placeholders named `image` — the plugin cannot place images (`createImageAsync` unsupported). The fixture wordmark "KOL" is set in the sans stand-in. Chip colours in ColorRamp, ColorAnatomy, Swatch, ColorSwatch and Table samples are preview data, left raw on purpose.
- **Not built:** LogoScaling — it renders inside a transform-scaled 1600×1000 stage; nothing in it is a component-sized shape.

### 6.3 — Organisms from brand-hub and brand-lab — ✅ built 2026-10-31
- **06-organisms:** PageShell · SettingsSections (Dropdown and ToggleSwitch instances) · Brand — the first screen as apps/brand-hub runs it (site rail, the Brand / Assets switch as Button instances, the hero).
- **Not built:** the rest of the Brand book (5,569px, 583 nodes: nine sections of ColorRamp, type specimens, assets — its parts are the 6.2 set) · BrandGuide (no preview; it only renders inside brand-hub's router).

### 6.4 — Styleguide, Code Connect, audit — ✅ 2026-10-31
- Every 6.1–6.3 set added as instances to the Components section of both `Styleguide: light` and his `Styleguide: dark` (92 instances each); dark checked by screenshot.
- 26 more Code Connect templates in `figma/` (TypeSample and TypeSpecCard import from kol-foundry), published.
- **Audit (W6 sets, instances excluded):** strokes 0 unbound · fills 26 unbound, all preview-data chips · radii 3 (code's own 3px) · paddings of 1 · 2 · 6 · 10 · 40 · 128 and gaps of 2 · 4 · 6 · 40 stay raw (no token in the code) · 110 texts carry weights or sizes outside the text styles, family still bound to `font/*`.

## W7 — Icon sets — approved 2026-10-31 — ✅ built 2026-10-31
- **07-icons** (canvas #1E1E1E), one section per set, one 24×24 component per icon named by its code name, made with `createNodeFromSvg` from `packages/icons/src`. Every stroke and fill is bound to `oq/96`. The description carries the set, the folder and `<Icon name="…" />`.
- **Counts:** interface 263 · signal 109 · identity 10 · external 59 (441, 0 errors). Identity holds only the files whose name matches their folder. No signal name collides with interface.
- **Added 2026-10-31 (his "yes"):**
  - `external` section: flags (39) on the first rows, then brands (20).
  - These are colour marks, so they keep the SVG's own fills. The exceptions are apple, github, openai and windows, which use currentColor and are bound to `oq/96`.
  - laptop, laptop-solid and vr-headset joined interface/device, bound to `oq/96`.
  - Sent through `upload_assets`: multipart upload of the raw files, so the filename becomes the layer name, then componentised. That is lossless, and safari (36KB) went in whole. Checked by screenshot.
- **Swapped for instances (38),** each at its old size and on the colour variable it had before:
  - Dropdown chevron-down ×6
  - CommandOverlay search + corner-down-left
  - NavRail desktop · layers · grid · book-open · refresh
  - Rail chevron-down
  - Textarea resize-grip ×8
  - ViewToggle grid · view-list
  - MenuItem file · save · download · trash
  - Brand sidenav ×10
  - SettingsSections follows through its Dropdown instances.
- **Not swapped:** the ToggleCheckbox tick, which is a hand-drawn 12×9 svg in the code and not a set icon. The ColorSwatch slash is not an icon.
- **Code Connect for `Icon` — not done.** A template maps one node, so covering 379 single components would take 379 templates. The cheap route is a `name` variant set, which these components are not. This supersedes the 6.1 note that "glyphs stay as measured vectors".
- **Payloads:** `_tmp/figma/icons/` (`icons.json` and the `c00–c08` chunks). Paths are rounded to 2 decimals and the clip wrappers are stripped.

## W8 — KeylineGuide — ✅ built 2026-10-31 (his go)
- `KeylineGuide` on 07-icons (43:107), variants `light=true|false`, drawn from kol-component's `KeylineGuide` SVG (atoms/IconPlate.jsx): dashed diagonals, keyline rects 16×20 · 18×18 · 20×16, centre circle r4. Its colours are literal in the code (#0A8DA4, #CA3ABC, #F2D24B), so they stay raw. Built here instead of linking library--kol-icon's `_icon-grid`, which comes from the old drawing. Code Connect: an `IconPlate … guide` snippet.

## W9 — Primitives — ✅ built 2026-10-31, the code route (his go: "do all of it")
- **Code:** kol-theme 0.202.0 — the twelve surface greys defined once as `--kol-neutral-<HSL lightness ×10>`; every `--kol-surface-*` reads a neutral or a pole. 248 colour props measured identical before/after in light · dark · os-dark · os-light.
- **Figma:** `primitives` collection (12 `neutral/*`, hidden from pickers, code syntax `var(--kol-neutral-…)`). The 8 used surfaces alias a neutral or a `color/*` pole per mode; resolved values checked equal to the old ones (0 mismatches). Ladders stay resolved (a Figma alias cannot change alpha). Known limit: `scripts/figma-tokens.mjs` records an alias from the light block only, so a re-sync must keep the per-mode aliases (they come from `_tmp/figma/primitives.json`).

### W9 as first written — superseded
- Asked for: a `primitives` collection with the base colours, the ladders and surfaces aliasing it "the way the CSS does".
- **Finding:** the CSS has no such layer. `--kol-surface-primary: #fafafa` and `--kol-surface-on-primary: #121215` are raw hex per theme (kol-base-tokens.css, redefined for dark), and the ladders are `color-mix(#121215 64%, transparent)`. A Figma alias cannot change alpha, so a ladder can never alias a primitive. The 13 `var()` chains the CSS does have are already aliases in Figma.
- So a primitives collection in Figma would be a layer the code does not have, against the law that kol-theme is the only source. The real version is a kol-theme change: define the bases once and build the surfaces and ladders from them. That is his call, and it would publish a theme release.
- **Acceptance (if he takes the code route):** every surface and accent in kol-theme reads a `--kol-base-*` var, and the Figma sync turns those into aliases with 0 raw solid hexes outside `primitives`.

## W10 — Article set, apps, layouts — 2026-10-31 (his go: "go! do all of it")
- **Pipeline:**
  - Measured from the running code (showcase previews, apps/layouts, apps/hub, apps/studio on task ports, killed after).
  - The converter now:
    - places library parts as INSTANCES (Button, Input, Dropdown, ToggleSwitch, Tag, Pill, Avatar, Badge, SegmentedToggle, NavRail…), picking the variant from the code's classes and measured size;
    - keeps absolute layers absolute;
    - turns inline runs into one text;
    - lays CSS grids out as wrapping rows.
  - Icon-only buttons stay frames, because the Button set has no icon kind.
- **T3 Article — ✅:**
  - On 05:
    - ArticleHeader `heroImage=true|false` (53:285): the code's only switch, its optional hero block. Heights 789/404 = measured.
    - StackHero `variant=default|tall` (52:334).
    - ContentCard `variant=article, hero=true|false` (52:308).
    - ContentRow `variant=article` (52:309).
    - PortableTextRenderer (57:232). Code lines are one text, so the syntax colours are not carried.
    - ContentCollection `form=grid` (57:259). fluid and cols measure the same at the preview width.
  - On 04: ShareButtons (54:302: the code's outline tone is missing from the Button set, nearest size used), SourcesReferences (54:330), StickyNavCard (54:355).
  - New page `　　↳　11-article` (57:342, #1E1E1E): "Article — heroImage=true|false" (57:343, 57:579), composed from instances in stack-blog's order.
  - **Skipped:**
    - AuthorLine: its preview stacks three, and it sits inside ArticleHeader.
    - ContentCard's other five variants: not part of the article.
- **T5 Rails, layouts, hubs — ✅:**
  - Rail `role=patch|page|settings|bottom` (54:301) on 04. The rows are ToggleSwitch/Dropdown instances; settings' scrim belongs to the page.
  - The old W3 push-mode Rail (14:9) is left as built.
  - On 05, the first screen at 1440×900 as apps/layouts runs each, page slot filled:
    - SiteLayout 60:240 (SiteHero)
    - AppShell 61:240 (NavRail instance + HubHome; the + is a frame because there is no icon Button)
    - ShellLayout 63:283 (DocumentationReader clipped at the fold; RightRail link glyphs omitted)
    - WebsiteLayout 59:240 (StackHero)
  - AppHub 64:674 `page=home|settings`: an AppShell instance, plus the settings Rail instance over a 48% scrim.
  - AppStudio 64:284.
- **T4 apps — built by fork 1, handed to fork 2:** first screens, 1440×900, clipped.
  - 08: / (Brand 27:42 instance) 66:241 · /assets 66:348 · /settings 66:135.
  - 09: #color 66:493 · #type 67:100.
  - 10: Home (signed out) 69:87 · Sign in over Home 69:130 · Settings 69:189 · Settings·Shortcuts 69:340.
  - Gradients, the colour picker and glyph-only buttons are named placeholders.
- **T6 research set:** handed to fork 2 (measured only: `_tmp/figma/w10-md.json`, `w10-doc.json`).
- **Styleguide:** the 16 new sets (23 instances) are on both `Styleguide: light` and `Styleguide: dark`.
- **Code Connect:** 16 new templates (ArticleHeader, StackHero, ContentCard, ContentRow, PortableTextRenderer, ContentCollection, ShareButtons, SourcesReferences, StickyNavCard, RailRole, SiteLayout, WebsiteLayout, AppShell, ShellLayout, AppStudio, AppHub). 59 published, 0 errors.
- **Audit (W10 nodes, instances excluded, 984 nodes):**
  - Fills: 2 unbound, both literal in the code (`.kol-site-hero-overlay`, the 48% `kol-overlay-scrim`).
  - Strokes: 0 unbound.
  - Text: 132 nodes carry sizes/weights outside the text styles; the family is still bound to `font/*`.
- The builder that sat in the file's shared plugin data during the build (`kolfig`) has been deleted.

## W11 — kol-atlas's requests — ✅ built 2026-10-31
- **TableCell** (49:188, kind th|td × position first|middle|last × variant default|simple × iconSize 14|16; `label` TEXT, `icon` BOOLEAN + `iconName` INSTANCE_SWAP) and **TableRow** (49:277, kind head|body × variant; cells FILL) on 05-organisms; **Table** (23:60) rebuilt in place from row instances, the last body row without its rule as in the code.
- Text styles `table/cell-title` (12/15.6, `.kol-table-cell-title` 1.3) and `table/cell-text` (12/16.8, 1.4): rows are 40 / 41, the browser's height.
- **Dropdown** (9:63): `btn` and `dd-label` FILL, the label truncates; an instance at 180 gives a 180 button. Default width now hugs the label (97 / 114 / 132), where the code reserves the widest option (101 / 118 / 136).
- kol-atlas told; the Figma library publish is his click.

## W12 — Breakpoints — approved 2026-10-31 ("ok")
His point: *"are we accounting for breakpoints?"* — no: everything was built at `lg+`. The law is `08-breakpoints/04-kol-ds-rules.md`; the values `08-breakpoints/01-values.md`.

### 12.1 — Breakpoint collection (cause: the values that change with width live only in media queries) — ✅ built 2026-10-31
- Result: `breakpoint` (Phone · Tablet · Desktop) with `pad-section/x` · `pad-section/y` · `grid/cards` · `grid/masonry`; `size/bp/sm…2xl`. Browser at 375 / 800 / 1280 read 20·48 / 32·64 / 48·80 = the mode values; a probe frame's bound padding read 20 / 32 / 48 as its mode switched. The column counts are reference values — Figma cannot bind a column count.
- New collection `breakpoint`, modes **Phone** (< 640) · **Tablet** (768–1023) · **Desktop** (≥ 1024): `pad-section/x` 20 · 32 · 48 and `pad-section/y` 48 · 64 · 80 (kol-framework.css `--kol-pad-section-*`), `grid/cards` 1 · 2 · 3, `grid/masonry` 1 · 2 · 3. sm (640–767) takes Tablet's columns with Phone's padding in the code; it is not a mode of its own (noted on the variables).
- The five widths as `size/bp-*`: sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536.
- **Acceptance:** each variable's three mode values equal the CSS at 375 / 800 / 1280 measured in the browser; switching a frame's mode changes its padding with no other edit.

### 12.2 — Phone frames for the layouts and app pages (cause: chrome changes below `lg`) — ✅ built 2026-10-31 (results under W10 and W13)
- Beside each W10 layout and app page, a 375-wide frame in the Phone mode: NavDrawer / PhoneNav (AppFloatNav `mobile`) in place of the rails, grids at one column.
- Runs after the W10 build (one writer in the file).
- **Acceptance:** every layout and app page has a Phone frame; no rail is visible in it; its section padding reads `pad-section/x` = 20.
- **Result (fork 1: layouts, hubs, article) — ✅ 2026-10-31:**
  - Phone frames sit beside each component on 05, measured at 375×812 from the running code, with the explicit `breakpoint` mode set to Phone:
    - SiteLayout 72:654: the site rail off-canvas, NavDrawer trigger at top right.
    - AppShell 72:666 and AppHub 72:734: the AppFloatNav pill. That is the Hub's `touch` preset; AppShell's own default `touch="shell"` keeps the rail, so the frame shows the Hub's.
    - ShellLayout 72:802: header only, no rails.
    - WebsiteLayout 72:844: top bar and takeover button.
    - AppStudio 72:860.
    - "Article — Phone" 72:1281 on 11-article: instances, cards in one column.
  - No rail is visible in any of them. Every `page · pad-section` frame reads 20 through `pad-section/x`.
  - Only the article binds `pad-section/y` (48). The shell pages measure 20 on every side, so their y padding is left raw rather than forced to 48.
  - Desktop: AppShell, ShellLayout, AppStudio and both article frames have the Desktop mode set and `pad-section/x` bound (they read 48). SiteLayout and WebsiteLayout pages are full-bleed, with no page padding to bind.
  - Phone frames for 08/09/10 and 12-document belong to fork 2.

## W13 — Document set + Phone frames for the app pages — ✅ built 2026-10-31 (second build)
- **12-document** (new page under ➤ applications, canvas #1E1E1E): `MarkdownPage` (72:1508) — the first screens of the Atlas project document on `.kol-sheet`, numbers in a 64 gutter, task bodies at 70 % ink; `LinkPreview` (72:1561); the composed page **Document — /project** (73:87): site sidenav (icons are 07-icons instances), header with underline tabs + menus, a MarkdownPage instance held to the 724 measure.
- **sheet/** text styles (8): h1 · h2 · h3 (Grotesk stand-in, bold) · h4 · body · body-sm · meta · footnote (Public Sans), from the measured `.kol-sheet`.
- **Phone frames (W12.2)**, each 160 below its desktop frame, `breakpoint` mode Phone: brand-hub `/` · `/assets` · `/settings` (burger bar in place of the site rail, one column, heads at the 375 sizes measured: 56 / 44, ledes 24 / 22, cards stacked full width); brand-lab `#color` · `#type` (header stacks, the lab rail over the stage); studio-hub Home · Sign in · Settings · Shortcuts (mark 48 at 16·24, + at 319·24, dock centred at y 740 — measured; sign-in is AccountForm `variant="box"` centred, inset 16, because the column is `max-md:hidden`; the settings Rail is full width, `max-w-full`); Document. Page padding binds `pad-section/x` = 20 everywhere except studio-hub, which the code keeps absolute ("the phone's values are not part of it").
- Code Connect: MarkdownPage, LinkPreview published. Both on both styleguide frames.
- **Not carried:** the sheet's inline link underlines, bold labels in the meta lines and superscript footnote refs (refs dropped from body text); the first build's T4 frames were kept as they were. 10 header/sidenav texts in the Document page have no text style (mono 500 caps, the sans display head); their family is bound.

## W14 — Helper atoms, Button variants, one Rail — approved 2026-10-31 ("Yes, all of it")
Cause: the bigger pieces used stand-ins because the helpers they render were never built.
### 14.1 — Helpers — ✅ built 2026-10-31
- Result on 03-atoms: IconFrame 78:166 (variant secondary·primary·outline·ghost × sm·md·lg) · IconPlate 78:177 (ground) · CloseButton 78:198 (xs–lg) · IconToggle 78:235 (pressed × xs·sm·md, unlock→lock) · Kbd 78:250 (size × icon) · Label 79:162 · SectionLabel 79:179 (sm·md·lg; the hover-twin glyph not drawn) · ProgressBar 79:200 (tone default·success·warning·error·info on ui/*) · SortHeader 79:213 (inactive · asc · desc). Every glyph is a 07-icons instance with an `icon` INSTANCE_SWAP property; sizes match the measured code (26/32/40 squares, kbd 16/20). Audit: 0 unbound fills or strokes; padding 6 raw (8×, no token).
- IconFrame · IconPlate · CloseButton · IconToggle · Kbd · Label · SectionLabel · ProgressBar · SortHeader on 03-atoms, measured from the code, prop-named variants, icons as 07-icons instances.
- **Acceptance:** each set's sizes match the measured code within 1px; 0 unbound fills/strokes.
### 14.2 — Button icon-only + outline — ✅ built 2026-10-31
- Result: Button 8:32 now 36 variants — the 15 keep their IDs (renamed `…, iconOnly=false`), + 18 `iconOnly=true` (six tones × three sizes, squares 26/32/40, `icon` INSTANCE_SWAP) + 3 `tone=outline` labelled (border oq/08). Code Connect emits `iconOnly="<swapped icon>"`. Not built: the `nav` and `tab` variants (the brand-lab header uses them) — the swapped buttons there are ghost with oq/64 ink.
- Button gains the code's `iconOnly` (square at each size) and `tone=outline` variants; the existing 15 keep their IDs.
- **Acceptance:** icon-only is 26/32/40 square; outline's border binds `oq/08`.
### 14.3 — Swap the stand-ins, one Rail — ✅ built 2026-10-31
- Result: 32 `icon-button (glyph placeholder)` frames on 09-brand-lab (desktop + Phone) → Button `ghost/sm/iconOnly` instances with the code's icons: Color Lab header gen-color · brightness · eye-on · undo · redo · copy · expand; Type Lab header undo · redo · copy · expand; each swatch's hex copy. The old Rail 14:9 had no instances left (the styleguides already use 54:301); moved to the `_retired` section (80:6091) on 04-molecules, not deleted. Left: gradient/picker/stage/image placeholders (the plugin can't draw them); the codeblock's `action-glyph` (57:245); on dark swatches the copy ink is oq/64 where the code's Glyph follows the swatch ink.
- Every frame/placeholder standing in for one of these becomes an instance; the old push-mode Rail (14:9) is retired — its styleguide instances swap to the Rail role set (54:301) and the component moves to a `_retired` section on 04-molecules, not deleted.
- **Acceptance:** 0 stand-in frames left for these components (named list in the plan); one Rail component set in use.

### 14.4 — Button's remaining variants — ✅ built 2026-10-31 (his yes: "all five")
- Button (8:32) 36 → 57: new properties `variant` (default · nav · tab · tab-filled · accent · danger) and `pressed` (tab / tab-filled both states), sm · md · lg; the 36 existing kept their IDs as `variant=default, pressed=false`. Measured light + dark: nav ink oq/80 · accent accent/primary + on-primary (500) · danger ui/error (#DC2626 / #F87171, matched) + color/ab-white (500) · tab fg/48 → pressed oq/08 + on-primary · tab-filled oq/04 → pressed oq/16. No new variables. On both styleguide frames (21 each); Code Connect emits `variant="…"` (+ `pressed`). Open: the icon-only snippet prints `iconOnly="icon"` (the swap's layer name, not the icon's) — the mapping needs the icon component's name.

## W15 — Icon Code Connect — ✅ built 2026-10-31
- 440 templates in `figma/icons/` (one per icon component on 07-icons, id = the code name, `<Icon name="…" />`); config includes `icons/*.figma.js`. Fixes 14.2's open issue: Button's icon-only snippet reads the swapped icon's `codeConnectId()` instead of the slot's layer name (a layer name never follows a swap — tested). Proven with a sentinel fallback: the snippet printed the icon's name, not the fallback.

## W16 — Float style accepted, into the code — ✅ built + published 2026-10-31 (kol-theme 0.203.0 · kol-component 0.320.0 · kol-shell 0.92.0; 1944 checks vs round 3, 0 fails; FloatingStyleAndSignInDemos closed). Not done: HubHome takes no `surface` yet; no hover layer on pill slots.
His words: *"can we accept the style, both glass styles, dont care about other questions"*. Source: round 3, https://claude.ai/artifact/VMiZCd6QZm5PRaWc4Yy4yF (values as written there: mouse h 28/36/44 · text 12/13/14 · icon 18; touch h 36/44/52 · 13/15/16 · 20; menu r 26/30 inset 6 rows 40/48; nav bar 66 · buttons 56 · icons 28; tab bar 66 · item 58; tooltip float 24/28 pill inverted).
### 16.1 — Glass tokens (cause: glass lives only on an artifact)
- kol-theme: `--kol-glass-dark-*` / `--kol-glass-light-*` (fill, blur s/m, rim, shadow s/m) exactly as round 3; `prefers-reduced-transparency` falls back to solid.
- **Acceptance:** a probe element with each glass reads the round-3 computed `background`, `backdrop-filter` and `box-shadow`.
### 16.2 — `surface` on the float components; round-3 sizes
- `surface="solid|glass-dark|glass-light"` on AppFloatNav (all shapes), AccountForm box, Button/Input `variant="float"` where they sit on a float, plus the float Tooltip, SegmentedToggle and TabsRow from round 3; mouse vs touch sizes by `(pointer: coarse)`. glass-dark puts dark ink on what sits on it in either theme.
- **Acceptance:** Playwright on the showcase/studio-hub: each shape × surface measures round 3's sizes within 1px on mouse and touch; the provisional values are gone.
### 16.3 — Publish and close
- kol-theme / kol-component / kol-shell published; the showcase AppFloatNav page exists; FloatingStyleAndSignInDemos closed with its receipt.

## W17 — Float and glass in Figma — ✅ built 2026-10-31 (after W16)
### 17.1 — Glass as effect styles (cause: Figma has no glass until the tokens exist) — ✅ built 2026-10-31
- Result: effect styles `glass/dark-s|m`, `glass/light-s|m` (background blur + the rim as inner shadows + the outer shadow) and `color` variables `glass/dark`, `glass/light`, `float/well`; read back, every blur / offset / spread / alpha equals `kol-design-tokens.css`. The CSS `saturate(1.8)` has no Figma equivalent (noted on the variables).
- `glass/dark-s|m`, `glass/light-s|m` effect styles (background blur + rim inner shadows + outer shadow) and their fills as `color` variables, from W16's tokens.
- **Acceptance:** each effect's blur radius, shadow offsets/blur/alpha equal the W16 computed values exactly.
### 17.2 — Float variants and AppFloatNav — ✅ built 2026-10-31
- Result (measured live on /components/app-float-nav): **AppFloatNav** (99:1236, 05) variant mobile · dock · panel · transport + labels × surface, 15 variants at 320/306/418×66 = the code; **AccountForm** (99:1264, 05) box × surface 340×222; **MoreSheet** (99:1398, 04) float menu × surface 230×172; **Tooltip** (99:1592, 03) float pill 24; float variants added to Button (sm/md/lg 28/36/44), Input (md 36), TabsRow, SegmentedToggle (× surface; its other variants gained `surface=solid`). glass-dark variants sit in Dark mode; solid grounds carry `shadow/float`. Icons are 07-icons instances. On both styleguides (60 instances). Code Connect: AppFloatNav, AccountForm, MoreSheet, Tooltip new; Button / Input / TabsRow / SegmentedToggle emit `variant="float"` and `surface`. Audit: 0 unbound fills/strokes; 9 raw radii (menu 26, box 28 — `--kol-float-menu-r` has no Figma variable). Mouse sizes only; touch sizes are not drawn.
- Button / Input float variants; an AppFloatNav set (mobile · dock · panel · transport) × surface (solid · glass-dark · glass-light), mouse sizes.
- **Acceptance:** every variant's height and radius equal W16's measured code within 1px; 0 unbound fills/strokes.

## W18 — The UI font sheet in Figma — approved 2026-10-31 ("Yes, all three") — ✅ built 2026-10-31
- Result: collection `ui-font` (Inter · Geist · IBM Plex Sans · Public Sans · Noto Sans · Montserrat) with `ui-font/family`, `ui-font/w400…w800` (each family's own weight names — Inter "Semi Bold", the rest "SemiBold"; IBM Plex Sans has no 800, so w800 = Bold there) and `ui-font/specimen`. 37 text styles `ui/D1–L8`, family AND weight bound, so a mode switch never leaves a missing font. Page `13-ui-font` (87:87) after 02-styleguide, sheet 87:88 (mode Inter): header card with the four weight chips (font name and specimen link bound to the mode), column heads, six sections, 37 rows. Checked: all six modes render with 0 missing fonts. The sheet's colours are the canvas's literal ones (#2c3853 on white), not KOL variables — it is a specimen of that canvas.
His words: *"https://claude.ai/artifact/HQ8k3AtTt8QgP7sYvYbLXs should definitely go into figma"*.
### 18.1 — One sheet, six fonts by mode (cause: six copies of one sheet can't be compared in place)
- Collection `ui-font` (Inter · Geist · IBM Plex Sans · Public Sans · Noto Sans · Montserrat), STRING `ui-font/family`; text styles `ui/D1–3 · H1–6 · S1–6 · T1–6 · U1–8 · L1–8` bound to it; one sheet frame on `13-ui-font`.
- **Acceptance:** all 37 styles' size / line-height / tracking equal the canvas's `renderVals()`; switching the frame through 6 modes changes the family of 100% of its text layers.

## W19 — kol-atlas's second list (34 /lab views) — approved 2026-10-31 ("All of them")
### 19.1 — Content-sized components (cause: fixed sizes where the code sizes by content)
- Dropdown hugs its label + the 16px dd-label right inset; TableRow default hugs its cells; Pill hugs at every size; TabsRow height from content (code 40).
- **Acceptance:** each resized instance with a 3× longer label / a wrapped cell grows with 0 clipped text; heights at default content equal the code's within 1px.
### 19.2 — Missing variants and slots (cause: the sets carry fewer props than the code)
- Button `variant=nav` icon-only 26, `iconLeft` slot, `radius=full`; Pill `subtle` (fg/16); TabsRow icon slot + `mono-light` (Light 14/22.4); TableCell leading colour chip.
- **Acceptance:** every new property name exists in the component's JSX props; each variant's size equals the measured code within 1px.
### 19.3 — Missing components
- DocsToc rail (child ticks), QuickLookFrame (lab window shell), ColorPickerPopover (SV field, hue strip, hex input), list + list item (disc, number), ContentFilters header.
- **Acceptance:** each measured from the live code within 1px; on both styleguides; a Code Connect template each.
### 19.4 — PP Right Grotesk — TALK (his edit)
- Set `font/sans*` to "PP Right Grotesk" in the desktop app; the plugin cannot load local fonts.

## W20 — kol-atlas's third list (using the new parts) — approved 2026-10-31 ("All three", then "Yes, all seven") — ✅ built 2026-10-31
### 20.1 — Defects (cause: the build drifted from the code)
- Dropdown sizes to its WIDEST option, as the code does (every option is a `.kol-dd-ghost` inside `.kol-dd-label`): a hidden `widest` TEXT stacked with the label in a 1×1 grid at opacity 0. Button `variant=nav` iconOnly: the icon layer bound to the `icon` INSTANCE_SWAP.
- **Acceptance:** "Entries" with "Other definitions" among the options measures the code's 180 within 1px; setting `icon` on a nav icon-only instance changes its glyph (read back).
- Result: Dropdown 9:63 gains `widest` (TEXT, default "Option"): `dd-label` is a 1-column grid, label in row 1, `widest` in a 0-high row 2 at opacity 0 (Figma refuses two children in one cell). Measured code (probe20, port 5307): sm 180.4 / md 210.8 / lg 241.2 for Entries+Other definitions; Figma sm 181, Entries alone 109 vs 108.4, defaults unchanged (102/119/136). Button 8:32: the 6 nav icon-only variants' `icon` bound to the swap, and their ink fixed oq/48 → oq/80 (the code's nav ink); test instances swapped to `x` on all 84 icon-only variants, then removed.
### 20.2 — Composable parts (cause: samples that can't take a consumer's rows or content)
- `TocRow` (label TEXT, kind section · child · graduation, rule width) with DocsToc as a stack of them; `QuickLookHeader` (name / meta TEXT, nav and close BOOLEANs), QuickLookFrame kept as the sample.
- **Acceptance:** a DocsToc of 20 rows and a QuickLook with a consumer body are built from instances with 0 detaches.
- Result: **TocRow** 108:254 (04) `kind` section · child · graduation × `active` (5 variants), `label` TEXT; rules 8 / 22 (section), 5 / 12 (child), 5 (graduation) on fg/24 · fg/64 · fg/12; rest label opacity 0.26 (the code's 0.78 scale is not drawable); child label helper/10, absolute, opacity 0 (shows only under the lens). "Rule width" is not a property — Figma has no numeric one; it follows `active`, and the `rule` layer's width is overridable for a lens state. **DocsToc** 91:190 kept its ID: a `toc` SLOT of 15 TocRow instances (same 148 high). **QuickLookHeader** 108:363 (04): `name` / `meta` TEXT, `nav` / `close` BOOLEAN, ‹ › as Button nav sm instances, close as CloseButton sm; x positions equal the code's (nav 9, name 137, meta 246, close 605 incl. the 1px border). **QuickLookFrame** 91:224 kept its ID: QuickLookHeader instance + a `children` SLOT for the body. Test: a DocsToc instance with 20 rows and a QuickLook instance with a consumer rectangle, both still instances, then removed.
### 20.3 — Missing states and options (cause: fewer props than the code)
- Button `pressed` for iconOnly and nav (data-state on, the code's ground); ColorPickerPopover properties heading label|dropdown, hex size md|lg, lock BOOLEAN, alpha BOOLEAN, root can FILL; TabsRow `bare` (no 4px wrapper, 40 high as in ColorLab).
- **Acceptance:** each measured against the live code within 1px (ColorLab's inline picker at 347 wide; its tabs row 40).
- Result: Button 8:32 123 → 171: `pressed=true` for every icon-only (6 tones × 3 sizes × 2 radii) and nav (labelled + icon-only); measured light + dark: ground surface/on-primary + ink surface/primary, inverted unchanged (the code's pressed = rest), sunken = surface/sunken + fg/08 with fg/96 ink, outline keeps its oq/08 border. **ColorPickerPopover** 93:741: `title` TEXT, `modes` BOOLEAN (the head's Dropdown sm, HEX), `hexEnd` BOOLEAN (IconFrame ghost sm, lock, field ink), `alpha` BOOLEAN; every row FILLs, so the root resizes. Instance at 347 with ColorLab's props = 347 × 352, head 26, hex 40, square 200, lock at x 304 — all equal ColorLab live. Not built: `hex size md|lg` — the code's inline hex is always md; the 40 is the lock's 26 inside it, so `hexEnd` gives it. Names follow the code (`modes`, `hexEnd`, `title`), not "heading" / "lock". **TabsRow** 9:123 6 → 12: `bare` true|false (a variant — a BOOLEAN can't change padding): no 4px scroll padding, underline 40 high (ColorLab's tablist 40; its scroller is 48 with −4 margins); float 36. Also bound `label` on the sans / mono-light first tab (it was unbound).
- Styleguide: both frames gain 8 pressed Buttons, the widest Dropdown, a bare TabsRow, a TocRow section (5), a QuickLookHeader section, ColorLab's picker at 347. Code Connect: Button (`pressed` on icon-only), ColorPickerPopover (title · modes · hexEnd · alpha) updated; TocRow, QuickLookHeader added; published. Audit: 0 unbound fills/strokes on all eight sets except the picker's 2 literal gradients (as W19).

## W21 — kol-atlas's fourth list — approved 2026-10-31 ("1–3") — ✅ built 2026-10-31 (21.1, 21.2)
### 21.1 — Button states the code has (cause: the set still lacks props Button.jsx takes)
- `variant=tab` × iconOnly at sm/md/lg with `pressed` (ColorLab.jsx:526, 26px, active oq/08 in dark); `disabled` on every variant (LabWindow.jsx:121's undo/redo).
- **Acceptance:** each measured live within 1px; disabled ink equals the code's computed colour in light and dark.
- Result: Button 8:32 171 → 366. `variant=tab` iconOnly (114:337–114:381): sm/md/lg × pressed × radius, 26/32/40 as measured (probe21, port 5311), rest transparent + fg/48 ink, pressed oq/08 + surface/on-primary (light 0.908 / dark 0.143 grounds, ink 18/250 — the code's), icon layers bound to `icon`. New VARIANT `disabled` false|true on all 183: the code's disabled is `opacity: var(--kol-opacity-disabled)` (0.5) with the rest colours unchanged in both themes, so each disabled twin is its rest variant at opacity 0.5 bound to `opacity/disabled`; existing IDs kept (renamed `…, disabled=false`).
### 21.2 — QuickLookHeader actions (cause: QuickLookFrame.jsx takes `actions`, the component doesn't)
- An `actions` SLOT right-aligned before the close, and the title as a `kol-eyebrow` option, as LabWindow uses it.
- **Acceptance:** a LabWindow header (eyebrow title + the lab's buttons) is built from instances with 0 detaches and matches the code's positions within 1px.
- Result: QuickLookHeader is now a set 115:424 — `title=mono` keeps 108:363, `title=eyebrow` 115:413 (JetBrains Mono 500 12/12, 0.06em, uppercase, family bound to font/mono, fg/80 — raw, no helper style is uppercase); `actions` SLOT (115:285) before the close, gap spacing/2, empty = 1px so the W20 positions hold. QuickLookFrame 91:224 kept its ID; its header instance is exposed, so title and actions set from the frame. Proof on both styleguides (115:8290 light, 115:8421 dark): ColorLab's header at 1198, padding spacing/4, nav/close off, 7 Button instances in the slot (tab gen-color pressed · brightness · eye-on · nav undo/redo disabled · copy · expand) — x 952/986/1020/1054/1088/1122/1156, title 16, spacer 95 = the code's (y 9 vs 8.5); 0 detaches. Button row: + 6 tab icon-only + 4 disabled per styleguide. Code Connect: Button emits `disabled`; QuickLookHeader (now on the set) emits the eyebrow title and `actions={<>…</>}` from the slot; QuickLookFrame shows `actions`; published. Audit: Button 0/1207 unbound paints, QuickLookHeader 0/12.
### 21.3 — Picker handles per instance — PARKED: handle positions are per-instance data; kol-atlas keeps ColorLab's picker hand-built (his ruling 2026-10-31).

## W22 — The article page, rebuilt from the live page — approved 2026-10-31 ("Yes, rebuild it") — ✅ built 2026-10-31
His question on 11-article (57:342): *"whats happening here?"*. Five defects: the StackHero band ends early and leaves ~500px empty with heroImage=true; three ShareButtons rows stacked (every variant placed); the content column at x=0 with no page padding; Sources rows with mixed alignment; the Phone frame clips its content.
### 22.1 — Measure, don't compose (cause: W10 assembled the page from parts by eye)
- Render the real stack-blog article (showcase `/sets/stack-blog`, the article view, both heroImage variants) at 1440 and 375 in Playwright; read every block's box; rebuild the three frames from library instances placed at those boxes, fixing any component that measures wrong.
- **Acceptance:** every top-level block's x / y / w / h within 2px of the browser at 1440 and 375; one ShareButtons row; no text clipped in the Phone frame; a side-by-side image (browser | Figma) per frame, looked at.
- Result: the three frames kept their IDs (57:343 · 57:579 · 72:1281) and are rebuilt from instances: StackHero → content column (768, pad 64/24/0/24 — the code's column really sits at x 0 with 24 padding, no mx-auto) with ArticleHeader, PortableTextRenderer, a 24 gap, share-sources (pt 40, gap 40: ONE ShareButtons + SourcesReferences) → "More from the Stack" (pt 96, px 24: heading, featured ContentCard, 3 ContentCards, 3 ContentRows) → pb 96. StickyNavCard is not on the page. Measured with Playwright on a task Vite (port 5312, killed): 1440×900 and 375×812 (hero = 80vh, so 720 / 649.6).
- Deltas (Figma − browser, height): 1440 heroImage=true root −0.8, hero 0, header 0, body −0.9, share 0, sources 0, more +0.2, featured 0, cards 0, rows 0; heroImage=false root −0.8, header 0, rest as above; Phone root −1.2, body −1.6, header/share 60/sources 347/featured/cards/rows 0. Every block's y within 1.6.
- Components fixed (IDs kept): StackHero 52:334 — image fills the hero (was 540 of 960: the "empty band"), the code's bottom-up surface/primary scrim (gradient stop bound), panel top-centred 520 (the code's h-full collapses, so the text sits at the top). ArticleHeader 53:285 — meta row wraps (flex-wrap, gap 24), hero image locked 2:1. ContentCard 52:308 — images locked 16:9, text containers hug (were fixed 60 and overflowed), hero title/body fill and clamp at 2 lines, meta hugs. ContentRow 52:309 — items-start, text column hugs, meta hugs. PortableTextRenderer 57:232 — a `blocks` SLOT (sample is the default); the page fills it with the article body measured from the DOM (prose/* styles, figures as labelled placeholders, code block, table). ShareButtons 54:302 — one wrapping row, every button Button tone=outline sm (was three preview rows, tone=primary). SourcesReferences 54:330 — rows items-start, text column fills and is left-aligned, an arrow on every linked row.
- Font: text styles now resolve to PP Right Grotesk, which the plugin cannot load. Edits ran with the page/organisms page temporarily on the `type` collection's Schibsted mode (118:0), cleared afterwards. Sans text heights are pinned to the browser's; in the plugin's Schibsted render some wider lines overlap (hero title, card titles on Phone); with PP Right Grotesk on his desktop they fit.
- Side-by-side (browser | Figma): scratchpad `w22-side-1440-true.png`, `w22-side-1440-false.png`, `w22-side-375-true.png`. Builder + measurements: `_tmp/figma/w22/`.
- Not done: Tag in the cards draws uppercase; the page passes `kol-tag--data` (mixed case), which the Tag set does not carry.

## W23 — A real article, from kolkrabbi.io — his order 2026-10-31 — ✅ built 2026-10-31
His words: *"this is not ok… you obviously have the showcase, and then there is kolkrabbi.io/stack … here is an article https://kolkrabbi.io/stack/monitor-modular-video-synthesizer Make this article. if you cant then the system doesnt work."* W22's sample broke the hero title into "Monosp / ace" on HIS machine with PP Right Grotesk, so the cause was the build (fixed text widths, wrong text style), not the stand-in font.
### 23.1 — The article as published (cause: a placeholder sample proves nothing about the system)
- Measure the live page at 1440 and 375; rebuild it on 11-article from library instances with its real copy verbatim and its real images (upload_assets); every text node takes the text style of its element's class, bound to `font/*` + `font-style/*`, sized like the code (hug / fill, never a fixed width that only fits one font); the W22 frames go to a `_retired` section.
- **Acceptance:** top-level blocks within 2px at 1440 and 375; 0 text nodes with a fixed width the code doesn't set; every line break in the hero, headings and card titles equals the browser's (compare the line count per heading); side-by-side images looked at; he checks it on his machine.
- Result: two new frames on 11-article — **Article — monitor (1440) 153:1623** and **(375) 155:2160** — built from instances, dark (color mode Dark on the frame), type mode Right Grotesk on the frame. Measured on the live page (Playwright, 1440×900 + 375×812, `_tmp/figma/w23/measure2.mjs` → `measured2.json`, `spec.py` → `spec.json`, builder `build.js`). Route read: kol-website `apps/web/src/routes/StackArticle.jsx` — this article is `type: research` (two columns: StickyNavCard TOC + prose), no StackHero, no ShareButtons (hand-rolled share links), StackLatest = ContentCollection + ContentCard `article` with eyebrow.
- Tree: WebsiteLayout (nav + footer) → `page` SLOT → main pt 168 → ArticleHeader heroImage=true (5 Pills in a `tags` SLOT, avatar + hero real images) → Divider → grid (aside 529 with 7 StickyNavCards + article 775: PortableTextRenderer `blocks` SLOT with all 63 blocks verbatim — h2/h4/p/blockquote/ol/figure/code — then SourcesReferences `sources` SLOT ×11, share row with social-twitter/linkedin/facebook icons) → end Divider → Stack (3 ContentCards). 16 real images placed (8 photos/renders + 5 video poster frames from the page + avatar + 3 card covers).
- Text: every text node FILL or HUG (0 text nodes with a fixed width); styles by class — `kol-prose-title` → prose/title (bound font/sans-narrow + font-style/narrow-medium), prose h2/h4/p/li/blockquote → prose/*, `kol-sans-heading-05` → sans/heading-05, card titles → sans/display-03 (tight), mono roles → mono/* · helper/* · doc/*. The W22 break ("Monosp / ace") came from ArticleHeader's title having NO text style (raw PP Right Grotesk Regular, wide cut) — fixed in the component.
- Components fixed (IDs kept): ArticleHeader 53:285 (title → prose/title, `tags` SLOT, column hugs, author column left), StickyNavCard → set 146:605 `state` passed · active · upcoming (54:355 = active; inks/heights from the live page at section 2: 64 collapsed · 146 full), SourcesReferences 54:330 (title → sans/heading-05, `sources` SLOT), ContentCard 52:308 (`eyebrow` BOOLEAN + `eyebrowText`), WebsiteLayout 59:240 (`page` SLOT, hug height, nav one centred row, `wordmark` INSTANCE_SWAP, footer helper/12 + "Back to top", header stretches), Divider 20:2 (one 1px line — was 26 tall), text style prose/blockquote → font-style/dark (600). New: variables font-style/dark (Dark/SemiBold), font-style/bold; components wordmark/kolkrabbi 156:2706 (from the live SVG), wordmark/voyager 156:2707. Code Connect: StickyNavCard (state → collapsed/isActive), ContentCard (eyebrow) published.
- Boxes (Figma vs browser, 1440): nav 32,16,1376×36 = · header 1041 vs 1040.9 · title 48,212 h60 vs 59.9 · meta 320 vs 319.9 · excerpt 1075.2 wide (lg:w-[80%] as a 20% right pad) · hero 488/673 = · divider 1305 vs 1304.9 · body column 617/775 = · TOC cards 529 wide, 64/146, 82/164 pitch = · figures 465/493 = · code 152/194/89 vs 151.6/193.6/88.6 · sources 953 = · share 50 = · cards 432×371.1 vs 371 · footer 60 =. 375: tags 72 =, meta 104 =, excerpt 124 =, hero 168.5 =, figures/code/sources/cards (304.5 vs 304.4) =. Paragraph heights and every y below the hero title differ only by the stand-in font (the plugin cannot load PP Right Grotesk; Schibsted is wider): 1440 frame 14375 vs 14049, 375 15175 vs 14311.
- Browser line counts to check on his machine — 1440: title 1 · IN THIS ARTICLE 1 · all seven TOC titles 1 · h2 Synthesizers and sequencers 1 · Math as Voltage 1 · The Render Loop 1 · Type-Polymorphic Effects 1 · One Shape, Many Draws 1 · Repos as modules 1 · Bridging Signal Domains 1 · h4 Note on usage 1 · Sources & References 1 · Stack 1 · card titles 1 each (truncated). 375: title **2** · every h2/h4 1 · Sources & References 1 · card titles 1 each (truncated). In the plugin's Schibsted render the 375 title takes 3 lines and h2s wrap — expected with the wider stand-in.
- Side-by-side (browser | Figma): scratchpad `w23-side-1440.png`, `w23-side-375.png` (+ `-NN` crops).
- Not matched: inline code chips have no background (Figma text ranges cannot carry a fill) — mono 12 fg/80 only; syntax colours and the code filename (11/17.6 500) stay raw (no token / style in the code); `em` uses the stand-in italic (no font-style variable for Light Italic); videos are poster frames; share/copy icons ink oq/64 (page draws fg-64/72 — icons law). The W22 frames (57:343 · 57:579 · 72:1281, plus copies 139:10721 · 139:10745 · 139:10769) sit inside a new `_retired` section 158:2602 but are not reparented: moving them needs PP Right Grotesk loaded (raw text inside) — one drag on his machine.

## Coverage log — what is in the library, what is not (2026-10-31)
Not a work order — his words: *"lets not go overboard, im just listing things that are missing. we should keep a log of what has been done and what hasnt"*. Source: every `@kolkrabbi/*` component imported by kol-website apps (web · brand · record · media · metric) and kol-fxr · kol-monitor · kol-mirror, against the library's component sets. Raw list: `_tmp/figma/kol-uses.json`. Tick a row when it lands; nothing here is built without his go.

**In the library (77):** AccountForm · AppFloatNav · AppHub · AppShell · AppStudio · ArticleHeader · AssetCard · Avatar · Badge · Brand · Button · CloseButton · ColorAnatomy · ColorPickerPopover · ColorRamp · ColorSwatch · CommandOverlay · ContentCard · ContentCollection · ContentFilters · ContentRow · Divider · DocsToc · Dropdown · IconFrame · IconPlate · IconToggle · Input · Kbd · Label · LabeledControl · List · LogoCard · MenuItem · Modal · MoodTile · MoreSheet · NavRail · PageShell · Pill · PortableTextRenderer · ProgressBar · Prose · ProsePreview · QuickLookFrame · QuickLookHeader · Rail · Section · SectionLabel · SectionText · SegmentedToggle · SettingsRow · SettingsSections · ShareButtons · ShellLayout · SiteLayout · Slider · SortHeader · SourcesReferences · StackHero · StickyNavCard · Swatch · Table · TableCell · TableRow · TabsRow · Tag · Textarea · TocRow · ToggleCheckbox · ToggleSwitch · Tooltip · TypeBlock · TypeSample · TypeSpecCard · ViewToggle · WebsiteLayout. Icons: 07-icons.

**Missing — components (used by):**
- [ ] Website sections — SectionHero · SectionCards · SectionCta · SectionFaq · SectionNewsletter · SectionSplit · PageSection · SiteHero · TiltCard · ProfileCard · AnimatedTitle · ParallaxShelf · WorkViewToggle · ButtonGroup (web · brand · record)
- [ ] Site chrome + overlays — TakeoverMenu · ShortcutsOverlay · ShellSearchOverlay · FullscreenOverlay · ThemeToggle · WebsiteIntroLoader
- [ ] Settings — SettingsPanel · SettingsFooter · SettingsChoice · SettingsSwitch · SettingsMulti (media · metric · fxr · mirror)
- [ ] Menus + popovers — MenuDropdownItem / Divider / Nest · ContextMenu · PopoverPanel · SearchInput · TabChips · TabStrip · StatusChip
- [ ] Studio + rail parts — StudioDetail · StudioCreate · CatalogPage · RailHeader / Nav / Actions / Foot / Hint / Row / Section · InspectorRail · InspectorSection · ShellDrawer (fxr · monitor · mirror)
- [ ] Instrument controls — Knob · Fader · Toggle · JackSocket · LabeledJack · PanelLabel · ParamSheet · Scrubber · SignalScope · TimeStrip · EnvelopeGenerator · XYPad · CurveEditor · KeyframeEditor · Stepper (monitor · mirror · fxr)
- [ ] Colour tools — HueStrip · SBSquare · WheelTriangle · SwatchStack · EyedropPick (fxr)
- [ ] Media + record — MediaLibrary · MediaTile · AssetGrid · FileQuickLook · Kanban · SortableGrid · FlipCard · TimeSet · EmptyState · PageHeader
- [ ] Dashboards — DashMetric / Chart / List / Table / Featured cards · LineChart · Sparkline · DonutChart · Heatmap (record · metric) — waits on his rebuild
- [ ] Docs + styleguide — DocumentLibrary · DocumentView · BrandGuide · MarkdownPage · CategoryPage · DocumentationReader

**Application pages:** built — 08-brand-hub · 09-brand-lab · 10-studio-hub · 11-article (W23 rebuilding from kolkrabbi.io) · 12-document. Missing:
- [ ] web — work · foundry · cards · layout · stack index
- [ ] brand · record · media · metric
- [ ] fxr · monitor · mirror

## Pages — reorganised 2026-10-31 (his go)
- ➤ overview: 01-page · 02-styleguide (light + dark). ➤ components: 03-atoms · 04-molecules · 05-organisms · 06-styleguide-set · 07-icons. ➤ applications: 08-brand-hub · 09-brand-lab · 10-studio-hub (empty until he says go). Page IDs did not change; earlier sections of this plan use the old numbers.

## PARKED

- **A drift gate** that fails when kol-theme publishes ahead of the file — not until 1.1 has run twice by hand.


## W19 — kol-atlas's library list — ✅ built 2026-10-31 (his "All of them")
Measured live in the showcase (probe JOBS19, port 5306, light + dark).
1. **Dropdown (9:63)** hugs: `dd-label` = label + 16 right (`.kol-dd-ghost`), btn hugs, caret 4 apart. 102 / 119 / 136 vs the code's 101.2 / 118.4 / 135.6. A longer label grows the button; an instance can no longer be stretched wider than its label (the 180 trick is gone — size comes from content, as in the code).
2. **TableRow (49:277)** hugs its cells: 41 / 42 (cell + rule); wrapped text no longer clips.
3. **TableCell (49:188)** `chip` BOOLEAN: a 14/16 chip (radius/xs, palette/blue — override per instance) in the leading slot beside the icon slot.
4. **Pill (20:39)** hugs its label. `subtle` not added: in the code `subtle` is the deprecated alias of `primary` (both `.pill-subtle`, fg-16) — use primary.
5. **Button (8:32)** 57 → 120 variants: `variant=nav` icon-only 26/32/40 (transparent, oq/80 ink as measured), a hidden `iconLeft` slot (BOOLEAN + `iconLeftName` swap, ADJACENT 14/16/18, gap 8; sm with it measures 92 vs 91.2), and `radius=sm|full` (every variant has a full twin bound to radius/full).
6. **TabsRow (9:123)** `type=mono|sans|mono-light` (sans = Public Sans Light 14/22.4, mono-light = JetBrains Light 14/22.4, tabs 24 apart, 1px underline) and an `icon` BOOLEAN (16 on mono, 20 on sans/mono-light). Height: the tab is 40 as in the code; the variant is 48 because the code's scroll wrapper pads 4 above and below — measured, not a fixed size.
7. **New sets:** DocsToc rail 91:190 (at rest — child labels and the lens appear under the pointer, not drawn) · QuickLookFrame 91:224 · List 91:248 (disc · number, one prose/li text per list, 8 apart) · ColorPickerPopover 93:741 (inline, 260×354 as the code; hue / white / black / alpha gradients are literal in the code and stay raw) · ContentFilters header 93:770 (title property). IconToggle already existed (78:235).
- Styleguide: the five new sets + nav icon-only on both frames. Code Connect: Button (radius, iconLeft, nav), TabsRow (type, icon) updated; DocsToc, QuickLookFrame, List, ColorPickerPopover, ContentFilters added; all valid, snippets checked.
- Audit: 0 unbound fills/strokes except ColorPickerPopover's 2 literal colours (hue base, checker grey).
- Item 8 (Right Grotesk in Figma) is his: set `font/sans*` to the installed "PP Right Grotesk" in the desktop app.

## W24 — Tone as a variable collection (lobby FigmaToneCollection) — approved 2026-10-31 — ✅ built 2026-10-31
- Collection `tone` (VariableCollectionId:165:87), modes primary · secondary · inverted · outline · ghost · grey · sunken (165:0–165:6; primary is the default = code's fallback), 16 variables = TONE_VARS (165:88–165:103), code syntax `var(--kol-tone-*)`. Measured computed `--kol-tone-*` per `kol-tone-*` class in light + dark (`_tmp/figma/w24/measure.mjs` → `tones.json`, matched in `match.py`): every value aliases a `color` variable; `transparent` / `none` are transparent; image fields are COLOR (sunken's fg/04 · fg/08 overlays); `panel-border-w` FLOAT 0/1. One gap: outline `hover-border` = `color-mix(on-primary 25%, primary)` has no color variable — raw light value, unbound anywhere.
- Rebound to tone vars: Button 8:32 (the 36 `variant=default` variants: ground bg / pressed-bg + pressed-image, stroke border, ink fg / pressed-fg), Dropdown 9:63, Input 9:20, Textarea 21:42 (filled + outline; outline variants carry explicit mode `outline`, as `.kol-control--outline` sets the bundle on the element). Not toned in code, so untouched: IconToggle, Pill, TabsRow. Still on their own variant: IconFrame (78:166, variant = tone alias), SegmentedToggle, ViewToggle.
- Button `tone` variant retired: 128 instances with tone≠primary (02-styleguide 80 · 04 4 · 05 1 · 08 5 · 09 38) set to explicit tone mode X, then the 180 non-primary variants removed; set ID kept, 366 → 186 variants. Code Connect: Button emits no tone (Code Connect can't read a mode); published.
- Specimen: `tone` section on both styleguide frames (light 166:12270, dark 166:12384), one row per mode with Button · Dropdown · Input.

## W25 — The layout group in Figma (lobby LayoutGroup, item 6) — ✅ built 2026-10-31
Source: lobby/done/LayoutGroup.md item 6 — *"a page per Layout*, Block* and CardLogo, built from the code. Data-driven parts (type faces, colour values) read from variables, so a consumer file can hold one collection per kind with a mode per exploration … and switch an instance between them."* Code: kol-styleguide 0.19.0 (`./layout`), measured live in apps/brand-lab `/layout/type|color|logo|text|guide` at 1440 (layout root 1344; task Vite 5321, killed). Pipeline: `_tmp/figma/w25/` (measure.mjs → layout.mjs → builder.js).
### 25.1 — Data as variables (cause: the explorations are values, the views are layouts)
- `layout-type` (170:95, mode `kolkrabbi`): face/display|heading|text|mono (aliases of type/font/*), step/*/size|line-height, role/*/weight (aliases of type/font-style/*) and role/*/tracking (px) = typeLabCss `--t-*`; 16 text styles `layout/t-<role>` bound to them, + `layout/sheet/*` (6). `layout-color` (170:148, mode `kolkrabbi`): swatch/1–5, ramp/1–5/1–7, role/*, ink/* — color · hex · name · on (+ swatch mark-ink); hex and names are STRING variables bound to the texts. `type` gains font-style/narrow-regular|narrow-dark|narrow-bold|narrow-black|compact-dark|compact-italic|medium|italic.
- **Acceptance:** every role text resolves through a layout/t-* style (0 role texts with a raw family); every colour, hex and name in palette · ramps · layouts · sheet · logo boards is bound to layout-color.
### 25.2 — Pages and components (cause: the views only existed in code)
- Pages 14-layout-type 172:87 · 15-layout-color 172:88 · 16-layout-logo 172:89 · 17-layout-text 172:90 · 18-layout-guide 172:91 · 19-block-type 172:92 · 20-block-swatch 172:93 · 21-card-logo 172:94 (after 07-icons, #1E1E1E, breakpoint Desktop).
- Sets: LayoutType 190:604 (view=scale 185:87 · styles 188:165 · article 188:224 · sheet 189:175 · faces 190:169 — faces on the ui/* styles + ui-font, no duplicates), LayoutColor 178:5629 (palette 177:87 · ramps 177:110 · layouts 177:237 · sheet 178:87 from BlockSwatch cell instances), LayoutLogo 176:5512 (marks 176:87 from CardLogo plate instances · lockups 176:123), LayoutText 180:5816 (lines 179:87 · source 180:87, TocRow rail), LayoutGuide 182:87, BlockSwatch 175:241 (chip 175:208 · cell 174:87 · cell lead 174:91), CardLogo 175:201 (figure = LogoCard 26:62 moved from 06, ID kept · plate 175:87, `logo` swap), BlockType 175:242, logomark/kolkrabbi 173:89.
- **Acceptance:** each view's height equals the measured root within 1px where no Grotesk text wraps (palette 208, ramps 636, layouts 528, color sheet 1619.2, logo 788/608, guide 2240, faces 4466, lines 1908 vs 1907.6, source 2909 vs 2908.6) — met; Grotesk views differ only by the Schibsted stand-in (scale 7715/7031, styles 2604/2612, article 3477/3353, sheet 1645/1501 incl. the code's text-box trim).
- Not done: Code Connect (no repo edits on this run); styleguide-frame instances; italic runs and the sheet's 900/800 weights are unbound Schibsted stand-ins (binding them breaks the plugin's Right Grotesk restore); photos are fg/04 plates; tables and the faces TabsRow are measured frames, not TableRow/TabsRow instances; the guide's ramp stops other than 300 are raw manifest colours; the lockup wordmark is literal text.

## W26 — DocumentIndex in Figma (lobby DocumentIndexFigma, kol-atlas) — ✅ built 2026-10-31
Source: lobby/inbox/DocumentIndexFigma.md — *"the library has no DocumentIndex, no SectionText level for a document page, and a Table that cannot take more rows or cells"*. Code first: kol-component (Unreleased → 0.323.0) `SectionText level="document"`; kol-framework 0.67.0 `DocumentIndex` header on it. Measured on a task Vite (port 5291, probe `_tmp/figma/probe-module/probe-docindex.js`, `_tmp/figma/w26/measured1440.json`), light + dark.
### 26.1 — SectionText levels (cause: the component carried one level as three loose texts)
- Set 197:1153 (04-molecules, explicit breakpoint Desktop): `level` page 14:75 (ID kept) · app 197:1137 · section 197:1141 · content 197:1145 · document 197:1149; `eyebrow` BOOLEAN, `eyebrowText` · `headline` · `body` TEXT.
- **Acceptance:** each level's type equals the measured code at 1440 (page 96/96 · app 60/60 · section 48/48 · content 24/28.8 · document 36/43.2 700 −0.18; ledes 22/28 · 19/26 · 16/24 · 16/25.6 · 15/24), body measure 569.5 (64ch) / 724 — met.
### 26.2 — Table and TableRow on slots (cause: fixed thead + three rows, three cells)
- Table 23:60 `rows` SLOT (195:1621 · 195:1622) holds the body TableRows; TableRow 49:277 `cells` SLOT (195:1175–195:1178) holds the TableCells; variants and IDs kept, heights unchanged (168/166, 41/42).
- **Acceptance:** 0 layers inside a slot bound to their owner's properties — met.
### 26.3 — DocumentIndex (cause: the page only existed in code)
- Page `　　↳　22-document-index` 198:280 (#1E1E1E, breakpoint Desktop); set 198:700 `variant` cards 198:634 (default) · table 198:281: SectionText document instance, then Table simple with five-cell rows in its slots (head fg/04 caps, 16 outer inset, pen icon oq/48 before the title).
- **Acceptance:** heights vs the code at 980: cards 712 / 711.2, table 494 / 496.6 (first body row 42 vs 45.7: the code's inline-flex icon cell) — met within 4.
- Not done: Code Connect templates written (`figma/SectionText.figma.js`, `figma/DocumentIndex.figma.js`) but unpublished — the full publish fails on LogoCard 26:62 (a variant since W25); no styleguide-frame instances; the document title is raw (sheet/h1 binds Regular where the code is 700).

## W27 — Ink roles in the color collection (his go 2026-10-31) — ✅ built 2026-10-31
Acceptance: 8 `ink/*` in `color` aliasing their fg step in both modes, code syntax `var(--kol-fg-<role>)`, description "Ink roles — …"; 0 references to the removed duplicates; per-role bound-text count; SectionText + one organism unchanged light/dark, 10 sampled texts numerically equal before/after.
- Built: `ink/subtle` 203:87 (fg/24) · `ink/meta` 203:88 (fg/48) · `ink/body` 203:89 (fg/64) · `ink/lede` 203:90 (fg/72) · `ink/strong` 203:91 (fg/80) · `ink/shout` 203:92 (fg/88) · `ink/scream` 203:93 (fg/96) · `ink/emphasis` 203:94 (→ 5:115, surface-on-primary). Scopes TEXT_FILL + SHAPE_FILL. `layout-color` (170:148) and its `ink/<role>/*` data untouched (coordinator correction: not duplicates).
- Removed from `color` (0 refs left on every page, 0 aliases): fg/body 5:44 · fg/default 5:45 (→ ink/body) · fg/emphasis 5:46 · fg/lede 5:48 · fg/meta 5:49 · fg/shout 5:50 · fg/strong 5:51.
- Duplicate rebinds: 727 paints (14-layout-type 440+15 range, 17-layout-text 95+10, 18-layout-guide 66, 15-layout-color 50, 02-styleguide 30, 11-article 14, 22-document-index 6, 19-block-type 1).
- Role rebinds (fg/NN → ink/<role>, only roles the component's JSX uses and whose step it never uses raw): TabsRow · Avatar · ViewToggle · SegmentedToggle · ProgressBar · Modal · LabeledControl · MenuItem · SettingsSections · ShellLayout · ColorPickerPopover · AccountForm · ColorRamp · TypeSample · TypeSpecCard · ProsePreview · MoodTile · AssetCard · BlockSwatch · CardLogo · DocumentIndex. SectionText stays on fg/NN (its levels use text-fg-48/64/96). CSS-only role uses (kol-*.css rules) not mapped.
- Bound texts per role: emphasis 571 · meta 247 · body 175 · strong 33 · lede 12 · subtle 3 · shout 0 · scream 0.
- Look: SectionText 197:1153 + AccountForm 99:1264 screenshot light and dark, unchanged; 10+ samples (9:112, 97:265, 107:1837, 10:22, 27:10, 25:4, 185:92, 179:91, 166:12271, I153:1624;145:1224;153:2587 …) resolve identical RGBA before/after (aliases).

## W28 — The missing application pages: site-hub · workshop · website (his go 2026-10-31) — ✅ built 2026-10-31
- Pages under ➤ applications after 23-generators, canvas #1E1E1E: **24-site-hub** (apps/site-hub `/`, 1440) · **25-workshop** (apps/workshop `/`, 1440) · **26-website** (kolkrabbi.io `/` · `/work` · `/stack`, 1440 + 375 each). Measured live (Playwright: boxes, classes, text verbatim, images via upload_assets), rebuilt from the library's layout components (SiteLayout · ShellLayout · WebsiteLayout …) and parts, W23's method; theme = the page's default, recorded per frame.
- **Acceptance:** every frame's top-level blocks within 2px of the browser; 0 unbound solid fills on text; text nodes take the style of their class (font/* + font-style/* bound), hug/fill, no fixed text widths; 375 frames in the `breakpoint` Phone mode; side-by-side browser | Figma per frame in the session scratchpad `layouts/`, each looked at and fixed before the report.
- Result: pages 24-site-hub 222:87 · 25-workshop 222:88 · 26-website 222:89 (#1E1E1E). Frames: Site hub / 225:87 (light) · Workshop / 227:87 (light) · Website /stack 230:87 + 375 232:288 · /work 238:946 + 375 236:513 · / 241:1603 + 375 243:1896 (all dark; 375 frames in breakpoint Phone, 1440 Desktop; type mode Right Grotesk on every frame, page in Schibsted for editing). Default theme: the two apps follow the system (light in a default browser), kolkrabbi.io opens dark.
- Method: Playwright DOM walk (`_tmp/figma/w28/measure.mjs` → `m-*.json`, boxes/classes/text/colours/rotation, element captures of every img/video) → `prep.py` (library parts: Button 8:32 by `kol-btn`+tone mode, Tag 9:140 by `kol-tag`, ContentCard 52:308 by `kol-card`, 07-icons instances by SVG path match, wordmark 156:2706; website pages inside a WebsiteLayout 59:240 instance, content in its `page` slot) → `builder-min.js` via `call.py`. Every block sits at its measured box (frame heights 900 / 4074 / 4815 / 6478 / 6101 / 19265 / 14910 = the browser's scrollHeight). 60 real images uploaded (upload_assets), shared across 1440/375.
- Audit: 0 unbound solid fills on text (all frames); 0 fixed-width text nodes (multi-line text FILLs a wrapper of the measured column; single-line text hugs, centred text re-centres in a parent-width wrapper); text styles by class (kol-mono/helper/sans/prose/doc), the rest raw with family bound to font/* + font-style/*. Exceptions: TGMalromur (the /work row serif, 52 nodes) and TG Rot are not in Figma — Instrument Serif stand-in, unbound; 16 uppercase 40px highlight titles + "Study Stack" carry family/style variables but no text style (the uppercase override drops it).
- Not library parts (no component exists): SiteLayout/ShellLayout instances could not carry these pages (no page slot, different rail rows), so the site rail and shell header are measured frames with NavRail-row icons as instances; SectionCards/SectionSplit/SectionCta/ContentRow rows are measured frames. The kolkrabbi.io intro loader (fixed takeover) is left out; the ASCII waves and hero/highlight videos are frozen at the measured frame.
- Side-by-sides (browser | Figma): scratchpad `layouts/w28-<page>-<w>.png` + `-NN` crops, looked at. Remaining visible differences are the stand-in Grotesk (wider: /work heading wraps to 4 lines and overlaps the filter row at 1440, 375 display titles wrap) — on his machine with PP Right Grotesk they reflow to the browser's.
- **Text pass (2026-10-31, his go):** every text node takes the library style of its measured class. 18 styles added (uppercase siblings where the code uppercases: `helper/12-upper` (kol-helper-12 uppercase · kol-eyebrow · kol-section-text-eyebrow), `helper/14-upper`, `mono/14-upper`, `mono/10-upper`, `sans/display-01-upper` (kol-section-text-caps), `sans/display-03-upper` (ContentCard title), `sans/heading-02-upper`, `prose/display-upper`; one-offs `sans/hero-title` (home-hero__titleText, size → new `text/hero-title` 48/61.44/115.2), `sans/hero-tagline` (heading-02 clamp(22px,3.6vw,40px) regular 0.04em, `text/hero-tagline` 22/27.65/40), `sans/shell-brand`, `helper/28`, `mono/shell-header-tab`, `mono/ascii-10|14|wave|4` (font-mono text-[…] ASCII fields), `serif/work-row` (TGMalromur → Instrument Serif stand-in, unbound family; `text/work-row` 24/60/60, tablet = desktop is a guess)). Grotesk styles bind font/* + font-style/*. Tag chips take `card/tag` (= .kol-tag--sm in code; the live site still ships the older 400/0.04em chip). A text-case override detaches a Figma text style — that is why the uppercase siblings exist.
- Truncation: 128 single-line titles (ContentCard `sans/display-03-upper` 24, /work rows `mono/14-upper` 52 + `serif/work-row` 52) carry textTruncation ENDING · maxLines 1 · FILL (row serif wrappers clamped to their column, 32). "Vinnustofa" hero title right-anchored at its measured right edge (constraint MAX, align RIGHT).
- Headings vs browser (line count in the browser with PP Right Grotesk): /work 1440 "Featured client work…" 2 lines (text-wrap: balance in a 960 column; Figma wrapper now the 960 column, Schibsted gives 3) · "/ CONNECT" 1 · "SEND A MESSAGE" 1; /work 375 "Featured…" 3 lines (343 column; Schibsted 5); / and /stack display headings all 1 line. The remaining overlap with the filter row is the stand-in's width only.
- **Acceptance (text pass):** text nodes without a style — 24-site-hub 0/15 · 25-workshop 0/17 · 26-website 0/676 (/stack 1440 0/46 · 375 0/62 · /work 1440 0/204 · 375 0/119 · / 1440 0/112 · 375 0/133). Side-by-sides re-rendered and looked at: scratchpad `layouts/w28-work-1440-v2*.png`, `w28-home-1440-v2*.png`, `w28-stack-1440-v2*.png`. Script `_tmp/figma/w28/restyle.js`. ContentCard 52:308's own title text is still unstyled in the component (instances override it here).

## W29 — The document system on one component page (his go 2026-10-31) — ✅ built 2026-10-31
- **Acceptance:** 0 unstyled text nodes in the new components; 12-document renders as before (before/after screenshots); side-by-side browser | Figma for /project (numbered), one plain doc (/reviews/branding/reviews/airbnb), DocumentLibrary and DocumentView, in the session scratchpad `docsystem/`, each looked at.
- Page `　　↳　27-document-system` 259:508 under ➤ components after 22-document-index (#1E1E1E, breakpoint Desktop). Moved there, IDs kept: DocumentHeader 247:2894 (2 instances) · DocumentIndex 198:700. SectionText `variant=document` reference instance 259:509 (the set stays on 04-molecules).
- **MarkdownPage** set 261:527: `variant` numbered 72:1508 (the old component, ID kept) · plain 261:247 (the airbnb review: h1, intro, Verdict + list, Verified claims on the library Table with TableRow/TableCell in its slots); `linkNotes` BOOLEAN (default false, as the code) shows the ol.fns blocks + their 32 spacer. The 4 instances (12-document 73:178 · 76:739, styleguide 77:5281 · 77:5350) set linkNotes=true. Fixes to the numbered variant from the CSS: sheet/h1–h3 fontStyle → font-style/bold (700); ink → ink/emphasis, muted → ink/body, notes → ink/meta, .tb at 70 % ink/emphasis, h3 hairline (fg/12 top, 18 pad), h4 numbers mono/12 muted, h2 number accent raw #DF760B (orange-300; no variable — dark should be yellow-300 #FFCF33). New styles `sheet/th` (mono 12/15.6 upper) · `sheet/td` (mono 12/16.8) on the sheet table, th fill fg/04.
- **DocumentLibrary** 262:320 (/library: three PageSections, helper/12-upper ink/meta label, Table simple per folder at the measured column widths, Assets = Button nav sm, Markdown = icon-only nav sm with the download icon). **DocumentView** 262:1308 (/library/press/press-2027-03-12-launch: file buttons right, then a MarkdownPage plain instance at 820).
- Result: unstyled texts 0 in MarkdownPage (45) · DocumentLibrary · DocumentView. 12-document diff only where intended (bold heads, accent, mono numbers). Code Connect published: MarkdownPage (variant → numbered, linkNotes), DocumentLibrary, DocumentView (and DocumentIndex, DocumentHeader).
- Not carried: inline marks (link underlines, sup refs, bold runs, code spans); title links in DocumentLibrary not underlined; DocumentView gap between its two paragraphs is 20 (the instance spacer can't be overridden; code 8); sheet tables are an excerpt scaled to the 624 column. /assets and /reference render MarkdownPage + DocumentIndex, not DocumentLibrary — the library pages were measured from /library.

## W30 — `ink-roles` collection, roles picked by mode (his go 2026-10-31) — ✅ built 2026-10-31
Acceptance: collection `ink-roles` with one COLOR `ink`, 8 modes aliasing the fg steps; every color/ink/<role> paint rebound to `ink` with the role as the node's explicit mode; resolved RGBA identical before/after; 0 refs, then the 8 color/ink/* removed.
- Built: collection `ink-roles` VariableCollectionId:265:87, modes subtle 265:0 · meta 265:1 · body 265:2 · lede 265:3 · strong 265:4 · shout 265:5 · scream 265:6 · emphasis 265:7 → fg/24 · fg/48 · fg/64 · fg/72 · fg/80 · fg/88 · fg/96 · 5:115 (surface-on-primary). Variable `ink` VariableID:265:88, scopes TEXT_FILL + SHAPE_FILL, WEB `var(--kol-fg-body)`, description "Ink roles — pick the role with Apply variable mode…" (role comes from the mode). Default mode is subtle, not body: Figma's default is always the first mode and modes can't be reordered via the API; every migrated node carries an explicit mode, so nothing resolves through the default.
- Migrated 1,206 nodes (main components first, then instance overrides; one page per call): mode set on the node itself, hoisted to the main component in 11 cases where all its bound children share one role. 7 mixed-role texts (14-layout-type 185:235 · 185:245 · 188:234 · 188:251 · 188:252 · 188:266, 17-layout-text 180:98): majority role → `ink` + mode, the minority runs bound straight to their fg step (one mode per node can't carry two roles).
- Check: every migrated node compared before vs after via resolveForConsumer (light and dark frames, e.g. Styleguide: light 11:62 body 0.0706/0.64, Styleguide: dark 17:326 body 0.9804/0.64): 0 mismatches; 153 untouched instance sublayers resolve the same ink-roles mode as their source. 0 refs left (nodes, aliases, paint styles).
- Removed from `color`: ink/subtle 203:87 · ink/meta 203:88 · ink/body 203:89 · ink/lede 203:90 · ink/strong 203:91 · ink/shout 203:92 · ink/scream 203:93 · ink/emphasis 203:94. `layout-color` ink/<role>/* untouched. Code Connect unchanged.

## W31 — Sync pass: kol-component 0.320–0.326 · kol-theme 0.204–0.209 · kol-icons 0.55–0.56 (his go 2026-10-31) — ✅ built 2026-10-31
- **Acceptance:** each item present with its variants; 0 unbound fills / strokes in the new components; light + dark screenshots per item; Code Connect published.
- Measured: probe31 (showcase vite, port 5375, killed), `_tmp/figma/atoms31.json`; scripts `_tmp/figma/w31/`.
- **Icons (07-icons):** `more-vertical` 271:91 (nav) · `calendar` 271:95 (misc), oq-96, `figma/icons/*.figma.js`.
- **Menu\* (04-molecules):** MenuRow 273:323 (`current` · `disabled`; label · icon/iconName · check · kbd · trailing/trailingName; 216×38, 12 sides, 6 radius, ink shout → scream on current, oq-16 fill, glyphs oq-88, Kbd md instance outlined oq-24/oq-80) · MenuLabel 273:324 (helper/12-upper, meta) · MenuDivider 273:326 (oq-16 rule through the 4 inset) · MenuPanel 273:329 (oq-08, 8 radius, 4 inset, shadow/float, `rows` slot) · MenuFlyout 273:445 (`open`) · MenuTrigger 273:498 (`iconOnly` · `open` · `hover`, wraps Button tab/sm; labelled ink strong, no hover) · MenuFilter 273:684 · MenuDatePicker 273:807 · MenuMore 273:912 (`open` false|true, panel 8 under). MenuItem 22:60 description: deprecated → MenuRow.
- **Dropdown 9:63:** `variant=raised` sm/md/lg (oq-08 trigger, emphasis ink). The set draws closed triggers only, so the raised and default panels are not drawn; code measured: default panel = surface-secondary (trigger tone's floating surface, 0.208).
- **Modal 10:38:** `variant` bordered (existing IDs) | lift (oq-04, no border, oq-96 title).
- **Button/bare** 273:11932 on 03: separate component (a `children` slot) — bare takes none of size · iconOnly · pressed · radius, so on the 186-variant axis it would be one orphan cell.
- **TabsRow chip hover:** skipped — the set models no states.
- Not carried: MenuLabel tracking 0.3 (style has 0.72); Segment's trailing chevron 12 drawn at 14; Screen size row has no glyph (code's `monitor` is not an interface icon). MenuFilter's `active` section not drawn (its × is Button xs, which the set lacks).
- Styleguide: six sections on both frames (MenuTrigger, Menu, MenuRow, Dropdown raised, Modal lift, Button bare).

## W32 — W31 gaps · MarkdownPage inline spans · /work heading (his go 2026-10-31, kol-goal T2–T4) — ✅ built 2026-10-31
- **Acceptance:** each item present; light + dark screenshots in the session scratchpad `t234/`, looked at; Code Connect published.
- **T2a TabsRow 9:123:** new variant axis `state` rest|hover (all 12 existing variants = rest); hover = chip bare=false 279:320 · bare=true 279:329: the unselected 2nd tab on oq/04 with `ink` mode emphasis (kol-theme 0.205.0 `--kol-tone-hover-bg: oq-04`, `-fg: fg-emphasis`).
- **T2b Button 8:32:** `size=xs` 279:316 (iconOnly=true, variant=default, pressed=false, radius=sm, disabled=false) — 22×22 bound ctl/xs, radius bound radius/xs (2), glyph 12 (SOLO xs). Only the iconOnly cell the × uses; xs labelled buttons not drawn. Code Connect size map + xs. MenuFilter open=true 273:567: "Active" section on top of the rows slot — MenuLabel 279:7193 · row 279:7195 (MenuRow "Browser is Chrome", no icon, FILL + Button xs 279:7213 with `x` 29:17, tone mode ghost) · MenuDivider 279:7217 (Clear all only at 2+, not drawn). Text is the preview's "Browser is Chrome".
- **T2c MenuLabel 273:324:** new style `helper/12-upper-menu` (helper/12-upper with letter-spacing 0.3px = 0.025em of .kol-menu-label; family/size/leading still bound).
- **T2d Screen size row:** icon on, iconName → identity `monitor` 39:42 (the code's `icon: 'monitor'` resolves to the identity mark; Code Connect `figma/icons/monitor.figma.js` already existed).
- **T3 MarkdownPage 261:527:** new variable `color/sheet/accent` VariableID:280:553 (Light #DF760B orange-300 · Dark #FFCF33 yellow-300, WEB `var(--accent)`) bound on the 7 raw-orange texts (M1 number + the 6 plain bullets). Inline runs from the W29 measurement (`_tmp/figma/w29/m-*.json`): numbered — links Atlas · branded house · SEO + GEO · analytics · setup path · The foundation of the brand · Figma library (underline 1.5, offset 4, colour bound sheet/accent); footnote refs 1–4 inserted after their links (Public Sans SemiBold 11.25, fg/48). Plain — `src/research/…/airbnb.json` + `_tmp/…/pages/` as JetBrains Mono 13.2 (family bound font/mono); "Needs fixes." SemiBold.
- Not carried (Figma can't): superscript raise (no baseline shift / SUPS in the API — refs sit on the baseline, smaller and lighter); inline-code chip ground (fg 8 %, 1px 5px pad, radius 4 — a text range has no background).
- **T4 /work 1440 heading** I238:947;145:1224;238:1003: measured live kolkrabbi.io/work at 1440 (`_tmp/figma/w28/h-t4.mjs`): h1 `kol-section-text-headline kol-sans-heading-01`, box 960 wide at x 48, Right Grotesk Narrow 500, 64/70.4, tracking normal, text-wrap balance; 2 lines — "Featured client work," (394.8 wide) / "collections, tools and ui systems" (601.3). Figma already had width 960 (FILL of the 960 column) and `sans/heading-01` (font/sans-narrow + font-style/narrow-medium = PP Right Grotesk Narrow Medium, text/heading-01 64 · leading 70.4 at Desktop) = the class. Set: paragraph wrap BALANCE (= text-wrap: balance). Fit proof: both browser lines ≤ 601.3 < 960 and the one-line total ≈ 1012 > 960, so the same face/size/tracking in a 960 box breaks to exactly 2 lines; the screenshots show 3 only because Schibsted (the stand-in) is wider.

# Plan — the KOL Figma library

**Raised:** 2026-10-31, the user. Points verbatim: *"I wanna create a figma mirror to the DS … tokens color, opacity, spacing, text … then we set up a styleguide and at least the control atoms and some molecules and maybe a few modals and organisms"*; *"can you use another Grotesk and I switch? use the google schibsted grotesk?"*; *"just start with the styles, then I review? because we definitely dont need all of it. some are never used, and we just need relevant stuff in the figma mirror"*; *"you dont go until its approved"*; W1 approved, then *"go! do everything, dont stop after import ill review when ur done"*.
**File:** https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH (`❖ library — kol-ds-ui`). On 2026-10-31 it held only Cover · overview · 01-page, all empty.
**Status:** W1–W15 built 2026-10-31 (W12.2 under W10/W13). Running: W16 (float into code), W18 (UI font sheet), W19 (kol-atlas list); W17 after W16. Open for him: 1.4 style review, 19.4 PP Right Grotesk, the library publish. Pages: see "Pages".
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

## W16 — Float style accepted, into the code — approved 2026-10-31 ("Yes, all three")
His words: *"can we accept the style, both glass styles, dont care about other questions"*. Source: round 3, https://claude.ai/artifact/VMiZCd6QZm5PRaWc4Yy4yF (values as written there: mouse h 28/36/44 · text 12/13/14 · icon 18; touch h 36/44/52 · 13/15/16 · 20; menu r 26/30 inset 6 rows 40/48; nav bar 66 · buttons 56 · icons 28; tab bar 66 · item 58; tooltip float 24/28 pill inverted).
### 16.1 — Glass tokens (cause: glass lives only on an artifact)
- kol-theme: `--kol-glass-dark-*` / `--kol-glass-light-*` (fill, blur s/m, rim, shadow s/m) exactly as round 3; `prefers-reduced-transparency` falls back to solid.
- **Acceptance:** a probe element with each glass reads the round-3 computed `background`, `backdrop-filter` and `box-shadow`.
### 16.2 — `surface` on the float components; round-3 sizes
- `surface="solid|glass-dark|glass-light"` on AppFloatNav (all shapes), AccountForm box, Button/Input `variant="float"` where they sit on a float, plus the float Tooltip, SegmentedToggle and TabsRow from round 3; mouse vs touch sizes by `(pointer: coarse)`. glass-dark puts dark ink on what sits on it in either theme.
- **Acceptance:** Playwright on the showcase/studio-hub: each shape × surface measures round 3's sizes within 1px on mouse and touch; the provisional values are gone.
### 16.3 — Publish and close
- kol-theme / kol-component / kol-shell published; the showcase AppFloatNav page exists; FloatingStyleAndSignInDemos closed with its receipt.

## W17 — Float and glass in Figma — approved 2026-10-31 ("Yes, all three"); runs after W16
### 17.1 — Glass as effect styles (cause: Figma has no glass until the tokens exist)
- `glass/dark-s|m`, `glass/light-s|m` effect styles (background blur + rim inner shadows + outer shadow) and their fills as `color` variables, from W16's tokens.
- **Acceptance:** each effect's blur radius, shadow offsets/blur/alpha equal the W16 computed values exactly.
### 17.2 — Float variants and AppFloatNav
- Button / Input float variants; an AppFloatNav set (mobile · dock · panel · transport) × surface (solid · glass-dark · glass-light), mouse sizes.
- **Acceptance:** every variant's height and radius equal W16's measured code within 1px; 0 unbound fills/strokes.

## W18 — The UI font sheet in Figma — approved 2026-10-31 ("Yes, all three")
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

## Pages — reorganised 2026-10-31 (his go)
- ➤ overview: 01-page · 02-styleguide (light + dark). ➤ components: 03-atoms · 04-molecules · 05-organisms · 06-styleguide-set · 07-icons. ➤ applications: 08-brand-hub · 09-brand-lab · 10-studio-hub (empty until he says go). Page IDs did not change; earlier sections of this plan use the old numbers.

## PARKED

- **A drift gate** that fails when kol-theme publishes ahead of the file — not until 1.1 has run twice by hand.


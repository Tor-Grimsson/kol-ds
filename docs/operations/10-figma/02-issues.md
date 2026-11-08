---
title: Figma issues to revisit
type: reference
status: active
created: 2026-11-07
updated: 2026-11-07
description: His questions on the KOL library's built pages, parked to revisit — nothing here is fixed yet
aliases:
  - figma issues
tags:
  - domain/figma
  - audience/agency-internal
related:
  - "[[INDEX|Figma]]"
  - "[[01-file-setup|Figma file setup]]"
---

# Figma issues to revisit

Raised by the user on 2026-11-07 after the Atoms page was built (`.kol/llm-context/plan-2026-11-07-figma-library-tiers.md` W2). Each row names the plan phase that answers it (`.kol/llm-context/plan-2026-11-07-figma-library-tiers.md`). His summary: *"either the text in 'in use' is bullshit or there are serious problems."*

## Atoms page — 2026-11-07

| # | Component | His point (verbatim) |
|---|---|---|
| 1 | Tooltip · ProsePreview | Went to a new ↳ Utilities page — he questions the decision. → plan 2.14 |
| 2 | MoodTile | *"what is this? where is it used?"* → plan 2.11 |
| 3 | TypeSpecCard | *"where is it used?"* → plan 2.11 |
| 4 | TypeSample | *"where is this used?"* → plan 2.11 |
| 5 | BlockType | *"where is this used?"* → plan 2.11 |
| 6 | AssetCard | *"where is this used?"* → plan 2.11 |
| 7 | SourcesReferences | *"it says in use none, but this is used in article"* → plan 2.10 |
| 8 | Sparkline | Same: In use says none, but it is used. → plan 2.10 |
| 9 | IconFrame | ColorPickerPopover is listed as In use, but the IconFrame in the example is hidden. → plan 2.10 |
| 10 | IconPlate | Has no use. → plan 2.11 |
| 11 | ValueField | Has no use. → plan 2.11 |
| 12 | ThemeTile | In use is ReadingSettings — where is that? The example clips the component (the Night tile's edge is cut). → plan 2.10 |
| 13 | ProgressBar | *"doesnt use slider base?"* → plan 2.12 |
| 14 | SizeChip | *"seems like we are re-inventing things?"* → plan 2.12 |
| 15 | SectionLabel | *"isnt this outdated?"* → plan 2.11 |
| 16 | Label | *"why do we need a label component? no use?"* → plan 2.11 |
| 17 | Kbd | The stroke should get smaller at the small size (it is the same), the height should match, and In use does not show it. → plan 2.12 |
| 18 | Divider | *"no master in library nests divider, i find that hard to believe."* → plan 2.10 |

## Icon masters — 2026-11-07

| # | Item | His point |
|---|---|---|
| 19 | KeylineGuide | Should go to the utility page (the private `_Doc parts` page): it is a drawing aid, not an icon. → plan 2.14 |
| 20 | Identity section | Identity *icons* belong on Icon masters, but the identity *set* (the marks, logomark and favicon system) does not. → plan 2.14 |

## Atoms and Molecules, round 2 — 2026-11-07

His read: *"I could go through every single instance, but I think the point remains."* The common cause: masters are drawn as loose frames instead of nesting the components the code nests. Every Molecules phase must check its masters against the code's imports.

| # | Component | His point |
|---|---|---|
| 21 | Slider base | Missing from Atoms. Slider *"tries to be everything"*, with no nested parts: no slider base and no input. Its frame is a long list of opacity values. → plan 2.12 |
| 22 | Slider range | No range (two-thumb) slider, unlike v4's Sliders page. → plan 2.12 |
| 23 | QuantityInput | Off: it doesn't hug its width. Is it the float variant, and if so where is the regular one? → plan 3.1 |
| 24 | SearchInput · PasswordInput | Neither nests the basic Input atom. The 13/18 type sits vertically off-balance. SearchInput has no sm or lg style. → plan 3.1 |
| 25 | FieldPair · InlineAddRow · LinkAddRow | None of them use Input. → plan 3.1 |
| 26 | AccountForm | Doesn't use Input or the Button component. → plan 3.1 |
| 27 | Rail | Uses no components: no SettingsRow, no LabeledControl. → plan 3.2 |
| 28 | DocsToc | Uses only TocRow. The float variant uses no components at all. → plan 3.2 |
| 29 | List | Shows no levels and is weak (kind disc/number, level 1/2 only). → plan 3.2 |
| 30 | ShareButtons | *"why is this a component?"* → plan 3.3 |
| 31 | RightRail | Uses none of the code's row parts (shell-nav-item, shell-nav-items, shell-nav-group-header, shell-nav-group, shell-rail-stack-inner, shell-sidebar-toggle, rail-section). → plan 3.2 |
| 32 | RightRail vs ShellSidebar | Is ShellSidebar the left rail? Why aren't left and right one component with a side variant, built from components? → plan 3.2 |
| 33 | FoldedHead | Doesn't nest Button, and seems redundant. → plan 3.3 |
| 34 | SectionCardItem | Its header (title + icon) doesn't nest a component. Is that what IconFrame is for? What is IconFrame's purpose, just padding the icon? The code uses the icon loader, which has no Figma component. → plan 2.13 |
| 35 | ContentCard | In code it is one TextSection plus an image placeholder. Figma shows nothing like that. → plan 3.3 |
| 36 | ContentRow | Same issue as ContentCard. → plan 3.3 |
| 37 | PageHeader | Missing styles. PageHeader/float is missing its meta row. → plan 3.3 |
| 38 | LinkPreview | *"is what?"* → plan 3.3 |
| 39 | CodeBlock | What is `bare` true/false for? → plan 3.3 |
| 40 | QuickLookHeader | Its float variant is totally different from the other. Should it be a modal header? Are both the eyebrow and mono variants needed just for a font change? → plan 3.3 |

## Molecules, round 3 — 2026-11-07

His read: *"I could go on, but I think you can just log this for now."* The common causes again: parts drawn instead of nested (headers, labels, text blocks as loose frames), components that exist only to restyle another, and float vs default drawn inconsistently.

| # | Component | His point |
|---|---|---|
| 41 | MenuPanel | `sheet` true/false only changes the radius (20 vs 8) and inset (6 vs 4) on float. A whole prop for a radius; it should go (one float menu radius). Code change first (MenuPanel loses `sheet`, MenuMore's 9 call sites). |
| 42 | MenuDivider | A whole component for a literal rule. Why not nest the regular Divider? Why reinvent it here? |
| 43 | MenuFlyout | Messy: the float open variant's nested panel overlaps the row text. |
| 44 | Menu family | 17 menu components is *"a bit nuts"*. |
| 45 | DocsToc | Its In use is an entire brand-guide chapter. *"Insanely stupid."* |
| 46 | RightRail | A mess: the Component and In use blocks overlap each other. |
| 47 | ShellSidebar | Why is every RailSection wrapped in a `shell-nav-group` frame? |
| 48 | shell-sidebar-toggle | Why is it not a component? |
| 49 | ActionButton | Is this the copy/check icon? Then what does fxr's Home use, the thing he has been calling "action button"? |
| 50 | LinkPreview | Doesn't use ContentMedia or ContentText (which he understood as the text section). |
| 51 | PageHeader | Why does it exist if SectionText already ships a Page variant? |
| 52 | Modal family | There is common ground across modal overlays: Modal (bordered, lift, float), QuickLookFrame, Card (20 radius), the other card instances. Headers are not components so they don't read as headers; SectionHead is in only 2 of 5 Card variants; radii 28, 20 and 4 coexist. Figma's own modal header is the model. ProjectCard's "header" is not a component either. |
| 53 | Modal prompt | The wrong input in the grey (lift) variant. |
| 54 | BlockSwatch · Swatch · labelled tiles | Their text labels are disconnected divs instead of a text component. |
| 55 | LiveCard | Needs fixing: the badge row is offset outside the card, and its parts are loose frames, not components. |
| 56 | Print kit | Does it belong in the library? Why not in brand? |
| 57 | Tier | How are Timecode, ZoomReadout, SceneBreadcrumb, FooterStrip, Breadcrumb, CanvasHint, DataStatus, SummaryLine, NoticeBanner, EmptyState (and more) not atoms? |
| 58 | Dialog (float) | The two dropdowns with titles are a LabeledControl, which isn't used. QuickLookHeader doesn't read as a header (Figma's does): too much padding and no clear split. The header should have its own padding, the content its own, then auto-layout them together, not one auto-layout for everything. |
| 59 | Dialog (settings) | The header is not a component; there's a weird border and a new 16 radius. The main content is weird: inputs with sliders broken. The primary button is primary on primary, so invisible. It should be float but uses regular buttons. "Live preview" toggle with text is a LabeledControl. Needs work. |
| 60 | SettingsGroup | Should use LabeledControl and doesn't. All SettingsSliders are broken; no Input shown, just raw text. |
| 61 | SettingsGrid | Broken. Its SettingsToggle is a component here and should have been used in the Dialog. None use LabeledControl. The outline style is wrong. |
| 62 | SettingsSlider · SettingsToggle · SettingsCell | Same problems as SettingsGrid. |
| 63 | SettingsSegmented | Labelled float but doesn't use float. |
| 64 | SettingsSelect | Just a Dropdown wrapped, with no change. |
| 65 | SettingsRange | Broken, and the border is wrong. |
| 66 | SettingsText | Not float. |
| 67 | SettingsPoint | Not float; the border is wrong; no Input. |
| 68 | SettingsRampHead | How is this a molecule? It should be an atom. |
| 69 | SettingsRamp | Uses no LabeledControl, Input or Dropdown. Fully broken. |
| 70 | SettingsDisclosure | Doesn't use the icon component. How is it not an atom? |
| 71 | SettingsFieldMap | Should be inside LabeledControl; bad component, maybe not a molecule. |
| 72 | SettingsLights | Uses nothing: no LabeledControl, Input or Button. The "+" in "+ Add light" is text, not an icon. |
| 73 | Media parts | Same problems; MediaLibrary/settings is not even rows or auto-layout. *"Not even worth reviewing, it's so far out of the norm."* |
| 74 | Site parts | Same: the frames overlap and are drawn. IndexCard at least exists and is used in DocumentIndex/group. section-text is named but not a component. |
| 75 | VariantsControl | Doesn't make sense to him: a trigger over a popover of axes with a stray inverted tile. |
| 76 | AppItemRail/row | How is this a molecule? |
| 77 | Knob | Why is it needed? If it is, why doesn't it use a base component instead of a circle and pointer? It has 21 value rows per size. |
| 78 | Split button vs ButtonGroup | The split button's chevron cell uses sunken; ButtonGroup's selected cell uses inverted. Why the difference? |
| 79 | SplitToolButton | Wrong colour set (the active tile is white with an invisible glyph). |
| 80 | Dropdown | Doesn't use Button. Its chevron icon says size 12 but renders 6 × 6. |

## Organisms — 2026-11-07

His read: *"blabla bla. you get what im saying"* — the same causes as Molecules (drawn parts, no shared bases, wrong tier, modals not built on one modal).

| # | Component | His point |
|---|---|---|
| 81 | CanvasStudio | Should it be an atom? → plan 4.2 |
| 82 | DeckFile · DeckSettings | Primed to sit in a modal; they are drawn as loose panels. → plan 4.3 |
| 83 | AppHub/header-actions | Makes no sense: two IconLoaders in drawn boxes. → plan 4.3 |
| 84 | MediaLibrary/modal | The wrong modal (not the shared modal shell). → plan 4.1 |
| 85 | MediaLibrary/browser | Broken: nested `clip` frames all the way down, no entries. → plan 4.1 |
| 86 | Overlay | Is it an atom? → plan 4.2 |
| 87 | DeckEditor/present | Broken, makes no sense. → plan 4.3 |
| 88 | AppItemRail | Why is there no shared base between the rails? → plan 4.1 (code finding) |
| 89 | VariantsControl | What is this? Two trigger tiles and a stray popover. → plan 4.3 |
| 90 | SettingsPanel | Another rail? → plan 4.3 |
| 91 | ShortcutsOverlay | A modal? It isn't built on one. → plan 4.3 |
| 92 | Float calendar + reader | Are these all organisms? Many overlap with molecules. → plan 4.2 |
| 93 | FloatActionMenu | Broken: invisible glyphs on the white tiles, the open card's rows misaligned. → plan 4.4 |
| 94 | ProgressDock | Doesn't use the slider base. → plan 4.3 |
| 95 | Decks + media | He asks why the deck frames would move to the presentation file at all — answered 2026-11-07: by the rule (only the deck tool uses them); his call whether to move. → plan 4.6 |

## Round 4 — 2026-11-07

| # | Component | His point |
|---|---|---|
| 96 | LabeledControl | Fundamentally wrong: it should be just the label (+ hint) and a slot, with `inline` false/true and the label width. Today the set bakes controls in as variants (slider, colour field, radio dots, input, dropdown), and the value box beside the slider is a drawn frame named "control", not an Input. Code: LabeledControl renders only label + children; the value box is Slider's own `<Input>`. |
| 97 | LabeledControlSection | Needed: it is how the Labs rails, the settings rail and SlideInspector are built in code (`SettingsPanel.jsx` — an uppercase header over LabeledControls; also exported as `RailSection`, with `SettingsRow` as `RailRow`). Figma has frames *named* LabeledControlSection, not a component. Build it; its rows are LabeledControl instances; settle the clash with the Figma RailSection/RailRow, which were built from the workshop nav under the code's alias names. |
| 98 | Dropdown | The chevron draws ~6 × 6 while the layer says 12: a frame named "icon", not an IconLoader instance. Code: IconLoader at the indicator ladder (xs 8, sm 12, md 14, lg 16). Dropdown also doesn't nest Button (issue 80). |
| 99 | The nesting check | Cause of 96–98: the check matched layers by NAME, so frames named after a component passed as instances. It must check component keys; re-run over Atoms, Molecules and Organisms. |

## Held in the library until fixed — 2026-11-07

His ruling: *"nothing can leave here in this state."* These may move to their family files once they are fixed:

| Master | Would move to | Frame |
|---|---|---|
| SlideInspector | presentation--kol-ds-ui | https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1391-13638 |
| DeckFile | presentation--kol-ds-ui | https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1391-13730 |
| DeckSettings | presentation--kol-ds-ui | https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1391-13758 |
| SlideRenderer | presentation--kol-ds-ui | https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1391-13805 |
| DeckEditor/present | presentation--kol-ds-ui | https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1391-13853 |
| Timeline (the design editor's keyframe timeline) | editor--kol-ds-ui | https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1365-11879 |

## Code findings — where his expectation needs a code change first

Figma mirrors the code, so these stay as they are in Figma until the code changes (found while building W3–W4, 2026-11-07):
- SearchInput and QuantityInput don't render Input; QuantityInput's arrows are inline SVG, not Icon.
- Rail renders no SettingsRow or LabeledControl — its rows are the host's children.
- RightRail and ShellSidebar are two components, no shared `side`.
- PageHeader doesn't pass SectionText's `meta`, so PageHeader/float has no meta row.
- DocsToc's list look writes `.shell-nav-item` anchors by hand instead of a row component.
- NavRail has three different row implementations (site sidenav row, the Button-nav row, NavRailFloat's 44 item) and none uses the workshop RailRow — the "no shared base between the rails" (issue 88) is in code.
- No shared modal component in code: ModalShell exists in Figma only (QuickLookFrame, Dialog float and Modal float nest it there).
- `Tag` in the dashboard cards and TreeRow is a local `const Tag = 'button' | 'div'`, not the Tag atom.
- MenuPanel `sheet` only changes radius and inset (issue 41).


- **SourcesReferences (2026-11-07):** the link arrow is a text character `↗` (`packages/content/src/SourcesReferences.jsx:28`), not an IconLoader arrow; Figma mirrors the code.
- **Home (W5.3, 2026-11-07):** phone sign-in box is 340 in a 358 container, left-aligned — 18px off-centre; HubHome and HubSettings say `taxonomy-ok: organism` while the taxonomy calls page arrangements Modules (Figma puts them on Modules); SettingsShortcuts truncates "EXPAND / COLLAPSE THE RAIL" on desktop; studio-hub's Filters switch does nothing until the settings page is on, and its tier state resets on reload. Figma sample text "Wrong email or password." is the agent's — no caller passes an error string.
- **Tone `accent` (W5.2, 2026-11-07):** Figma's tone collection gained an `accent` mode for PropertyRail's Generate button; the code has no such tone — it reaches the look with `tone="primary"` plus an accent override. Either the code gains `tone="accent"` or the Figma mode goes.
- **Rails (W5.2, 2026-11-07):** `RailSection` / `RailRow` name two different components (kol-component aliases of LabeledControlSection / SettingsRow, and kol-workshop's own); `InspectorRail` renders no rows and FloatCompose imports design-editor's own copy (the kol-component one is showcase-only); the inventory files Rail and the rail kit under Molecules while the taxonomy and RailKit.jsx say organism; Figma `AppItemRail` has no code export.

## References — the modal

Figma's own modals, his model for the shared modal shell (plan 4.1):
- Figma's account modal (row 52's reference): a header row of tabs + close, its own padding, a rule, then the body.
- Figma's "Move file" modal: `_files/ref-figma-modal-move-file.png` — header (title + close) with its own padding and a rule under it; a search field band; a tab row (Suggested · Starred · All); the list body; a footer band with Cancel and the primary action, separated by a rule. Each band has its own padding; the bands stack.


## Known before (other pages)

- **Buttons:** the split button has a border and breaks at lg; ButtonGroup is incomplete; one `_Button/bare` instance remains on Atoms. See `plan-2026-11-06-buttons-page.md` W3.
- **Atoms build:**
  - Charts tier: the inventory says molecules, the code's classification says atoms.
  - A logomark duplicate sits in Icon masters.

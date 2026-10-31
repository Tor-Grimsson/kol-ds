# Plan — One menu engine

**Raised:** 2026-10-31, kol-ds-ui session (metric's sites dropdown → "is there a system or is this reinventing the wheel?"). Wireframe: Figma proxy--components `3:2` (https://www.figma.com/design/zzzb4WqmCsDTPlP95Weo2M/proxy--components?node-id=3-2). Points verbatim:
- P1 "this dropdown changed tone when list appears [bug]" · "some werid bastardisation of multiselect with illegal icons and multiple opactiy styles"
- P2 "showcase doesnt give us tone to apply. and mutli select aligns to the wrong side. and is a mess in genearl. I see no difference in the 3 variants."
- P3 "I want the end result to be that CONTROLS have a set home on showcase, and apps/controls is a pnpm controls reference of how they work and behave. I want to unify the stray components"
- P4 "typeed out random icons" (✓ › and a K cap drawn as text)
- P5 "mutliple clashing styles in one component — different paddings, alignment off, differnt opacity[ink] and hacky look" (the showcase column picker)
- P6 "random unapproved element appear otu of nowhere [command S]" (⌘S in a File menu)
- P7 "I like this kind of indicators more — simple" (the rail's • beside the current row)

**Status:** GO 2026-10-31 (user: *"if you are good to go then /kol-goal /playbook go!"*). Built ahead of the plan: `tone="faint"` (oq-06) with `variant="raised"` on the retirement ledger; Dropdown `multiple` + SettingsMulti on it; metric's sites + gear on a `kol-tone-faint` wrapper. Unpublished. Open: everything below.
**Shape:** W › phase › list.
**Laws carried:** `variant` is the only word for a look; a tone sits on a wrapper and controls inherit it; icons and glyphs take oq-*, never fg; no borders without his approval; family-prefix naming (Menu*); a look/API change lands in the Figma library the same turn; retired = alias on the 30-day ledger; say preview, never demo.
**How a phase closes:** measurable acceptance line first, gates green, then Playwright against his own words; motion on a recording.

---

## W1 — Menu is the only engine

### 1.1 — One panel, one tone path, one alignment rule (P1, P2) — ✅ built 2026-10-31
- `Menu` owns the panel: tone inherited from the trigger's wrapper (Dropdown's ambient copy moves here), `align="start" | "end"`, `fused` for a select trigger.
- `.kol-menu-panel` and `.kol-dd-panel` become one rule; the loser retires to the ledger.
- **Acceptance:** in metric and showcase, every open menu's panel `background-color` equals its trigger wrapper's `--kol-tone-panel-bg` (0 mismatches across all menus on the page); a menu with `align="end"` has its panel's right edge within 1px of its trigger's right edge.

### 1.2 — Trigger is a slot (P3) — ✅ built 2026-10-31
- Four triggers, one prop: `chip` (MenuTrigger), `select` (value + caret, list fused below), `icon` (⋮), and none (ContextMenu at the pointer).
- **Acceptance:** `Dropdown`, `SettingsMulti`, `MenuFilter`, `MenuDatePicker`, `MenuMore`, `ContextMenu`, `MenuItem` and `MultiSelect` each import `Menu` and nothing else from `utilities/Popover.jsx` (grep count of `usePopover` in those files = 0).

### 1.3 — Dropdown and the columns picker rebuilt on Menu (P2, P5) — ✅ built 2026-10-31
- `Dropdown` = Menu + select trigger (+ `multiple`); public props unchanged.
- `MultiSelect` (pick-one columns) = Menu + `columns`; same paddings, row height and ink as every other menu. Name is TALK (it is not a multiselect).
- **Acceptance:** in the column picker, every row's left padding, height and label color equal a Dropdown row's at the same size (3 computed-style comparisons, 0 diffs); its panel aligns to the trigger's start edge.

### 1.4 — Popover menus folded in — ✅ built 2026-10-31
- Found 2026-10-31: `SplitToolButton` (tool-rail split button) is an eighth engine — its typed ✓ is the dot now; engine swap follows. `design-editor` BindDot's typed ✓ waits on the ParamBindDot ticket.
- Found 2026-10-31: `Combobox` (input trigger, typed filtering) is a seventh engine; its panel is on the fused menu panel, its engine swap follows the rest.
- `ContextMenu`, `RowMenuButton`, `MenuItem` (menubar) become Menu with their anchor; `AppItemMenuProvider` moves off `MenuDropdownItem`.
- **Acceptance:** `grep MenuDropdownItem packages/*/src` outside the alias line = 0.

## W2 — Row indicators: one approved set (P4, P6, P7)

### 2.1 — Indicators are a closed set, never typed text — RULED 2026-10-31 — ✅ built 2026-10-31
- The cause: `MenuRow`'s `shortcut` slot takes any node, so callers type ✓ › ⌘S as characters.
- Ruling (user 2026-10-31: *"its mainly about using real icons, not typed symbols"* · *"• replaces ✓ for single picks, definitely"*): all kol-icons on oq-*. Single pick (current value) = • dot; multi pick (on) = check icon; opens = chevron icon; key = `Kbd`.
- Rows take `indicator="dot" | "check" | "chevron"` and `kbd`; the free `shortcut` node retires.
- **Acceptance:** across all apps, 0 menu rows whose trailing slot renders a text node matching `[✓✔›⌘]` (DOM scan on each app's menus).

### 2.2 — No element a caller did not ask for (P6) — ✅ built 2026-10-31
- Shortcut hints show only when the caller passes `kbd`, rendered as `Kbd`; nothing appears by default.
- **Acceptance:** a Menu with no `kbd` on any row renders 0 `.kol-kbd` nodes.

## W3 — Controls have a home (P3)

### 3.1 — showcase Controls SET + `/controls` — ✅ built 2026-10-31
- Controls get a SET in showcase (user: *"in showcase controls also get 'SET' which is a type of homespace for related elements"*) — `showcase/src/sets/`, beside the existing sets.
- One page per control (Select, Multiselect, Filter, Date picker, More, Picker, Context menu); every preview carries tone, align and size pickers.
- **Acceptance:** each menu control's preview has a tone picker (and align where the panel floats — a fused select has no side), and changing tone changes the open panel's background (Playwright).
- Built 2026-10-31: `sets/controls.jsx` mounts `apps/controls` as is (the Overlays pattern); previews take `tones` (CONTROL_TONES, faint included) and `aligns` through a wrapper.

### 3.2 — `apps/controls` is the behaviour reference — ✅ built 2026-10-31
- `pnpm controls`: open/close/dismiss, keyboard, multi keeps open, align, tone inheritance — each as a live case.
- Decided on his go: it keeps Parametric, App controls and Compositions and gains a Menus page — one specimen per behaviour, each with a `does` caption, plus tone-from-the-wrapper.

### 3.3 — The 3 identical variants (P2) — ✅ built 2026-10-31
- Cause: MenuItem's preview fed the panel offset (4 · 0 · -2) into the variant picker. Not a look; removed.
- Find the preview whose three variants render the same and fix the cause.
- **Acceptance:** each listed variant produces a computed-style diff from the others on at least one property.

## W4 — Publish, migrate, mirror

### 4.1 — Publish and move consumers — ✅ published 2026-10-31: kol-theme 0.210.0, kol-component 0.330.0, kol-styleguide 0.20.0, design-editor 0.24.0; kol-website told by the user
- kol-theme + kol-component published; kol-website's metric gets `kol-tone-faint` on its sites wrapper and the bump (lobby ticket).
- **Acceptance:** registry shows the new versions; metric.kolkrabbi.io's sites trigger and open panel compute the same background.

### 4.2 — Figma library — ✅ built 2026-10-31
- `oq/06` added to the color collection (matches kol-opaque to 4 decimals); `faint` mode on the tone collection; Dropdown `variant=raised` ×3 moved to _trash; MenuRow (273:323) gains `dot`; `figma/MenuRow.figma.js` + `Dropdown.figma.js` updated (the MCP Code Connect API is refused on this plan — the repo files are the mapping).
- `faint` in the tone collection; the Menu component set rebuilt from the code (trigger slot, panel, row indicators).
- **Acceptance:** the library's tone collection lists `faint` = oq-06; each Menu variant's Code Connect points at its source file.

## W5 — One look on the one engine — TALK
- Raised 2026-10-31 (user, on the controls Menus page: *"different dropdown relative to button radius … you still have both styles, you didnt unify them"*; then *"its fine. then nothing breaks at least"*).
- Two row looks remain: the Menu family's (38px, oq-16 fill on hover AND on the current row) and the select's (the trigger's height and face, no fill). Two panel radii: 8px floating vs the trigger's radius-sm.
- His call before anything is built.

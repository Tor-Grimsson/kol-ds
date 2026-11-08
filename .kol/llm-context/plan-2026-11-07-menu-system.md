# Plan — The menu system: one MenuList

**Raised:** 2026-11-07, his review of ↳ Molecules (Menu family): *"MENU SYSTEM IS FUCKED … route them all into MENU-LIST and that goes into dropdown ONCE … figure out BEST PRACTICES"*; WorkspaceSwitcher *"is a button"*; MoreSheet header *"yes"*.
**Status:** W1–W3 ✅ built 2026-11-07 (kol-component 0.348.0; Menus section = MenuRow, MenuList, Menu, Dropdown, MoreSheet, PanelsMenu + header). Open: W4, W5 — DRAFT.
**Shape:** W › phase › list.
**Laws carried:** nesting = code imports; Figma follows code (fix code first where they differ); one writer per Figma file; masters on tier pages; doc frame template = ↳ Atoms (his hand layout).
**How a phase closes:** acceptance numbers first; gates green; I look at every frame at readable zoom against the code before he sees it.

## Best practice (Radix / Ariakit / WAI-ARIA, and what the code already half does)

Every menu is three layers, and only the middle one is a "menu":
1. **Trigger** — a Button (any variant). Never its own component.
2. **MenuList** — the rows: MenuRow · MenuLabel · MenuDivider; a row with `items` opens a sub-MenuList (flyout). Same list for actions (menu) and choices (select = check/dot indicator).
3. **Surface** — PopoverPanel, anchored to a trigger, a point (context menu) or fused to the trigger (select).

Everything else is a *preset* — data fed to those three — not a component. The code already has the engine (`Menu` = trigger + items, `Dropdown` = a fused Menu); it lacks the named list part, so Figma grew 15 look-alike masters.

## W1 — Code: one named list — ✅ built 2026-11-07

### 1.1 — Extract `MenuList`
- `MenuList` renders the rows from `items` (heading → MenuLabel, divider → MenuDivider, `items` → flyout); `Menu`, `Dropdown`, `ContextMenu` render it inside PopoverPanel. API of all three unchanged.
- Acceptance: one place renders rows (grep: rows mapped in MenuList only); every Menu/Dropdown/ContextMenu call site renders as before.

### 1.2 — Parts fixed in code
- MenuDivider renders the Divider atom (oq-08). WorkspaceSwitcher drops its own WORKSPACE label — it is a Dropdown (a button); callers wrap it in LabeledControl. `MenuPopover` (story-only alias) retires.
- Acceptance: 0 bare `border-t` dividers in menus; WorkspaceSwitcher call sites pass their label through LabeledControl; publish kol-component.

## W2 — Figma: the three layers (↳ Molecules › Menus) — ✅ built 2026-11-07

### 2.1 — The parts
- MenuRow — one row, all states (rest · current · disabled · danger) × indicator (none · check · dot · chevron) × default/float; hug width; icon and kbd at the ladder size. MenuLabel. MenuDivider nests Divider.
- Acceptance: one MenuRow set; every state labelled in words; nesting check 0 fakes.

### 2.2 — MenuList
- Vertical slot of MenuRow / MenuLabel / MenuDivider instances; variants default · float · sheet (20 radius, 6 in).
- Acceptance: MenuList exists once; it holds only part instances.

### 2.3 — Menu and Dropdown
- Menu = trigger slot (a Button) + PopoverPanel holding ONE MenuList; open/closed. Dropdown = Button (its own trailing chevron, ladder size) + the same MenuList fused under it — standard and float built identically.
- Acceptance: Menu and Dropdown each contain exactly one MenuList instance; open variant on the grid.

## W3 — Presets out of the master list — ✅ built 2026-11-07 (plus MenuLabel/MenuDivider folded into MenuRow `type`: 4 menu masters)

### 3.1 — Retire the look-alikes
- MenuItem, MenuTrigger, MenuPanel, MenuFlyout, MenuFilter, MenuDatePicker, MenuMore, ContextMenu, AccountMenu → no masters. Each is shown once as a Menu instance with its content in Menu's doc frame (the "presets" row). Old masters → `_trash` after their instances are swapped.
- Acceptance: menu-family masters 15 → 6 (MenuRow, MenuLabel, MenuDivider, MenuList, Menu, Dropdown); 0 instances of retired masters outside `_trash`.

### 3.2 — Sheets and buttons
- MoreSheet's top becomes the standard header component (avatar row), reusable; PanelsMenu is the same sheet (header + rows with buttons). WorkspaceSwitcher → Buttons family as a Dropdown preset, no label.
- Acceptance: one header master used by MoreSheet and PanelsMenu; WorkspaceSwitcher has 0 text labels of its own.

## Order
W1 (code, publish) → W2 → W3. One Figma writer. I show him the Menus section after W2 before W3 starts.

## W4 — ✅ built 2026-11-07 (kol-component 0.349.0, kol-shell 0.116.0; Figma set 1625:8555) — ModalHeader: one header for every floating surface (his ruling 2026-11-07: *"we need to implement headers … specially when we get to modals"*; name his: *"why not just modalheader?"*)

### 4.1 — Code: extract `ModalHeader`
- The avatar row MoreRows draws (avatar · title) becomes `ModalHeader` (molecule): `title`, optional `avatar`/`icon`, optional trailing actions (close). MoreRows (MoreSheet) and PanelsMenu render it; PanelsMenu's plain title becomes a ModalHeader with no avatar. Publish kol-component.
- Acceptance: one header implementation (grep: 0 hand-built header rows in MoreRows/PanelsMenu); both call sites render as before apart from PanelsMenu taking the shared look; esbuild of all call sites passes.

### 4.2 — Figma: SheetHeader becomes ModalHeader
- Rename the Figma `SheetHeader` master to `ModalHeader`, variants avatar · icon · none, Code Connect to the new export; MoreSheet and PanelsMenu use it (PanelsMenu with avatar off, matching code). This is the header the modal work builds on.
- Acceptance: 1 ModalHeader master; 0 SheetHeader names left; PanelsMenu frame matches its live render.

## W5 — ✅ built on Atoms + Molecules 2026-11-07 (Organisms/Modules on their template pass) — The doc-frame link reads short (his point: long showcase URLs are cut off in the 360 column)

### 5.1 — "View in showcase"
- Decided for review: the Resources link in `_Header` reads **View in showcase**, hyperlinked to the component's full URL (ui.kolkrabbi.io/components/<name>). One short label on every frame; the column stays 360 and nothing wraps or clips.
- Acceptance: every `_Header` instance's link text = "View in showcase" with a URL hyperlink set; 0 clipped-text warnings in the header on Atoms, Molecules, Organisms, Modules.

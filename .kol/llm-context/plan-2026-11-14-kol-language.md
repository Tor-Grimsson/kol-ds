# Plan — agents speak KOL; the Folio map in KOL's words

**Raised:** 2026-11-14, user. Points verbatim: *"these are not atoms. these are not even atom names, no atom is called 'done'. a 'tool' is not an atom, a tool is a function that an atom represents in a particular ui view"*; *"in Kol there are 2 styles, default style (the old style) and float style … For this translation to work we need to map out what we have and what we need. THEREFORE we need to use common language"*; *"you keep telling agents but you dont make sure the agent knows anything"*; *"change kolds to /kol-ds … claude-kol-ds should also /kol-ds-claude"*.
**Status:** BUILT 2026-11-14 — W1 (skills renamed, agent step 0) and W2 (Parts 504:1663 by KOL component, 49 parts; table 516:542, 49 rows). Open: StatusStrip and ReaderBar missing from 01-inventory.md.
**Shape:** W › phase › list.
**Cause:** agents were briefed with record's code as the naming source and never loaded the KOL orientation, so they named functions (Done, Tool) instead of KOL components.
**Laws carried:** never rm (renames move, old names to nothing); kol-figma LAW; the taxonomy doc (`docs/documentation/03-components/00-taxonomy.md`) and inventory (`01-inventory.md`) define the levels and names; plain frames on the web-style page.
**How a phase closes:** acceptance line first, one check at the end.

## W1 — Every agent starts in KOL (P: "you dont make sure the agent knows anything") — ✅ built 2026-11-14

### 1.1 — `kolds` → `kol-ds`
- Rename the skill folder in `~/.dotfiles/claude/skills/` and its `name:`. Update: 26 packages (was 15), the two styles (default, float) and where each style's components live (code packages + the Figma library), pointers to the taxonomy and inventory.
- Acceptance: `/kol-ds` loads; package list equals `ls packages/`; 0 references to `kolds` left.

### 1.2 — `claude-kol-ds` → `kol-ds-claude`
- Rename the same way. The taxonomy and inventory become always-read (drop "if the task touches components"); add the two styles and the Figma library file.
- Acceptance: `/kol-ds-claude` loads; 0 references to `claude-kol-ds` left.

### 1.3 — The Figma agent loads both
- kol-figma-agent's step 0: load `kol-ds-claude`, then `kol-figma`. Every brief names parts by KOL component, never by the source app's names.
- Acceptance: the agent definition's step 0 lists both skills in that order.

## W2 — The Folio map in KOL's words (P: "we need to use common language")

### 2.1 — Parts by KOL component
- Every part in the Parts section (504:1663) renamed to the KOL component it is, levels per the taxonomy doc. Done, Tool, Action → `Button` (its variants); Field → `Input`; Choice trigger → `Dropdown`; Mode switch, Seg → `SegmentedToggle`; Tab → `TabsRow`; Tree row → `TreeRow`; Menu row → `MenuItem`; Icon → `IconLoader`. Duplicates collapse to one part with its variants. The Folio name stays as a note on the part, not its name.
- Acceptance: every part name is in `01-inventory.md`, or the part is marked MISSING; 0 function names (Done, Tool, Action) as part names.

### 2.2 — The table in KOL's words
- Table frame (516:542) columns: level · KOL default component · KOL float component · exists / MISSING · Folio example.
- Acceptance: one row per part in 2.1; every MISSING row named.

## Order
W1 (1.1 → 1.2 → 1.3) first, then W2 with one kol-figma-agent that has loaded both skills. Nothing published.

## W3 — Draw it, don't name it — ✅ built 2026-11-14 (table 516:542, 48 linked instances) (P: "its impossible for me to know if the figma doesnt draw it"; "either screenshot it or put in figma stop talking about componentts in text")

### 3.1 — Find & replace drawn open
- The open bar (record EditorChrome `FindBar`: Find field, count, previous, next, Match case, Replace field, Replace, Replace all, close) as a part in Parts, beside the Find & replace button.
- Acceptance: the part is in the Parts section, every control of the code present, and in its table row.

### 3.2 — Every table row shows the component
- Each row of the table (516:542) carries the KOL component itself: a library instance (❖ library--kol-ds-ui) of the default component and of the float component beside the Folio piece. A missing side is an empty, labelled slot.
- Acceptance: every row with "exists" holds a linked library instance per existing side; 0 rows that are names only.

### 3.3 — Float-only rows drawn
- The six float-only rows (tree row, chapter row, menu bar, document header bar, status bar, reader bar) show the float instance and an empty labelled slot for the default style.
- Acceptance: 6 rows, each with a float instance and an empty default slot.

### 3.4 — Wordmark and ruler corrected
- Wordmark: not missing; its row shows the `VectorLoader`-drawn wordmark from the library. Ruler: its row shows the design editor's canvas ruler beside Folio's page ruler, marked "extend".
- Acceptance: MISSING list = Find & replace bar only (plus anything the instances reveal); ruler row marked extend.

## W4 — The table, checked row by row — ✅ built 2026-11-14 (table 540:4456; rows re-checked by me, 6 fixed) (P: "im 4 items down the list and already 3 issues … am I really continuing before you adress sloppy work?")

### 4.1 — Every row correct
- Each Folio cut sits in the row of the component it is ("button with chevron is obviously a dropdown, not button"). Every float-column instance is set to its real float variant ("you hadnt set badge to float"). Default instances are the default variant; instance names equal their component.
- Acceptance: all rows checked against the inventory and each instance's properties; every correction listed in the report; 0 float-column instances on a non-float variant.

### 4.2 — A literal table (P: "a literal TABLE would be better so its clear what is component and what is a fucking text string")
- Header row plus a cell grid with 1px rules. Columns: Level, Default name, Default, Float name, Float, Status, Folio, Folio name. A component cell holds only the instance; every string sits in its own text column.
- Acceptance: 0 cells mixing an instance and a string.

### 4.3 — Find & replace dialog, built (P: "why add find replace dialog row marked missing when you can just actually make it based on other modals?")
- Built from the existing modals in both styles: default from the library's modal (ModalShell, ModalHeader) with Input, toggles and a ButtonGroup; float from the same parts' float variants. Fields per record's FindBar: Find, Replace, Match case, count, previous, next, Replace, Replace all, close. Library instances composed in a frame, no new component.
- Acceptance: 2 dialogs drawn (default, float), every control linked to the library; its table row shows both and is marked exists.

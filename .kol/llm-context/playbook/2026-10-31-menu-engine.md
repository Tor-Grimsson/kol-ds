# Playbook — One menu engine

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** build `plan-2026-10-31-menu-engine.md` — Menu is the only engine, real-icon indicators, a Controls SET in showcase, apps/controls as the behaviour reference.

**Standing rules (non-negotiable):**
- real icons only, never typed symbols; • = single pick, check = multi pick
- tone sits on a wrapper; `variant` is the only word for a look
- public props of Dropdown / SettingsMulti / Menu* stay as they are; retired names go on the 30-day ledger
- a look/API change lands in Figma the same turn

---
## Entries

[21:51 · 2026-10-31] · setup · playbook created
  what → initialised the live playbook   why → user go: "/kol-goal /playbook go!"
  note → ahead of plan: tone faint (oq-06), Dropdown `multiple`, metric sites+gear on kol-tone-faint

[22:05 · 2026-10-31] · W1 · packages/component/src/molecules/Menu.jsx
  what → Menu is the engine: trigger slot, anchor {x,y}, align, fused, closeOnSelect, controlled open, tone copied onto the portalled panel
  what → Dropdown (fused select), MultiSelect (columns), MenuItem (menubar), ContextMenu (anchor) rebuilt on Menu; no usePopover left in them
  before → .kol-dd-panel + .kol-menu-panel   after → .kol-menu-panel (+ --fused); .kol-dd-panel kept as alias on the rule
  note → 7th engine found: Combobox (input trigger) — panel class moved to the fused menu panel; engine swap pending
  verify → showcase build ✓ · gates imports/roster ✓ · metric menus oq-08, sites oq-06, end-aligned panels flush, multi stays open ✓
[22:05 · 2026-10-31] · W2 · MenuItem.jsx MenuRow
  what → MenuRow `indicator` dot|check|chevron (kol-icons ascii-dot, check, chevron-right) + `kbd` (Kbd); string shortcut renders Kbd
  what → callers swept: single picks → dot, toggles → check, typed ⌘ keys → kbd; MenuDropdown* names gone from callers (aliases stay)
  note → apps/stylesheet untouched (kept as-is by ruling)
[22:17 · 2026-10-31] · W3 · showcase/src/sets/controls.jsx · apps/controls/src/pages/Menus.jsx
  what → Controls set mounts apps/controls as is; Menus page: 9 specimens with a `does` caption each
  what → PreviewCard gains an Align axis; menu control previews take tones (faint included) + aligns via a wrapper
  what → MenuItem preview's fake variants (offset 4/0/-2) removed — cause of "no difference in the 3 variants"
  verify → set renders 9 specimens ✓ · faint/grey/sunken panels match their wrapper ✓ · gates roster/imports/foundations/taxonomy ✓
  note → dot drawn as ascii-dot at 24 in the 14 slot (≈4.5px); a proper dot glyph would be an icon round for him
[22:21 · 2026-10-31] · W2/W4 · BindDot.jsx · SplitToolButton.jsx · Figma n48kE2bJtrFjl7wxst30xH
  what → last typed ✓ (BindDot, SplitToolButton) → the dot icon; source scan for typed ✓ › in menus: 0
  what → Figma: oq/06 variable, tone mode faint, Dropdown raised ×3 → _trash, MenuRow + dot; Code Connect files updated
  note → built a duplicate MenuRow/MenuPanel on the wrong page first — moved to _trash; the shipped ones were on 04-molecules (7:3)
  verify → showcase, metric, controls build ✓
  note → BLOCKED: W4.1 publish (npm publish denied this session)
[22:37 · 2026-10-31] · W4 · published kol-theme 0.210.0 · kol-component 0.330.0 · kol-styleguide 0.20.0 · design-editor 0.24.0

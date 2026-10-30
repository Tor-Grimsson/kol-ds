# WorkshopSettingsRailAndBars — kol-workshop takes studio-hub's settings rail and shortcuts modal, and its two top bars can hide

**Staged:** 2026-10-29 · from kol-hq (`site/`, the estate docs app on kol-workshop). User: *"studio-hub settings have tabs, shortcuts are also available there. S for shortcuts open shortcuts in this modal … this should be implemented on workshop as well"* · *"we need ways to show hide these both and individually"* · keys *"< top, > tabs, | both"* · *"I dont want any reinventions"*

## 1 — Settings: the hub's tabbed rail

### The problem
kol-workshop's `ShellLayout` opens its own settings panel (`SettingsPanel`), and shortcuts only exist in the `S` sheet. Studio-hub apps (mirror, AppHub) have a Settings rail with tabs: **Settings · Shortcuts · About · Docs**.

### The fix
- kol-workshop uses the hub's settings rail as it is: `kol-shell` `HubSettings` (the AppHub one), with its tabs. The Shortcuts tab lists the workshop's shortcut map.
- No new rail and no look of its own: the same component, the same look.

## 2 — `S` opens the hub's shortcuts modal

### The problem
In the workshop, `S` opens `ShortcutsOverlay` (a flat sheet). In studio-hub, `S` opens the command-style shortcuts modal: collapsible sections, ↵ Collapse, ⌘↵ Collapse all (`CommandOverlay`, as AppHub uses it).

### The fix
- The workshop's `S` opens the same modal AppHub opens, fed from the one `SHORTCUTS` map in `ShellLayout.jsx`. The map stays the single source, so the modal, the rail's Shortcuts tab and the key handler all read the same list.

## 3 — Hide the top bar and the tab bar

### The problem
The workshop has two bars above the content: the header (brand · title · search · settings · theme) and the space tab bar (`kol-hq` · `dotfiles` … with the rail toggles). Only the rails can be hidden (`[` `]` `\`).

### The fix
- **`<`** hides or shows the top bar, **`>`** the tab bar, **`|`** both. These are the user's keys.
- Each is also a switch in the Settings tab and a line in the shortcuts map. The state persists like `navHidden` / `tocHidden`.
- A hidden bar gives its height to the content and the rails.

## Definition of done
- [ ] Workshop Settings is the hub's tabbed rail (Settings · Shortcuts · About · Docs), in both themes
- [ ] `S` opens the hub's shortcuts modal in the workshop
- [ ] `<` `>` `|` hide and show the bars, listed in the modal and switchable in Settings
- [ ] published


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-framework 0.63.0 · kol-shell 0.89.0 · kol-workshop 0.42.0**.

**1 — Settings is the hub's rail.** AppHub's settings rail was inline in `AppHub.jsx`. It is now kol-shell's exported **`HubSettingsRail`**, lifted out as it was, and AppHub draws it unchanged (walked on studio-hub: Settings · Shortcuts · About · Docs, toggle and reset). `ShellLayout` opens the same rail on `,` and the gear in place of `SettingsPanel` and its Keys section. Its rows are typed (`type: 'switch'`), and the consumer's `settings` follow under Settings. A new **`app`** prop (`{ name, about, links, docs }`) feeds About and Docs, the same as AppHub's. Without it the rail shows Settings · Shortcuts. Reset puts the theme back to the system and the shell's settings back to their defaults.

**2 — `S` opens AppHub's modal.** `CommandOverlay mode="shortcuts"` over the one `SHORTCUTS` map, which also feeds the rail's Shortcuts tab and the key handler. `?` still opens it.

**3 — The bars hide.** kol-framework's `ShellHeader` takes `hideTop` and `hideTabs`. With both set, nothing is drawn. `<` toggles the top bar, `>` the tab bar, and `|` both (any bar showing hides both; both hidden shows both). They are in the map, they are switches under Settings › Layout, and they persist as `topHidden` / `tabsHidden` beside `navHidden` / `tocHidden`. The scroll region takes the freed height: its top went 114 → 49 (top bar hidden) → 0 (both) → 65 (tab bar hidden). `setPref` now merges onto the stored settings, so a rail key written straight to storage is never overwritten by a stale copy.

Walked in apps/workshop: `S` modal, the rail in light and dark, the three keys. Screenshots in `_tmp/2026-10-29-workshop-walk/`.

**Remainder at kol-hq:** `/bump` in `site/`, and pass `app` to `ShellLayout` for About and Docs.

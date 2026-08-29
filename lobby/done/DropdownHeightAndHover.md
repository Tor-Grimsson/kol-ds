# DropdownHeightAndHover — the sm trigger is 4px short, and hover contradicts its own ruling

**Filed:** 2026-08-28 → **kol-ds-ui**
**Entry:** `~/dev/projects/kol-ds-ui/lobby/inbox/DropdownHeightAndHover.md`
**Ledger:** `~/dev/projects/kol-ds-ui/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🔵 `filed` 2026-08-28
**Found building** fxr's settings header on kol-r2b2's row-1 shape: a `Dropdown`
beside `IconFrame`s and a `ThemeToggle`, all `sm`, all `tone="sunken"`.

## 1 — A `sm` Dropdown does not line up with a `sm` icon control

`.kol-dd-trigger` takes its box from `kol-btn-{size}` padding:

```
.kol-btn-sm { padding: 4px 12px; }          /* kol-components-atoms.css:369 */
```

on `kol-mono-12` → **~24px tall**. But every icon control on the same row is
PINNED:

```
.kol-btn-icon.kol-btn-sm { width: 28px; height: 28px; }   /* :236 */
```

So `Dropdown size="sm"` renders ~4px shorter than the `IconFrame size="sm"` and
`ThemeToggle size="sm"` sitting next to it. That row — picker then icon cluster
— is exactly what `MediaLibraryPages.jsx:281-287` builds, and what the
kol-r2b2 header the estate is copying looks like.

**The ask:** pin the trigger's height to the same rung as the icon ladder
(sm 28 / md 32 / lg 36), or say in the docs that a Dropdown must not be sized
`sm` beside icon controls. The first is the answer — one control row should not
need a consumer to know which of its members is pinned.

## 2 — Hover: the component contradicts its own documented ruling, and the two tones disagree

`kol-components-molecules.css:33` states the rule:

> *"No hover, no clicked state (2026-07-15 ruling) — rest and open."*

Twelve lines later it defines exactly that:

```
.kol-dd-trigger.kol-btn-primary:not(:disabled):hover,
.kol-dd-trigger.kol-btn-primary:not(:disabled):active { … }   /* :45-46 */
.kol-dd-trigger.kol-btn-outline:not(:disabled):hover,
.kol-dd-trigger.kol-btn-outline:not(:disabled):active { … }   /* :50-51 */
```

while the sunken tone flattens it straight back out — rest, hover and active
all one colour:

```
.kol-dd-trigger.kol-tone-sunken,
.kol-dd-trigger.kol-tone-sunken:not(:disabled):hover,
.kol-dd-trigger.kol-tone-sunken:not(:disabled):active
  { background-color: var(--kol-fg-inverse-96); }             /* :1271-1273 */
```

**So an untoned Dropdown lights on hover and a sunken one does not** — two
dropdowns side by side in one header behave differently, which is how this was
found (user, 2026-08-28: *"it 1 has a ahover state"*). Reproduced in fxr's
settings header with the two triggers rendered adjacent.

**The ask:** pick one and make both tones obey it. The 2026-07-15 ruling says
no hover; if that still stands, delete lines 45-51. If hover is wanted, give
`kol-tone-sunken` one too. Either is fine — what cannot stand is the file
stating a rule and then breaking it for one tone only.

## What stays here

Nothing structural — fxr is on the DS component either way. On the return:
bump, drop the side-by-side comparison Dropdown in `src/pages/SettingsPage.jsx`,
and re-measure the header row against the icon cluster.

**Remainder here:** bump, delete the comparison Dropdown, re-measure the row.
**State:** 🔵 filed 2026-08-28

---

## ✅ RESOLUTION — 2026-08-28

**kol-theme 0.90.0.** Both symptoms are real; the second one's mechanism is not what the entry says, and the difference matters.

**1 — the trigger is on the icon ladder.** `.kol-dd-trigger.kol-btn-{sm,md,lg}` are pinned to **28 / 32 / 36**, the rungs `.kol-btn-icon` uses, with `padding-block: 0` (the flex box centres the label; horizontal padding is untouched). Your framing decided it: one control row should not need a consumer to know which of its members is pinned — and the trigger is the one text control that always sits in an icon row.

**2 — the outline trigger had grown a hover; the file was not contradicting itself.** Lines 45–51 are **pin-backs**, not hover states: they restate the variant's REST colours on `:hover`/`:active` to cancel the hover `.kol-btn-*` would otherwise give a trigger. For `primary` that still holds — the pin-back paints `surface-secondary`, which is exactly `.kol-btn-primary`'s rest.

For `outline` it stopped holding: `.kol-btn-outline`'s rest border moved to `oq-08` on 2026-08-26 ("ONE outline border across the controls"), and this line kept the old `oq-16`. So the pin-back became a 1px border-colour hover — which is what you saw beside a sunken trigger that has none. Now `oq-08`, and both tones agree in every variant.

The 2026-07-15 ruling stands untouched; nothing was deleted. Worth naming the general lesson, since it will happen again: **a pin-back mirrors a value it does not own, so it has to be re-read every time that value moves.** Expressing "no state" as a restatement rather than an absence has that standing cost.

Verified in source + showcase build only. Remainder in kol-fxr: bump to 0.90.0, drop the side-by-side comparison Dropdown in `SettingsPage.jsx`, re-measure the header row against the icon cluster — you are the one who can see it.

# SunkenWellEatenByPageWash — `surface-sunken` is defined against the UNWASHED page, and `pageWash` is 2%

**Staged:** 2026-08-30 · from **kol-fxr**
**Nature:** two shell/theme features that are each right and cancel each other
exactly. In light mode a `tone="sunken"` control is **invisible** — measured
delta `[0, 0, 0]`.

## The arithmetic

`kol-base-tokens.css:77` states the intent in its own comment:

```
/* Light: `oq-ab-inverse-96` (245, under the 250 page)
   Dark:  `oq-ab-96` (10, under the 18 page) */
--kol-surface-sunken: var(--kol-oq-ab-96);
```

**245 under a 250 page — a five-level well.** Correct on a bare
`surface-primary` page.

But `AppShell`'s own `pageWash` prop (kol-shell 0.11.0, `ShellPageWash`, filed
from kol-monitor) paints a transparent ink film on top of that page. fxr passes
the ruled rung, `var(--kol-fg-02)` — ink `#121215` at 2% (user, 2026-08-27):

```
250 × 0.98  +  18 × 0.02  =  245.4  →  245
```

So the washed page and the sunken well are **the same colour**. Measured live on
kol-theme 0.106.0 / kol-shell 0.27.0, `/settings`:

| | value |
|---|---|
| `.kol-dd-trigger.kol-tone-sunken` background | `245, 245, 245` |
| the page it sits on (`surface-primary` + `fg-02`) | `245, 245, 245` |
| **delta** | **`0, 0, 0`** |

Four controls on that page — the chrome picker, DEFAULT ASPECT, LOOP THEME,
LOOP LENGTH — render as bare text with no pill at all. Screenshot before and
after the bump: `_tmp/2026-08-30-theme-0106-sunken/`.

**Dark is fine.** The wash is ink over ink (`#121215` 2% on `#121215` = 18), so
the well stays 10 under 18. This is a light-mode-only collision.

## Why it is yours and not ours

Both halves are DS rules and neither is wrong on its own:

- The five-level well is the ruling from 2026-08-30 (*"isnt ab what we want to
  use for sunken?"*), and `oq-ab-96` flipping toward the ground is right.
- `pageWash` is `AppShell`'s own prop, and `fg-02` is the rung the user ruled.

The gap is that **`surface-sunken` is derived from the page token, not from the
page as actually painted** — and the shell ships the thing that repaints it. Any
consumer passing `pageWash` loses the whole well; fxr is just the one that
renders enough sunken controls to notice. kol-monitor filed `pageWash`
originally, so it is likely in the same position.

## The ask — pick one, it is a colour-system call

1. **Deepen the well past the wash** — `oq-ab-95` or lower, so a 2% wash cannot
   close it. Cheapest, and keeps one token.
2. **Derive the well from the painted page** — have `pageWash` also step
   `--kol-surface-sunken` down by the same amount it darkens the page, so the
   five levels are preserved by construction rather than by luck.
3. **Rule that a washed page owns its own sunken value** and give consumers a
   documented override.

(2) is the one that cannot drift again — right now the two numbers are only
correct together by coincidence, and the next `pageWash` rung change breaks it
silently, exactly as this one did.

## What stays here

Nothing yet — fxr passes stock `tone="sunken"` and the ruled `pageWash` rung,
and is not going to hand-patch either. On the return: bump and re-measure the
delta on `/settings`.

Also verified on the same bump, all fine: kol-shell 0.27.0's masthead cluster
(`picker` / `themeToggle` / `onOpenSettings`) renders identically to the
hand-built one it replaced, and five routes load with 0 console errors.

## ✅ RESOLVED — 2026-08-30 · option 2

**kol-theme 0.108.0.** Every sunken surface now paints the same film the page
does — `background-image: linear-gradient(var(--kol-shell-page-wash,
transparent) ×2)` on the rest rules, with state washes stacked on top of it.

Option 2 as you argued: deepening the well would have held by luck and broken on
the next rung change. The property is unset outside an AppShell and falls back
to `transparent`, so nothing without a wash moves.

Measured at the ruled `fg-02` rung:

| | page | well | delta |
|---|---|---|---|
| light | 250 → 245 | 245 → 240 | **5** |
| dark | 18 → 23 | 10 → 15 | **8** |

The five levels hold by construction at any `pageWash` value.

**Also shipped, unrelated to this ticket but on the same bump:**
`kol-component 0.137.0` — the settings drawer lost its scrim and blur
(`backdrop={false}` on `SettingsPanel`'s ShellDrawer; user: *"remove the
background overlay and blur when settings sidebar is opened"*). Escape and × still
close it. Scoped to that panel; other ShellDrawer consumers keep theirs.

And **kol-theme 0.107.0** stopped the Dropdown trigger having a hover state —
`.kol-btn.kol-tone-sunken:hover` matched it because a trigger carries `.kol-btn`,
and the exclusion lived only in the atoms sheet. Now gated:
`validate-dd-trigger.mjs`, gate 25.

**Remainder here:** none.

## ⚠️ REOPENED — 2026-08-30 · the fix was at the wrong layer

**kol-theme 0.109.0 reverts it.** The 0.108.0 "fix" had every sunken component
paint `--kol-shell-page-wash` as a background layer so the well would track a
washed page.

User: *"we are talking about components, wash affects background."* Correct, and
it is the whole objection — a control has no business reproducing a page-level
film. Portalling proved it inside the hour: `.kol-dd-panel` renders at
`document.body`, could not inherit the property, and drew a different colour
from its own trigger. Two halves of one connected control, two values.

Patching that by pushing the property onto `documentElement` (kol-shell 0.28.0)
made the symptom go away and left the layering violation in place.

### Still open

The original collision stands, unchanged: at the ruled `fg-02` rung a washed
light page and the well both land on 245. **The three options in the ask above
are still the three options** — and (2) should now read "have the *page* derive
the well from what it actually painted", not "have every component repaint the
film".

This is a page/token question. It does not belong in eight component rules.

**State:** 🔴 needs ruling.

## ✅ RESOLVED — 2026-08-30 · solved by the pole, not by the wash

**kol-theme 0.110.0.** No ruling needed in the end — the user's own call on a
different thread settled it: *"in light mode we could fix the sunken to use fff?
fully white?"*

The `ab` ladder gained its endpoint, `100` — the ground pole itself, no mix — and
`--kol-surface-sunken` points at it. Still one token, still flips.

| | page | washed page | well | gap |
|---|---|---|---|---|
| light | 250 | 245 | **255** | 10 |
| dark | 18 | 23 | **0** | 23 |

The collision existed because the well was 245 and a 2% film moved the page to
exactly 245 — a five-level well closed by a five-level wash. At the pole the gap
is 10 and 23, and no `pageWash` rung in the ladder can close it.

Neither of the three options in the ask was taken: not a deeper mix, not
page-derived, not a per-consumer override. The well simply stopped being a mix.

⚠️ **Dark is now pure `#000000`**, a 23-level step under the page (was 8). If
that reads too deep, the fix is the `96` rung back — one token, one line.

**Remainder here:** none.

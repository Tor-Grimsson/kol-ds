---
component: ThemeToggle
source: kol-framework/src/ThemeToggle.jsx#L47-L166 · kol-framework/src/theme.js#L12-L54
date: 2026-07-30
status: closed
deps: [Icon, useTheme]
staged: 2026-07-30
---

# ThemeToggle — `system` is a policy, not a cycle state

> **USER RULING, 2026-07-30, verbatim intent:** *"I see three states… dark mode
> system light mode, why the fuck is system there, that is not a state."*
> Filed from kol-website (apps/brand sidebar). Three findings below; **#1 is the ruling**,
> #2 and #3 are defects found in the same read.

---

## 1. `system` must not be a cycled, labelled position — THE RULING

### What ships now
`ThemeToggle.jsx:48` — `NEXT_MODE = { light: 'dark', dark: 'system', system: 'light' }`.
Clicking cycles **light → dark → system → light**, and `MODE_LABEL` (line 47) gives
`system` a visible label, `"System"`. It occupies slot 2 of the roll strip (`SLOT`, line 49)
and wears the same `mode-toggle-01` glyph as the other two.

### Why it's wrong
`system` is **the absence of a choice**, not a choice. `theme.js:12-15` says so in its own
words — *"'system' is the absence of an explicit choice — applyTheme('system') clears the
stamp and the saved key, handing the page back to the OS."* The theme law
**explicit > system > light** is a *resolution precedence* describing how the page decides
what to render. It is not a menu.

Promoting it to a clickable labelled position makes the control claim the page is in a
mode called "System", when what actually happened is the user *unset* their preference.
It also makes the toggle unpredictable: from "Dark mode" one click lands on "System",
which may render dark **or** light depending on the OS — the button no longer tells you
what the next click does.

### What it should be
Two positions the user cycles: **light ↔ dark**. Reaching the unset/system condition is a
*reset*, not a rung in the cycle — if it needs to be reachable at all, it belongs behind a
separate affordance (long-press, a reset item, a settings row), never as a third stop that
a single click walks into.

`theme.js` needs no change — `applyTheme('system')` staying available is correct. This is
purely about what `ThemeToggle` cycles through and labels.

---

## 2. `fill` defaults to `subtle` — the brand sidebar renders a filled button

`ThemeToggle.jsx:53` — `fill = 'subtle'`, which maps at line 150 to `kol-btn-primary`:
the grey filled rung with full hover/active button chrome. `fill = 'none'` maps to
`kol-btn-nav` — identical geometry, no filled box, quiet ink plus a hover wash.

apps/brand's SideNav calls `<ThemeToggle variant="button" size="md" />` and never passes
`fill`, so it silently takes the filled rung. **The user's report: that is not what should
be in a sidebar.**

The docstring at lines 21-23 currently asserts the opposite —
*"subtle = grey fill (brand sidebar) · none = the invisible container (nav-bar chrome)"* —
so the spec itself believes the filled button is correct **for the brand sidebar
specifically**. That assertion is what the ruling contradicts; fixing the consumer call
site alone would leave the DS documenting the wrong default. Decide whether:
- the default flips to `none`, or
- the docstring's sidebar claim is withdrawn and consumers pass `fill` explicitly.

---

## 3. SideNav ships a collapse chevron with no CSS behind it

Unrelated to the toggle, found in the same session.

`kol-framework/src/SideNav.jsx:184-192` still renders the collapse button
(`w-6 h-6 rounded-full`, pinned `top-5 right-[-12px]`, `chevron-left`/`chevron-right` @12)
and `:153-157` still stamps `data-sidenav="collapsed"` on the root. But the CSS that
made the attribute do anything — `:root[data-sidenav="collapsed"]` — was deleted
2026-07-29; its tombstone is at `kol-framework.css:84`.

**So at 0.9.1 the package renders a button that does nothing.** Any consumer using the
package SideNav gets a dead control.

Two secondary gaps in the surviving `≤1024px` forced rail (`kol-framework.css:99-108`),
which the manual collapse shared: at the 56px rail width, **the labelled ThemeToggle and
the `.kol-sidenav-footer` wordmark both overflow** — the rail block hides `-hop-label`,
`-body`, `-hop-count` and `-section-toggle`, but never those two.

Resolve as either: restore the `:root[data-sidenav="collapsed"]` block (and cover the two
overflow cases), or remove the button + attribute stamp from `SideNav.jsx` so the package
stops shipping a dead control. **Do not leave it half-present.**

Also correct the record: kol-website's 2026-07-30 milestone log claims this removal
*"migrated UP into kol-framework 0.6.1 so the package matches reality."* It did not — only
the CSS half ever landed.

---

## Consumer-side state (kol-website, for context — no action needed from the DS)

apps/brand rebuilt the collapse **locally** on 2026-07-30, because brand renders its own
`components/framework/SideNav.jsx`, not the package component. It carries the button, the
state, `localStorage` key `kol-sidenav`, a restored `:root[data-sidenav="collapsed"]` block
in `styles/sidenav-collapse.css`, and closes both overflow gaps (ThemeToggle swaps to
`fill`-less `icon` when collapsed; footer wordmark hidden). That local work does **not**
pre-empt finding #3 — the package is still inconsistent for every other consumer.

## Recreation notes

- Tier: unchanged (molecule, `packages/framework`).
- Finding #1 is a **behaviour** change and will alter what existing call sites cycle through — it is the ruling, so it lands regardless; note it loudly in the changeset.
- Finding #2 is a **default flip** — the exact class of change that silently broke consumers twice on 2026-07-30 (Pill size, ThemeToggle variant). Whichever way it's decided, say so in the changeset in terms of what a bare `<ThemeToggle />` renders after the change.
- Text casing stays authored at the call site; `MODE_LABEL` strings are content, not chrome.

---

## RESOLUTION — 2026-07-30, shipped in `@kolkrabbi/kol-framework@0.10.0`

All three findings closed. Behaviour verified in a browser, not asserted.

### #1 — the ruling: `system` is no longer a position

`theme.js` `cycle` is now `light ↔ dark` (was `light → dark → system → light`).
`MODE_LABEL` and `SLOT` lost their `system` entries; the roll strip is two glyphs, not
three. Label and slot follow the **resolved** theme rather than the stored choice — when
the page is unset the button describes what the eye actually sees, which is the only way
it can honestly say what the next click does.

The reset survives as its own verb: `useTheme()` gains **`clear()`**, and the toggle fires
it on **alt- or shift-click** — the "separate affordance" the ruling allows, with no new
chrome and no third stop. The title announces it (`· alt-click to follow your system`),
and reads `· following your system` while unset.

`theme.js`'s `applyTheme('system')` is untouched, as the brief specified.

**Verified live:** unset → *Light mode* / "following your system" · click → dark, stamped
· click → light, stamped · click → dark · alt-click → stamp and storage both cleared,
back to "following your system".

### #2 — `fill` default flipped `subtle` → `none`

**A bare `<ThemeToggle />` now renders `kol-btn-nav` — the quiet container — where it
previously rendered `kol-btn-primary`, the grey filled rung.** Geometry is identical; only
the fill goes. Confirmed on the live page: the button's classes read `kol-btn-nav
kol-btn-md`.

The docstring's claim that the filled rung suited the brand sidebar is **withdrawn**, per
the brief — a sidebar row is not a button. Consumers that do want the fill pass
`fill="subtle"` explicitly.

### #3 — the dead collapse control is gone

`SideNav.jsx` no longer renders the chevron button, no longer stamps
`data-sidenav="collapsed"` on `<html>`, and no longer puts `is-collapsed` on the aside.
Nothing had styled any of the three since the CSS was deleted 2026-07-29 (tombstone at
`kol-framework.css:85`), so the package was shipping a control that did nothing for every
consumer.

`collapsed` / `onToggle` are still **accepted and inert**, so no call site breaks; the
props are marked as such in the signature. A consumer wanting a collapsing rail owns it
locally — which is what kol-website's apps/brand already does — until the feature is
deliberately rebuilt here.

The two `≤1024px` overflow gaps named in the brief (labelled ThemeToggle and the footer
wordmark at the 56px rail) are **NOT closed** — they belong to the surviving responsive
rail, not to the removed control, and closing them is a CSS change to
`kol-framework.css:99-108` that was not part of this ruling. Filed, not silently dropped.

### Record correction

The brief is right that kol-website's milestone log overstated the 0.6.1 migration: only
the CSS half ever landed. The JSX half landed here, at 0.10.0.

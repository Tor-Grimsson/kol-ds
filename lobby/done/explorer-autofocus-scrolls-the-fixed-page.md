# The explorer's `autoFocus` keeps the page where it is

**Staged:** 2026-10-06 · from a kol-website session
**Change:** one focus call in the media explorer — `focus({ preventScroll: true })`, or focus after layout without scrolling

---

## The problem, in one case

`kol-website/apps/media` (kol-r2b2 moved in) was ported today onto the shape of this repo's
`apps/media`: `PageShell mode="fixed"` around `MediaLibrary variant="explorer"` with `autoFocus`,
on the live API, kol-component 0.239.1 · kol-shell 0.61.0.

On load at 1440×900 the page's scroller (`.kol-shell-page`) sits at **`scrollTop=102`** — the
focus on `.kol-column-browser` scrolled it into view inside the fixed page, and 102px is the
header. The wordmark, the bucket dropdown and the header chips open **off-screen** (`top=-32`),
the crumb at `top=-54`; the user's first sight of the admin is the search field. At 390 nothing
scrolls (no focus there).

| | with `autoFocus` | without |
|---|---|---|
| `.kol-shell-page` scrollTop on load | 102 | 0 |
| bucket dropdown top | −32 | 70 |
| crumb top | −54 | 48 |
| focused element | `.kol-column-browser` | body |

Measured on the built app; screenshots in `kol-website/_tmp/2026-10-05-media-move/`.

## The fix

Focus without scrolling — `el.focus({ preventScroll: true })` where the explorer (or the column
browser it mounts) auto-focuses. The keyboard-first behaviour stays; the page does not move.

## Rejected alternative

The consumer resetting its scroller after mount, or giving up `autoFocus` (what kol-website does
until this returns — the one stopgap, noted in its receipt). Both hide a focus call that scrolls.

## Definition of done

- [ ] with `autoFocus`, `PageShell mode="fixed"` opens at scrollTop 0 at 1440×900; the header is in view
- [ ] the column browser still has focus on load, so the view keys work from the first keystroke
- [ ] this repo's own `apps/media` measured the same way

## Addressed — 2026-10-06

`ColumnBrowser` focuses with `preventScroll`. This repo's `apps/media` (PageShell fixed + explorer + autoFocus) at 1440×900: scrollTop 0, `.kol-column-browser` focused.

**Shipped 2026-10-06 in kol-component 0.240.0**, confirmed on the registry. Remainder for kol-website: bump and drop any stopgap.

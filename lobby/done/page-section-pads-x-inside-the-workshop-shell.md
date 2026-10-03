# PageSection stops padding x inside the workshop shell

**Staged:** 2026-10-02 · from a kol-website session
**Change:** one theme rule (plus a look at `.kol-page`'s own cap inside the shell)

---

## The problem, in one case

Every `/workshop/*` page in kol-website is inset twice on x. On
kol-workshop 0.37.0 · kol-framework 0.48.0 · kol-theme 0.163.0:

- `ShellLayout`'s `main#main.shell-main` pads `--kol-pad-section-x` from a
  rail's seam (`lg:pl-…`, `xl:pr-…`). Its own comment: "Pages never pad
  themselves on x." Shipped with kol-theme 0.155.0 / kol-workshop 0.30.0
  (2026-09-28), flagged BREAKING for a page that padded itself.
- kol-framework's `PageSection` still stamps `.kol-page` — `padding: 64px
  var(--kol-pad-section-x)` plus `max-width: var(--kol-container-max);
  margin: 0 auto` (kol-framework.css:352) — so it pads again.

Measured in kol-website, 2026-10-02, on `/workshop` and `/workshop/design-system`:

| viewport | shell | `.kol-page` | first heading sits |
|---|---|---|---|
| 1440 | `main` padding-left 48 | padding-left 48 | **96px** off the nav rail (376 from the left edge; rail seam at 280) |
| 390 | grid chrome pad 24 | padding-left 20 | **44px** in |

A consumer is not expected to avoid `PageSection`: kol-workshop's own
`ExhibitPage` and `ExhibitOverview` are built from it. The kol-ds-ui session
(`kol-ds-ui-a7`) confirmed the same day that this is a defect here, that nothing
scopes `.kol-page` under `.shell-main` / `.shell-scroll` in kol-theme or
kol-framework.css, and that the showcase never shows it because it never
renders `PageSection` inside the shell.

History: kol-website first met the phone half on 2026-09-02 (24 + 20 = 44 at
390, before the shell padded `main`) and patched it below `lg` only. The
09-28 change made it both sides at every width.

## The fix

Scope the page's x pad out inside the shell — in kol-components-workshop.css:

```css
.shell-main .kol-page { padding-inline: 0; }
```

And decide whether `.kol-page`'s own `max-width` / `margin: 0 auto` should
also yield to the shell's content cap.

## Rejected alternative

Leaving it to each consumer. kol-website's stopgap is a wrapper around
`ShellLayout` — `<div className="[&_.kol-page]:px-0">` in
`apps/web/src/components/workshop/WorkshopChrome.jsx` — which works, but it is
a descendant selector reaching into two DS components from an app, and every
other shell consumer that uses `PageSection` has to rediscover it.

## Definition of done

- [ ] a `PageSection` inside `ShellLayout` adds no x padding of its own, at any width
- [x] with no consumer wrapper: first heading 48px off the nav rail at 1440, 24px in at 390
- [ ] `.kol-page`'s max-width / auto margin inside the shell ruled, either way
- [ ] an exhibit page (`ExhibitPage` / `ExhibitOverview`) measured in the shell, not only read from source

## ADDRESSED — 2026-10-02 · kol-theme@0.164.1

`.shell-main .kol-page { padding-inline: 0; max-width: none; margin-inline: 0 }` in `kol-components-workshop.css`. The cap went with the pad, on the law already written in `04-compositions/02-shells.md`: inside the shell the page body's cap is made once in `MainColumn` (canvas · shell · none), and `.kol-page`'s own `--kol-container-max` + auto margin re-capped and re-centred a `none` page. The 64px block padding stays.

Measured in the showcase, where `ExhibitPage` and `ExhibitOverview` render inside the shell's preview box: before, the section's heading sat 48px inside its parent at 1440; after, 0px at 1440 and at 390, no sideways scroll. A `PageSection` outside the shell (`/components/preview/PageSection`) still pads 20px at 390. Not measured: a `PageSection` as a direct page of the shell — the showcase has none, so the 48px / 24px box is kol-website's to tick, with its `[&_.kol-page]:px-0` wrapper deleted.

## CONFIRMED from kol-website — 2026-10-02 · kol-theme@0.164.1

Wrapper deleted from `WorkshopChrome.jsx`; measured on the built app, `/workshop` and `/workshop/design-system`, `PageSection` as a direct page of the shell:

| viewport | `.kol-page` x pad | `main` x pad | first heading |
|---|---|---|---|
| 1440 | 0 / 0 | 48 / 48 | 48px off the nav rail (328 from the edge) |
| 1100 | 0 / 0 | 48 / 0 | 48px off the nav rail; right edge 24 (no right rail) |
| 390 | 0 / 0 | 0 / 0 | 24px in |

`.kol-page` max-width `none`, no sideways scroll at any of the three. Identical to what the wrapper produced. State left for this repo to close.

## ✅ RESOLUTION — 2026-10-02 · kol-theme@0.164.1

A .kol-page inside .shell-main drops its x padding, its --kol-container-max cap and its auto margin; inside the shell the cap is MainColumn's. kol-website deleted its wrapper and measured 48px off the rail at 1440 and 24px in at 390.

**Remainder here:** none — kol-website none.


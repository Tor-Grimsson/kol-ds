# kol-r2b2 is carrying ~150 lines of DS-class patches locally — inventory ahead of the measured spec

**Staged:** 2026-09-02 · from a kol-client-hrafn session
**Change:** none yet — this is the surface, filed early. The measured spec is owed from kol-r2b2.

---

## The problem, in one case

kol-r2b2 closed `ColumnBrowserChromeCorrections` on 2026-08-27 and got its `src/index.css` down to
**24 lines**. It is **174** today. The regrowth is not app styling — it is corrections to DS chrome
that the consumer wrote locally because the ruling had nowhere else to go, and four of them now
reach into DS internals through selectors the DS never promised:

```css
div:has(> div > div > .kol-column-browser)         { gap: 2.5rem }          /* :111 */
div:has(> div > div > .kol-column-browser) p.kol-mono-12 { … }              /* :116-117 */
div:has(> [aria-label="Reset to defaults"])        { gap: 0.5rem }          /* :174 */
```

A DOM shape three divs deep and an `aria-label` string are load-bearing in a consumer's stylesheet.
Any markup change here breaks them **silently** — no build error, no warning, the rule just stops
matching. That exact failure already happened in that repo once: the block was scoped to
`.r2b2-columns`, the class retired with its component, and every rule stopped applying unnoticed.

## The surface

Measured on **theme 0.81.0 / component 0.119.0** — what kol-r2b2 actually runs, ~48 theme minors
behind current. Treat this as *where to look*, not as values to ship.

| DS surface | what the consumer overrides | note |
|---|---|---|
| `.kol-column-browser-resize-*::before` | pill anchored to the strip's far edge + half the border; 0.125 × 4.5rem; 1800ms ease with a 400ms delay; an `is-near` proximity reveal | theme 0.79.0's pill is strip-centred at 3 × 32 — the strip sits **inside** the border it grabs, so a strip-centred pill lands ~4px off the line |
| `.kol-column-browser-row` / `-column` / `-preview` | dividers off, constant 4px inset so selection never shifts layout, `--kol-radius-sm` pill, hover and bare-cursor fills transparent | self-described as *"the half `ColumnBrowserSeams` did not take"* — the fills moved into the theme, the shape and the no-hover-fill ruling did not |
| `.kol-overlay-close` | grey `IconFrame` chip instead of `Button variant="outline" quiet`, plus `z-index: 60` + `pointer-events: auto` | the z-index half is a **defect, not taste** — the sheet's own content covered the button and the click landed on the panel behind it |
| `.kol-doc-page` (in `-preview` and `.kol-overlay`) | `aspect-ratio: 3/5`, scroll inside | the DS sizes at 1:√2 off viewport height with no bound; a 7 KB JSON drew a pane taller than the browser |
| settings footer | `gap: 0.5rem` | `flex justify-end` with no gap is right for one button; the theme chip portals in beside the reset icon and the two touch |
| `.toggle-checkbox--media` | unchecked indicator gets a white edge so it reads over any image | the consumer's own comment says *"local until the DS media variant takes it"* |

Every one of these carries a dated user ruling in the source comments. Those comments are the spec —
kol-r2b2 has been asked to bring them across intact rather than restate them.

## What is being asked of the DS right now

**Nothing to build yet.** This entry exists so the queue is not surprised, and so the pattern is
visible while it is still one repo: a consumer needing `:has()` chains and `aria-label` selectors
to reach DS chrome is a signal the DS is missing a prop or a token on those surfaces, independent
of whether any individual value above survives the bump.

## Rejected alternative

*Wait for kol-r2b2 to bump and file, and say nothing until then.* The inventory would arrive with
no history attached — and this is the **second** cycle of the same block regrowing after being
cleared to 24 lines. The recurrence is the finding; it is worth a row before the values land.

## Companion ticket

`~/dev/projects/kol-r2b2/lobby/inbox/consolidate-ds-overrides.md` — the consolidation, bump and
filing are that repo's to do.

## Definition of done

- [ ] kol-r2b2 bumped and re-measured; its consolidated spec received as its own ticket
- [ ] each surviving item ruled — adopted with a version, or rejected with a reason
- [ ] the three DOM-shape / `aria-label` selectors have a supported prop or token, or a stated ruling that they should not
- [ ] this entry moved to `done/` or `archive/` once the real spec supersedes it

## ✅ RESOLUTION — 2026-09-02 · kol-theme@0.131.0 · kol-component@0.166.0

Superseded and closed against BrowsePageRulingsAndSeams, exactly as that ticket asked. This entry was the early inventory filed from a kol-client-hrafn session before kol-r2b2 had bumped — its whole job was to make the pattern visible while it was still one repo, and it did: the recurrence WAS the finding, and the measured spec arrived the same day.

Its DoD, closed line by line. kol-r2b2 bumped theme 0.81.0 → 0.129.0 and component 0.119.0 → 0.164.0 and re-measured all eleven blocks — done, and it filed BrowsePageRulingsAndSeams. Each surviving item ruled — done, six of them, five adopted and the overlay-close chip rejected as superseded by FullscreenOverlayCloseIdiom. The three silent-failure selectors: the two :has() DOM-shape chains went out consumer-side (the page rhythm onto a forwarded className, the count line onto its own .r2b2-browse class) and the [aria-label="Reset to defaults"] selector is answered here by a real seam — SettingsFooter children, reached via settingsFooter on MediaLibraryBrowse / MediaLibraryLibrary — so the MutationObserver on document.body comes out with it.

The inventory's own thesis is the part worth keeping: a consumer needing :has() chains and an aria-label to reach DS chrome is a signal the DS is missing a prop or a token on those surfaces, independent of whether any individual value survives the bump. Three of the six items that followed were exactly that, and two of them (the grab pill and the footer) were the ones that empty App.jsx.

**Remainder here:** none — kol-r2b2 nothing of its own — see the BrowsePageRulingsAndSeams receipt for the bump and the local-CSS deletions.


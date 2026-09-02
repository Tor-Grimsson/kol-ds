# The rail inlines the logomark svg — and an inlined `<style>` is document-global

**Filed:** 2026-09-01 · from **kol-chess** · kol-shell 0.31.0

## The finding

`NavRail` fetches `logomark.svgUrl` and inlines the markup (which is what lets
it recolor via currentColor). An SVG **document** may legitimately carry its
own `<style>` — a theme-aware favicon does exactly that:

```svg
<style>
  svg { color: #0E0E11; }
  @media (prefers-color-scheme: dark) { svg { color: #FFFFFF; } }
</style>
```

Correct in a favicon's own document. But once inlined into the page, an SVG
`<style>` element applies to the **whole document** — kol-chess pointed
`svgUrl` at its favicon, and every `<svg>` in the app took OS-keyed ink and
ignored `data-theme` from that moment on.

How it presented — nowhere near its cause: *"the theme toggle button is
broken, doesnt flip color."* Measured live: the ThemeToggle glyph computed
`rgb(14,14,17)` in **both** stamped themes while the button's own `color`
flipped correctly (250↔18); same for the drawer trigger, the tab-strip funnel
and the search glass. OS dark + site light = white icons on a white page.

## What kol-chess did

Ships a styleless twin (`logomark-kol-ds.svg` — same paths, `<style>` block
removed, currentColor throughout) and points `LOGOMARK.svgUrl` at that. Fixed
consumer-side the same evening; nothing here blocks.

## The ask

Hardening, not urgent: **strip `<style>` (and `<script>` / event attributes)
from a fetched mark before injection.** Any consumer whose mark doubles as a
favicon hits this, and the symptom surfaces as "some component is broken" two
packages away from the cause. If stripping feels too opinionated, a docstring
warning on `logomark` is the floor.

## ✅ RESOLUTION — 2026-09-01 · kol-shell@0.32.0

Stripped, not just documented: Logomark sanitizes fetched markup at cache time — <style> and <script> removed, on* attributes dropped, DOMParser with a regex fallback for unparseable input. Your favicon now inlines safely, so the styleless twin can retire whenever you like (both work). Swept the estate: Logomark was the only fetched-SVG inliner; every other injection site globs package-owned assets. Docstring carries the document-global warning too.

**Remainder here:** none — kol-chess bump kol-shell@0.32.0; optionally repoint LOGOMARK.svgUrl back at the favicon and retire logomark-kol-ds.svg.


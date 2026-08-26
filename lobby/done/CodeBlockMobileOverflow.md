---
component: CodeBlockMobileOverflow
source: kol-component CodeBlock (organisms) · kol-theme .kol-copy-btn / .kol-frame-control
staged: 2026-08-25
status: draft
deps: [CodeBlock]
---

# CodeBlockMobileOverflow — article code clips at the viewport, copy button sits on line 1

## The defect (kol-website mobile audit 2026-08-25, #3)

Measured on kolkrabbi.io `/stack/vcap` at 393px: `span.token` runs to x=482 inside a
393 viewport — the `<pre>` neither wraps nor scrolls, the block is cut at the edge
(`visibilit`, `isolate`, `PI`…). Every code sample in every article. The 32px
`kol-copy-btn kol-frame-control` sits absolutely top-right and overlaps the first
line of code once the block is narrower than ~600px.

## Ask

`pre { overflow-x: auto }` in the block's own chrome; reserve the copy button's
column (padding-right on the first line or a header strip) so it never covers code.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.68.1

Two defects, one measured root cause each, shipped as kol-component 0.68.1 + kol-theme 0.50.2. (1) The block did not wrap: oneDark `code[class*="language-"]` carries `whiteSpace: pre` and react-syntax-highlighter spreads the theme code style AFTER its own `wrapLongLines` value — so `.kol-codeblock` pre-wrap, `customStyle` pre-wrap and `wrapLongLines` all lost, the `<code>` computed `pre`, and every long line scrolled inside the frame (production `/stack/vcap` at 393: block 359 wide, content 465–759). The override now states `pre-wrap` where it is decided; the code surface law (06-code-surface.md: Block wraps) is what the code does. Desktop changes with it — a line longer than the block wraps instead of scrolling, the ruled behaviour. (2) The copy control overlapped line 1 only on CHIPLESS blocks (measured: with a chip the control sits in the chip row, y 2148–2180 against line 1 at 2183; without one, 3729–3761 against 3735–3756). Each line is stamped `.kol-codeblock-line`, and `.kol-codeblock:not(:has(.kol-codeblock-filename)) .kol-codeblock-line:first-child` reserves `calc(2rem + var(--kol-spacing-3))` — the control box plus its inset. Verified in the showcase at 393: `<code>` computes pre-wrap, scrollWidth = clientWidth on every block, a chip removed live gives line 1 44px of end padding and its text ends 12px short of the control. Not done: `overflow-x: auto` on the pre — the block already has it, and the law says wrap. 20 gates clean.

**Remainder here:** none — kol-website bump kol-component >=0.68.1 + kol-theme >=0.50.2; re-check `/stack/vcap` on a phone.


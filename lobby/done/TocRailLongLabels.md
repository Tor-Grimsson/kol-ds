# TocRailLongLabels

**Staged:** 2026-10-24 · from a kol-studio session
**Change:** `DocsToc variant="rail"` keeps long labels inside its column

---

## The problem, in one case
kol-studio `/clients` registers `DocsToc variant="rail"` through `ShellTocContext` (kol-component 0.298.0). Its labels are the docs' own titles, e.g. "Rebrand — Expanded Scope (Campaign + Motion)". At 1440 the right-aligned labels run left out of the `.kol-toc-rail` aside and sit over the page's table (labels from x≈1125, the table ends at x≈1232).

Screenshot: `_assets/2026-10-24-kol-studio-clients/1440-dark-clients-roster.png`.

## The fix
- Long labels truncate (or wrap) inside the rail's column; the lens can still show the full label on focus.

## Definition of done
- [ ] No rail label crosses into the page plane at 1280–1535
- [ ] Published; kol-studio's receipt names the version

## 🟢 CLOSED — 2026-10-24 · kol-theme 0.188.0 live

`.kol-toc` was fixed and content-sized, so a long label grew the whole rail leftwards over the page. It is capped at the frame's TOC column (kol-framework's `--kol-shell-toc-w`, 256, padding included), its rows are bounded by it (`max-width: 100%`), and `.kol-toc-label` is capped at the row's width over the lens's largest scale (1.2) with an ellipsis, so even the lit row ends inside the column. Walked on a rail fragment in the showcase with kol-studio's label: the rail 256 wide, the label inside it at rest and lit, ellipsized. Registry live (checked once). Receipt returned to kol-studio's outbox.

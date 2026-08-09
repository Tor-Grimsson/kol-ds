# Handoff — 2026-08-09 10:41

## Goal of the current arc
The RecordManager surface (RecordManager · FieldRow · StatusChip + the `record-manager-cms` set) is being driven to the Framer CMS reference in a LIVE frame-by-frame review — the user screenshots, we fix and publish per wave. The arc is mid-stream: several frames were answered minutes before this handoff and more are expected.

## Last actions taken (causal trail, newest first)
- Shipped the SideNav pill handle (framework **0.17.0**) on the user's build order relayed through the kol-website session: grab edge = the single collapse/resize control, chip Button deleted in both states, click-toggle with 3px slop, snap-to-default (`--kol-sidenav-snap-default`), Home/Enter/Space keyboard. Hook logic lifted from the approved brand proto (`kol-website/_tmp/2026-08-09-sidenav-pill-proto/`).
- Ended the Dropdown width saga: **exact fused width restored**; truncation solved at the trigger — `.kol-dd-ghost` reserves 1rem of check-column slack. (The two failed middles: a floor let the abs-positioned panel size against *available space*, not content.)
- StatusChip settled per the user's three-things message: opaque tone fills (`color-mix(tone 15%, surface)`), Dropdown-sm metrics (py-1 **px-2**, mono-12), caret as a direct flex child.
- Panel pass (frame 45): ShellDrawer `closeSide="start"` (× leads, … ▶ Saved Publish right), media/file empty slots render disabled without a picker, rows py-4, filled mock art.
- Infrastructure born mid-storm: component 0.28.0 shipped unparseable → 0.28.1 + deprecation → **gate #19 (syntax)** + **workspace:^ pins** + a registry smoke harness (build + headless console) that handed the brand breakage back to kol-website clean.

## Current state / open decision points
- npm end-state, all registry-verified: theme **0.32.3** · component **0.32.2** · framework **0.17.0** · icons **0.12.1** · workshop **0.20.1**. All **19 gates clean**.
- **The review is NOT closed** — the user has not signed off any surface. Hot zones by his last frames: chip metrics, row density, panel proportions, dropdown seam behavior.
- kol-website: adopted the full wave, retired its SideNav proto and 0.28.0 patch; owes us the **first console line** if brand's next boot is still red (their smoke came back clean from our side — verdict: local to brand, since withdrawn to their court).
- Standing, untouched this arc: **tier re-sort awaits his row-by-row review** (`02-placement.md § Re-sort map`); LLM_RULES symlink parked (dotfiles BULLETIN 🔵).

## Next intended action
- Answer the next review frame. Pattern that works: read the frame LITERALLY, locate the exact rule/metric in source before proposing, fix at the component (never the demo), publish the wave, report with the explanation he asked for.

## Working memory not yet in AGENT-CONTEXT
- **His review grammar**: a frame IS the spec — measure it before building; "explain it to me" means explanations first, fixes carried in the same turn. Wrong-twice on the same item is the anger trigger (the caret took three passes; the uppercase took three).
- **My verification traps this session**: truncated grep output made me deny a `text-transform` that existed (`.kol-tag`, 8 lines below my cutoff); trusting the peer's from-memory icon list produced four false MISSINGs. Read to the END of the rule block; verify inputs before verdicts.
- **A JSX comment cannot sit at expression position after `return (`** — that one-liner cost a broken publish and an evening. The syntax gate now catches the class; it runs first in `pnpm validate`.
- Icon chunk cache: new SVGs ride the lazily-imported `iconData.js` chunk — a long-running dev server can hold the old chunk; restart re-globs. Unconfirmed as ever having bitten, but it was the standing suspect for "missing" glyphs.
- The `.kol-tag` uppercase is LABEL-only by documented exception; data-bearing chips wear `kol-tag--data`. If more caps-where-data-should-be reports arrive, check which chip class the surface wears before touching the law.

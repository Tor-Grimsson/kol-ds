# Handoff — 2026-10-06 01:35

## Goal of the current arc
fxr's two touch tools (labs, the randomiser) usable on a phone and at any window width, and the editor honest below 1024 — plus kol-website's four lobby tickets. Both are now **published**; the arc waits on the user's look at the live result.

## Last actions taken (causal trail, newest first)
- **Published 2026-10-06** (on his "yes /upig"): kol-component **0.240.0** · kol-shell **0.62.0** · kol-workshop **0.39.0** · design-editor **0.21.0** · kol-media-client **0.4.1**. Shipped-packages table bumped. **Push is his and is due.** Registry not re-checked after the `+` lines (npm is async — check once at `registry.npmjs.org/@kolkrabbi%2f<pkg>/<version>` if anything doubts it).
- kol-website's four tickets closed and filed to `lobby/done/` with versions: `section-split-content-media-and-ruled-gutter` · `explorer-autofocus-scrolls-the-fixed-page` (both component 0.240.0) · `media-client-admin-base-is-media` (media-client 0.4.1) · `reader-takes-field-config-and-page-actions` (workshop 0.39.0). Queue now 17. Measuring kit: `_tmp/2026-10-06-website-tickets/` (`measure.mjs`, `fm.jsx` — a server-render check, bundled with esbuild from `apps/workshop` with an `import.meta.glob` shim).
- His second review of labs (screenshots: empty first load with two closed rails, half-window breakage, phone sheet) → built: entry card (`LabsCatalogCard`, four sections, Modulation stays on the rail), media-first source card (`LabsSourceCard`), no params rail on an empty stage, labs' sheet under 1024 (`LABS_BELOW`), S → the standard shortcuts sheet (labs' own card quarantined to `_tmp/2026-10-06-labs-shortcuts-card/`), zoom chips → `+` `−` `0` keys, sibling chips as the DS strip, source strip removed, label column 112, draggable grabber, Colour → Color, rail **enter mode** (`AppShell railSections="enter"` in `apps/labs` and `apps/editor-hub` only), pickers on the Generate tab only, ▶ folded into the footer strip.
- Before that: the plan's five stages (`plan-2026-10-05-fxr-on-a-phone.md`), the five bugs, the generator → randomiser rename, the research page `docs/documentation/06-research/04-tools-on-a-phone.md`.
- Session log for all of it: `session-log/2026-10-06-fxr-on-a-phone.md` (written before the website tickets and the publish).

## Current state / open decision points
- **Every UI call this session was made on my recommendation, for his review** — marked so in the code comments, the plan and `backlog/2026-10-05-fxr-phone-findings.md`. He has not seen the second-review build yet.
- **kol-fxr has been told nothing** and pins design-editor 0.10.0; `backlog/2026-10-03-fxr-bump-notes.md` predates this session's changes (randomiser rename is app-tier only; package exports unchanged except new `setMountedView`, `useBelow`, `SheetGrab`).
- **kol-website** gets the four fixes on its next bump; its stopgaps (no `autoFocus` on its media explorer) can go.
- Gates: `pnpm validate` 31/32 (retirements — the iMac's drop); `validate:render` clean on labs · randomiser · editor-hub · editor · panels · shell. The render gate still opens only 1440 and 390.
- Not done / known: labs' three stacked tab rows on a phone (Gen·Style·Anim, the footer strip, the transport sheet) are still separate; the editor below 1024 is a note, not a layout; effect.app / unicorn.studio / tekdetek were never opened (he raised it twice); labs' draft-restore prompt appears on a second load in one browser (existing).
- Published flowchart artifact he rejected: claude.ai/artifact/N3RVTBPH1hXv3zXNrFZfZB — don't reuse that form.

## Next intended action
- Tell him the push is due if he hasn't. Then take his corrections on the live labs / randomiser / editor-hub at ui.kolkrabbi.io/apps/ (after his push deploys) first — do not propose new work before.
- If he asks what's next: labs' one tab strip (merge Gen·Style·Anim with Output·File), and opening the three reference apps he named before any further layout call.

## Working memory not yet in AGENT-CONTEXT
- **How he wants it:** build on the recommendation and report once; no question lists, plan files or charts first (memory `build-on-the-recommendation-not-a-question-list`). He also does not want the work stopped at a "safe" subset — "you did tiny bit of the plan then stopped?".
- **Frames:** labs takes the sheet on touch or under 1024; the randomiser on touch or under 768; the editor shows a note under 1024. All via `useBelow` in `editor/mobile/device.js`. `currentView()` now prefers the mounted chrome (`setMountedView`) so single-chrome hosts at `/` get their keymap rows.
- **Test kits:** `_tmp/2026-10-05-fxr-phone-walk/` — `review.mjs` (his 2026-10-06 points), `last3.mjs`, `stages.mjs`, `frame-narrow.mjs`, `verify.mjs` (the five bugs), `walk.mjs`; servers on 5397–5400 via `pnpm --filter <app> exec vite --port <p> --strictPort --host 127.0.0.1`, PIDs in `pids.txt`, kill only those (the vite child survives a parent kill — check the port after). His own servers on 5296 and 5394 were never touched.
- Playwright on a reused browser context hits labs' "Restore your last canvas?" scrim on the second load — use a fresh context per check.

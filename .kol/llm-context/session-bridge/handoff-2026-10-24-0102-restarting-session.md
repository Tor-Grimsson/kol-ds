# Handoff — 2026-10-24 01:02

## Goal of the current arc
The Studio hub, judged on four review surfaces in this repo: `apps/studio-hub` is the template, and FXR (`apps/editor-hub`), Mirror (`apps/mixer-hub`), Monitor (`apps/rack-hub`) must match it row for row before anything is published. Nothing is published; he reviews, then `/upig`. The HubHomeContract lobby ticket (kol-fxr) is at addressed, awaiting his review.

## Last actions taken (causal trail, newest first)
- Wrote `plan-2026-10-24-hubs-against-the-template.md` from his 2026-10-24 review (22 screenshots): Library cards without trash, rail without pencil (Mirror and Monitor pass no handlers), tags mid-row in read mode, the card's meta line breaking when the rail is open (studio-hub too), the chrome mark smaller than the download box, Library opening on MODULES, Mirror's and Monitor's Create still their own CreatePage copies (mono header, old rows and cards), Mirror's settings rows wearing helper on sentences, Monitor's theme toggle sunken, FXR's Chrome EXPANDING at Home because Labs' categories only arrive after a labs pick. **He has not said go.** The reply listing the plan is the last message; he answers it.
- Built plan-2026-10-24-rail-presets-and-settings (every phase ✅): `NavRail preset` app · site · workshop (`RAIL_PRESETS`, `registerRailPreset`; kol-workshop registers ShellSidebar as `workshop`), the one rule (rows that hold sections ENTER, leaf rows EXPAND), the words (`sections="expand"`, `fold` aliased; TabsRow `collapsed`/`onExpand`), `AppShell rail`, AppHub `rail="app"` + the preset's phone shape, settings on THE RAIL with `content` and `tabs` (Monitor: Settings · Shortcuts · About · Repo; Mirror: Performance), HubHome files `mark` (FXR's chrome in the cover corner + the rail), the NavRail showcase preview with three presets, a Settings set (`showcase/src/sets/settings.jsx`) and `docs/documentation/04-compositions/17-settings.md`, the parity checklist (`docs/operations/07-apps-tier/05-studio-parity.md`) and `_tmp/2026-10-23-review-3/parity.mjs` corrected — green on all four.
- Earlier the same night (2026-10-23): plan-2026-10-23-hubs-parity (identity from the siblings, Library on the Hub's CatalogPage, rack-hub onto AppStudio, DS rail slot), the Studio's pill/fold/More sheet, the masthead round button (HomeMenu + MoreRows), the fold fades, the phone picker, the file rail read/edit + note.
- Peers (kol-fxr-20, kol-mirror-af, kol-monitor-c7) answered with file:line pointers; thanked, nothing asked of them.

## Current state / open decision points
- Goal file: `.active-goal-110f0a46-…` is `status: done` (the rail-presets goal). Start the next with `/kol-goal` on the new plan once he says go.
- Gates: 32/33 (only the standing retirements pair; never mention it). Render clean on the seven apps. `pnpm hubs` runs studio-hub 5190, FXR 5198, Mirror 5197, Monitor 5196 on the network.
- Unpublished: kol-component heading 0.296.0, kol-shell 0.77.0, kol-theme 0.184.0 (bullets under the existing headings). Sibling repos adopt after his sign-off and the publish.
- His vocabulary (memory saved): ENTER / EXIT, EXPAND / COLLAPSE — nothing else. Say FXR, Mirror, Monitor. "Settings is THE RAIL." Confirm his points back before building when he asks; replies short.
- Parked: the mixer's studio on CanvasStudio (no dot grid on Mirror's `/studio`, his word "we dont have to solve this here"); the round action button idea; the phone nav as the mobile shape of the DS, media first.

## Next intended action
- On his go: run the new plan as a `/kol-goal` — W1 one `fileCard` with every verb on Home and Library of all three (handlers over local state), read-mode values right-aligned, the meta row `nowrap` + the `app` grid floor raised, the mark in the download's box, Library landing on the files view; W2 Mirror's and Monitor's Create onto StudioCreate; W3 Mirror's helper rows → mono-12 + a runtime helper-wrap row in the pass, AppHub drawing the theme toggle from a component; W4 Labs' categories static in FXR's rail so Chrome enters, Labs enters, Effects expands at Home; W5 the pass and every pair looked at.
- If he changes the plan first, amend the file, confirm back, then go.

## Working memory not yet in AGENT-CONTEXT
- The parity pass is `_tmp/2026-10-23-review-3/parity.mjs` (`APP PORT MODE=path|hash TOOL PATHS LABS SETTINGS_TABS`); shots in `_tmp/2026-10-23-review-3/shots/parity/`. FXR is a BrowserRouter (`MODE=path`), the others hash.
- Mixer's own icon set collides with DS glyph names (user, image, settings-01, cloud) — filtered at registration in `apps/mixer-hub/src/App.jsx`.
- studio-hub's files carry `kind` (draft/final) as a filter key — the card's mark field is `mark`, never `kind`.
- The design-editor's saved preset has no chrome field yet; `chromeOf(p)` reads `chrome ?? view ?? source`, defaulting to Editor.
- The sibling repos still carry foot buttons on their Library pages (New Rack, Import) and the drawer on the phone — off the Studio's preset here, by his rulings; named in the checklist's per-hub column.

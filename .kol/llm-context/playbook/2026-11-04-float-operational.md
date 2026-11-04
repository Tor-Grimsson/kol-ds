# Playbook — Float operational

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.

**Goal:** every gap the float views and float set turned up, fixed in its package and mirrored in Figma — `plan-2026-11-04-float-operational.md`.

---
## Entries

[13:53 GMT · 2026-11-04] · setup · plan + goal
  what → user: "deal with every issue UNTIL you have finished … get float operational" — W1–W5 build, W6/W7 TALK

[13:55 GMT · 2026-11-04] · W6+W7 · open-questions round 25
  what → showcase/src/open-questions/2026-11-04.jsx: 12 W6 rows (shipped part vs frame box) + W7 Rails question, status open; renders, 0 console errors

[13:58 GMT · 2026-11-04] · W2+W3 · Dialog/ModalProvider container + variants float law
  what → kol-component 0.338.0: `container` on Dialog + ModalProvider (absolute in the box, no viewport fit, keys scoped to the box); apps/float Windows opens Dialog float ×2 + the confirm inline — 3/3 inside their Part boxes, 0 console errors, 0 sideways at 390
  what → validate-variants: `variant="float" tone="inverted"` legal by rule (5 allowlist rows retired), self-check fixture fails a non-float inverted; `bare` read from its branch; 0 hits in apps/float + float parts
  open → gate still exits 1 on 10 non-float hits (resume, styleguide, metric, style, stylesheet, AccountForm's expression variant, VariantsControl, TextPanel `single`) — not float

[14:00 GMT · 2026-11-04] · W1 + W4 · float chrome seams + views' frames
  what → kol-shell 0.103.0 (unpublished): FloatLayout `bottom` (a Rail under content + inspector, 24 below) and `eyebrow` (a line in the 40 under the bar, no height); AppFloatNav transport `inline` (desktop 48 capsule, float Buttons 36 · 4 apart · Timecode; phone pill below md); PropertyRail tabs TabsRow float xs; CHANGELOG · 11-shell-system · 24-float-system · shipped-packages; showcase previews FloatLayout (eyebrow + folded Task index bottom) · AppFloatNav ("transport inline" row)
  what → apps/float: RecordFloat eyebrow + filter capsule + dock via layout.eyebrow / layout.bottom; VisualEditor transport inline (transformed-box trick dropped for it); Workspace layout.bar (Studio / Dashboard · Tasks 5 … Links · search · New task); App's layout contract comment
  verify → own Chromium 1600×1080 dark + light (vite 5341, PID 70967 killed), 0 console errors: dock 64·800 1508×248 (802 ±4 ✓) · content ends 712, inspector 663 (above it ✓) · canvas top 140 ✓ · eyebrow y113 · transport 503·790 378×48 (374 ±4 ✓) · inspector tabs 26 on all three views, aria-selected = the `tab` value ✓ · workspace bar 64, text = frame, nav 72 ✓ · 390 scrollWidth 390 on all three · gates syntax · imports · props (shell clean) · taxonomy · drift ✓; shots _tmp/2026-11-04-float-operational/
  calls → eyebrow needed a FloatLayout seam (the content scroller clips anything above it) — W4.2 fixed in kol-shell, not the view; transport `inline` opt-in so kol-fxr's fixed pill is untouched; Workspace tabs static (other pages aren't this view); the crumb's ▾ is onMenu (no invented rows); api-tables.json not regenerated (another agent mid-edit in kol-component — the build regenerates it)

[14:04 GMT · 2026-11-04] · W1–W4 · main thread
  what → published kol-component 0.338.0 · kol-shell 0.103.0 (api-tables regenerated); record-tabs masthead row wraps (scrolled 581 at 390)
  verify → script over all 22 apps/float routes × 1600 + 390: 0 console errors, 0 sideways scroll (vite 5399 killed)

[14:11 GMT · 2026-11-04] · W5.1 · Figma masters the screens needed
  what → Button `tone` variant (default · primary · inverted · secondary · ghost · danger; 12 float variants added, float labels Inter Medium on font/float, iconLeft/iconRight wired on float) · TopControlsBar `start` / `end` SLOTs · EmptyState set 678:25038 (variant=float, from the code) replaces the exploration card (retired to _trash as `_EmptyState exploration card`) on Windows + Sets · PropertyRail `tab` (1 · 2) + `tab1`/`tab2`/`tabs` + `body` SLOT · Card float `rows` SLOT · `bold` icon 679:20643 · New task on record-tabs + rails → tone inverted, plus
  measured → apps/float :5301 (killed): float btn 36 md, 15.12 pad, Inter 500 13, 18 glyph; tones' grounds; EmptyState 260×206, title 18/24 mb12, footer pt24; PropertyRail xs tabs 26 (size left to 5.2)
  note → browser + star were already on Icon masters (299:107 · 299:149) with Code Connect; Code Connect published for Button · TopControlsBar · EmptyState · PropertyRail · Card · bold

[14:30 GMT · 2026-11-04] · W5.2 · Figma mirrors W1–W4
  what → FloatLayout `eyebrow` (absolute, 25 under the bar) + `bottom` (under main, 24) slots with show toggles, desktop variants · AppFloatNav `inline=true` transport (378×48, 36 ghost slots 4 apart, Timecode 12 in; 683:25029/54/79) · PropertyRail tabs xs (26 chips, in-flow 26), heads hug, slider 46 · Dialog: 24 header, `title` + `body` slot, code's content only (418×362), Cancel ghost / Export inverted · Modal confirm 562×234, Keep ghost / Delete danger · TopControlsBar: DocumentCapsule + Button instances (Panels 110, New task 128), tab chips to 543 with counts · TabsRow float sm Inter + `count` · Card float `value`
  screens → record-float (eyebrow, filter capsule + Task index in bottom, canvas at 140, Task details inspector), workspace (Studio / Dashboard crumb, tabs, search, New task; Inspector content), /, /parts, /views (EmptyState in the inspector), visual-editor (inline transport at 503,790), Windows (Dialog float ×2 in 466×480 boxes, confirm in 626×340)
  fix → W5.1's Card rows slot had dropped the screens' row overrides; record-tabs, workspace, record-float, rails cards back to the code's text; rails filter capsule real text
  measured → apps/float :5301 (killed); boxes ±4 except noted; Code Connect published (FloatLayout, AppFloatNav, Dialog, Card, TabsRow)

──────────── MILESTONE: float operational W1–W5 ──────────── [14:31]
  code: kol-component 0.338.0 · kol-shell 0.103.0 live; 22 routes × 2 widths clean · Figma: masters + screens mirrored, Code Connect published
  open → round 25 (W6 sizes · W7 Rails scope) for his ruling; library publish (his click)

[14:33 GMT · 2026-11-04] · W5.2 follow-up · two calls fixed at the source
  what → ValueField gets `trailing` + `showTrailing` (the children's ml-auto timecode note, fg-64); workspace SIZE field shows "S" at 1536,481 (live 1537). SectionHead (559:19029/19042) and Card float heads: controls group 22 tall, unclipped (the code's -my-1.5), so a head without meta is 22; workspace task padding back to 16 — rows now land exactly on live (318 · 374 · 450 · 526 · 676 · 730), rail 646
  checks → Apps page 2512 instances, 0 unlinked; Code Connect published (ValueField)

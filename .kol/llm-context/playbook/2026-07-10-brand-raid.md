# Playbook — external brand raid (buckets A–D + scan)

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** raid the studio's scattered style/brand/type/color/logo work into the DS — build kol-styleguide (A), upgrade foundry (B), add color engines (C), consolidate the brand-manifest (D). Read-only on all external repos.

**Standing rules (non-negotiable):**
- External repos (`~/dev/projects/*` except `kol-ds-ui`) are READ-ONLY / copy-only — never write/move/git an original.
- No `pnpm install` / publish (user's) — build + structurally verify only.
- Every raided component decoupled to consumer-injected props; KOL-conform (type inline, tokens, no auto-casing); /claude-kol-ds gate.

---
## Entries

[01:37 GMT · 2026-07-10] · setup · playbook created (retroactive at arc close)
  what → initialised the live playbook   why → user requested /log-work-playbook when done

──────────── MILESTONE: bucket A — kol-styleguide package ──────────── [01:37]
  built: 8 specimens (MoodTile·ColorAnatomy·ComboLab+layouts·LogoCard·ClearspaceDiagram·LogoScaling·TypeBlock·AssetTable) → new pkg v0.1.0
  + re-exports 6 shared primitives (no breaking moves) · CSS relocated framework→theme (byte-exact) + font-conformed
  wired: 8 demos + /sets/styleguide (6 sections) · preview _tmp/kol-styleguide-showcase.html · build ✓ (esbuild/taxonomy)
  log: session-log/2026-07-10-overnight-brand-raid-buckets-abcd.md

──────────── MILESTONE: bucket B — foundry engines ──────────── [01:37]
  built: useFontMetrics (opentype parse) + TypeSpecimenLive (self-measuring) → foundry 0.4.0
  deferred: para-type (parametric synth) → lobby/ParaType.md (needs mathjs + dedicated session) · build ✓

──────────── MILESTONE: bucket C — color engines ──────────── [01:37]
  built: useEyedropper + PaletteHarmonyWheel + colorMath → component 0.9.0
  finding: DS Spectrum/Swatch already richer (eyedropper affordance present) — engine was the gap · build ✓ · taxonomy ✓

──────────── MILESTONE: bucket D — brand-template schema ──────────── [01:37]
  built: one-object manifest + house defaults + emitBrandColorCss generator → brand-template 0.2.0
  client migration DOCUMENTED not executed (read-only rule) · build ✓

──────────── MILESTONE: scan + lobby + docs ──────────── [01:37]
  scan: 7 repos → future buckets E–J (E = kol-monitor video-synth patch-graph, new domain) → scan backlog addendum
  lobby: 52 built/folded specs filed queue→done/ · queue now 4 (ParaType/InteractiveImage/TailwindContentSource/TypeScaleSection)
  verify: 4 barrels parse · 7 new files present · 6 versions correct · taxonomy clean
  note → repo moved mid-run → kol-ds-ui; node_modules symlinks broke → pnpm install needed before publish/render
  UNPUBLISHED batch: styleguide 0.1.0 · component 0.9.0 · foundry 0.4.0 · brand-template 0.2.0 · theme 0.7.4 · framework 0.3.5

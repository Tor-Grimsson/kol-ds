# Playbook: two-repo operation (kol-ds-ui ⇄ kol-website)

Append-only work journal. Real timestamps. One idea per line.

- 2026-07-15 21:05 — MANDATE: agent juggles both repos directly; no more human-mediated _tmp ledgers
- 2026-07-15 21:05 — DS batch staged, gates green, user pushing: component 0.11.0 · chess 0.3.0 · framework 0.5.0 · content 0.4.0 · theme 0.8.0 · icons 0.7.0 · foundry 0.4.2 · workshop 0.1.6
- 2026-07-15 21:05 — theme 0.8.0 BREAKING-ish: kol-label-* family deleted — check website for users before bump
- 2026-07-15 21:05 — website consumer to-do on bump (from ledger-2.0 outcomes + today): retire tags pre-join shim (tagsSeparator) · titleClassName on WorkListItem lists · ThemeToggle 36/20 shim delete · copy JetBrainsMono-Italic + SemiBoldItalic woff2 into its /fonts/jetbrains-mono/ · import kol-theme/kol-sources.css once (replaces per-package @source lines) · optimizeDeps.exclude ['@kolkrabbi/kol-icons'] · swap last 2 elder CodeBlock imports (portable-text shape now upstream) · kol-segment-title still needs a ruling (ledger-1.0 #7, never closed)
- 2026-07-15 21:05 — chess app consumer to-do (brief-2.0 resolution section): mount EnginePanel/OpeningStrip via panel prop · paste flow via externalGame · ThemeToggle in overlayActions · delete /analyse fork
- 2026-07-15 21:05 — website repo at ~/dev/projects/kol-website; boot ITS agent context first (unverified whether it carries .kol/llm-context — check on entry)
- 2026-07-15 21:05 — user runs npm deprecate for kol-specimen (command in DS-CHANGES-2.0 outcomes)
- 2026-07-15 21:05 — parked in THIS repo: sidenav epic (his scoping doc) · casing arc (~28 theme rules + 3 JSX files + showcase SidebarNav) · showcase visual audit due 07-16

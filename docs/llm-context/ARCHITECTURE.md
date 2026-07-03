# kol-design-system — Architecture

Load-bearing decisions and constraints. "We chose this deliberately and it has downstream consequences." Do not revisit without explicit reason.

---

## §1 — One repo, three hats; internal-vs-external is the seam

This repo **maintains**, **hosts**, and **showcases** the KOL design system. The trick that keeps the hats from fighting is the internal/external seam:

- **Internal (maintenance + showcase):** a pnpm workspace. Packages depend on each other via `workspace:*`; the showcase consumes them via `workspace:*`. Linking here is correct and fast.
- **External (consumers):** packages are **published + versioned** to npm. Consumers `npm install @kolkrabbi/kol-*`. **No linking, no symlinks, no `workspace:*` ever reaches a consumer.**

"No linking for fresh installs" and "workspace internally" are not in conflict — they are external vs internal.

**Do not** introduce a path/symlink shortcut that lets a consumer bypass the published version.

## §2 — This repo is the source of truth

The `@kolkrabbi/kol-*` packages here are canonical. The older copies in `kol-monorepo` are downstream and migrate onto the published versions. When package code changes, it changes **here** first.

## §3 — Four UI packages (fixed) + a clients tier

`theme` (CSS only) ← `loader` (Icon) ← `component` (atoms→organisms) ← `framework` (app shell). Cross-package imports use the `@kolkrabbi/*` specifier; **within** a package, imports stay relative file-to-file. The split was derived from the recent single-app source (`_kol-labs-single-init-state`), re-packaged into the monorepo's published topology.

**Clients tier** (added 2026-07-03): headless service SDKs — **one package per service contract** (`@kolkrabbi/kol-*-client`), plain ESM, no React, no deps on or from the UI packages; the package version tracks its API contract. First: `kol-media-client`. **Do not** merge clients into a grab-bag package — unrelated contracts must not version in lock-step.

**Do not** collapse packages back into one app, and do not add reverse dependencies (e.g. component importing framework).

## §4 — Packages ship raw source; consumers must be Vite + Tailwind v4

No build step. Packages publish raw `.jsx` / `.css`. The loader uses `import.meta.glob` (Vite-only). Theme is Tailwind-v4-oriented CSS. This is deliberate (source-available, zero build infra) and constrains the consumer toolchain — documented in every package README.

**Do not** add a dist/transpile step without a reason that outweighs losing source-availability and simplicity.

## §5 — CSS cascade order is load-bearing

`tailwindcss` → `@kolkrabbi/kol-theme` → `kol-brand-color.css` → `kol-framework.css`. Framework chrome reads `--brand-*` / `--kol-*` custom properties defined upstream of it; reordering breaks theming. Documented in the root README and every consumer.

## §6 — The showcase is presentation + mined reference

`showcase/` is a Vite app that consumes the packages like any consumer. Its Components gallery renders live demos (safe atoms, error-boundaried) **and** a usage reference mined verbatim from ~25 real KOL apps via `scripts/extract-usage.mjs` → `docs/usage/*.md` + `showcase/src/usage/usage-index.json`. The reference is for both humans and LLMs.

## §N — Non-goals (do not reopen without an explicit ask)

- No build/transpile pipeline for packages (§4).
- No collapsing the four packages, no reverse deps (§3).
- No consumer-facing linking/symlinks (§1).
- No second maintenance home — changes land here, not in kol-monorepo (§2).

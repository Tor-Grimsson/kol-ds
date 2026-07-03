---
title: Distribution & consumption models
type: reference
status: active
updated: 2026-06-26
description: The three ways a design system reaches consuming apps — versioned npm package, monorepo workspace, or the shadcn copy-in CLI model — and what each implies for versioning and ownership.
tags:
  - domain/design-system
  - domain/workflow
  - domain/distribution
aliases:
  - distribution
related:
  - "[[06-versioning-testing|versioning & testing]]"
  - "[[INDEX|workflows]]"
---

# Distribution & consumption models

How the system **reaches the apps that use it**. This choice drives everything about versioning, ownership, and how updates propagate. Three common patterns — not mutually exclusive (1 and 2 often combine).

## 1 — Versioned npm package

The system is **published to a registry**; apps `npm install @scope/ui` and pin a version.

- **Clear boundary + semver.** Consumers opt into updates by bumping the version.
- Needs **release infra** — version bumps, changelogs, publish auth (see [[06-versioning-testing|versioning & testing]]).
- Update lag: a consumer is on whatever version they installed until they upgrade.
- The model for shipping to **teams/apps you don't control**.

## 2 — Monorepo workspace

The system lives in the **same repo** as the apps that use it, linked locally.

- Tooling: **pnpm / yarn / npm workspaces** for linking, **Turborepo** or **Nx** for task orchestration + caching.
- Apps consume via `workspace:*` — **always on the latest local source**, no publish step between change and use.
- **Internal-only by nature.** External consumers can't reach a workspace link — they need a published version (so monorepos that also ship externally still publish, combining 1 + 2).
- Fast iteration; the boundary is enforced by convention/lint, not by a version wall.

## 3 — The shadcn/ui copy-in model

**Not a dependency at all.** A **CLI copies component source into the consumer's repo**; they own and edit it.

- `npx shadcn add button` drops `button.jsx` into the app. It's now **their file**.
- **Maximum ownership/customization, zero version coupling** — the consumer edits freely.
- Cost: **no upstream updates**. A fix in the source doesn't reach copies already taken; each consumer maintains their own.
- Works because the components are thin (Radix + Tailwind + `cn()`); the "library" is a registry of source to copy, not runtime code.

## Comparison

| | npm package | monorepo | shadcn copy-in |
|---|---|---|---|
| Consumer gets | a versioned dep | a workspace link | source files they own |
| Updates propagate | on version bump | instantly (local) | never (manual) |
| Customization | fork/override | edit source (shared) | edit freely (theirs) |
| Versioning | semver + changelog | none internally | n/a |
| External consumers | yes | no (publish to reach them) | yes (via CLI) |
| Needs release infra | yes | no | registry, not releases |

## Reading which model is in use

- `dependencies: { "@scope/ui": "^1.2.0" }` → **package** (1).
- `workspace:*` + a `pnpm-workspace.yaml` / `turbo.json` → **monorepo** (2).
- A `components/ui/` folder of source with no matching dependency + a `components.json` → **copy-in** (3).

Many teams **don't consciously pick** — they drift into one. The pattern they're in dictates their versioning story, so it's worth naming explicitly.

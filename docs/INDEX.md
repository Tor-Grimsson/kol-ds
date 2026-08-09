---
title: KOL design-system docs
type: index
status: active
created: 2026-08-01
updated: 2026-08-01
description: Front door to the vault and its contract
aliases:
  - docs
  - docs-home
tags:
  - domain/architecture
  - audience/consumer
related:
  - "[[documentation/INDEX|KOL documentation]]"
---

# KOL design-system docs

**→ [[operations/01-release/02-shipped-packages|SHIPPED PACKAGES]]** — every `@kolkrabbi/*` package this repo ships, with versions. The one table; start here if you're looking for "what packages exist."

**[[documentation/INDEX|documentation/]]** is the design system, documented — numbered sections: overview · foundations · icons · components · compositions · brand kit · research · usage. Start with [[documentation/00-overview/INDEX|the overview]].

Anything else that lands in `docs/` is repo-related documentation that isn't the design system itself:

- **[[operations/INDEX|operations/]]** — the [[operations/01-release/02-shipped-packages|shipped-packages table]], release pipeline, and workbench (repo/CI process, not design-system content).

The deeper machinery lives **outside** the vault, at the repo root:

- `.kol/llm-context/` — agent state (architecture, current state, plan, backlog, session logs)
- `.kol/docs-framework/` — the kol-docs spec these files conform to
- `LLM_RULES.md` — the boot pointer every agent reads first

## Read contract

**`docs/` is the rules layer; `.kol/` is state.** Search here before improvising anything, and
search by **grep** — the vault is written to be found by name, not read end to end. This repo is
where rules get *deleted on purpose*: a token that looks missing may have been removed for the
exact reason you are about to re-add it. Find the doc before proposing the change.

**The one rule that outranks the rest: a summary is never the source.** Several files here
*enumerate* things that live elsewhere — a package table, a component index, a queue of specs.
They are indexes. **Answer a question about one item by opening that item's own file.**

| If the question is about | Open the enumeration | …but answer from the source |
|---|---|---|
| what this repo ships, and at what version | [[operations/01-release/02-shipped-packages\|SHIPPED PACKAGES]] | that package's own `package.json` + the registry. A table is only as fresh as its last publish |
| what a component does or accepts | [[documentation/03-components/01-inventory\|03 — component inventory]] | the component source in `packages/` — the props are the contract |
| a layout width, rail inset or breakpoint | [[documentation/01-foundations/05-layout-systems\|01 — layout systems registry]] | `04-layout-breakpoints` + `05-layout-systems` **before** grepping CSS. Deriving these from source is how a deliberately-deleted token gets re-proposed |
| whether a staged component was built | `.kol/llm-context/lobby-history/` | the shipped version cited in that record's resolution — this lobby's bar for 🟢 is a changeset, not an opinion. The 119 processed records graduated there 2026-08-01; `lobby/` is now live work only |
| what this repo still owes another | `lobby/outbox/` | the **destination's** ledger. A receipt is a dated copy; 📌 means closed there, still owed here. **Empty as of 2026-08-01** — nothing outstanding |
| the doc spec these files follow | `.kol/docs-framework/` | `~/.dotfiles/claude/packages/kol-docs/` — that copy is a copy, and nothing syncs it automatically |

**Grep entry points.** PascalCase component names (`MediaLibrary`, `ShellLayout`) are the strongest
handle — they name the source file, the docs page **and** the lobby entry. Also: `@kolkrabbi/`
package names, token prefixes (`--kol-`, `text-fg-`), and section numbers (`03-components`).

**Deliberately not under `docs/`** — live state, not published documentation: `lobby/` and its
`INDEX.md` ledger, `lobby/outbox/` (receipts for tickets this repo filed elsewhere), and
`.kol/`. An agent that assumes `docs/` is everything will miss the queue addressed to it.

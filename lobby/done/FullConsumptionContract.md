# FullConsumptionContract — define "fully consuming the DS", and let a consumer take the core without the domain packs

**Staged:** 2026-08-27 · from **kol-monitor** (user ruling, after an audit here found the app tier fully adopted and the rack tier barely)
**Change:** kol-theme — a supported CORE entry beside the umbrella; kol-ds-ui — a stated definition of full consumption and a check that certifies a repo against it

## Why this is being asked

An agent working in a consumer repo has no way to answer "am I fully consuming
the DS?" — so it guesses, and guesses wrong. In one session here it called
`.bg-fg-*` / `.text-fg-*` Tailwind utilities (they are hand-written KOL classes
in `kol-opacity.css`), and passed `var(--kol-fg-12)` through JSX three times
where `kol-opacity.css`'s own header states the rule plainly: *tokens for use in
CSS rules, classes for JSX*. The rule exists and is written down; nothing makes
a consumer meet it, and nothing tells it when it has.

The user's framing:

> "how are you fully consuming without stuff that's irrelevant to development
> (specific packages like chess and foundry)" · "then DS can say and certify
> those who are fully consuming"

## Part 1 — a consumer cannot take the core without the domain packs

`kol-theme.css` is one umbrella that imports every component pack in cascade
order, domain sets included:

```
components-atoms → -molecules → -organisms
→ -dashboards → -chess → -workshop → -foundry → -styleguide → -shell
```

kol-monitor is a video-synth rack. It will never render a chessboard, a docs
shell, a type specimen, a metrics dashboard or a brand style guide — but all
five ship. Measured here today:

| | bytes |
|---|---|
| chess · workshop · foundry · dashboards · styleguide | **81,134** |
| whole kol-theme | 360,560 |
| **share of the theme a rack app can never use** | **23 %** |

Verified in monitor's built bundle, not inferred: `.analysis-control-group`,
`.docs-card`, `.font-viewer-buttons`, `.chart__segment` and
`.kol-combo-applied-accent-strip` are all present in `dist/assets/*.css`. Plain
CSS `@import`s do not tree-shake, so every consumer of the umbrella carries all
of it.

The exports map is `{".": "./kol-theme.css", "./*": "./*"}`, so a consumer *can*
hand-assemble the core file by file — and then owns the cascade order by hand,
which is the one thing the umbrella exists to guarantee. That is not a
supported path, it is a footgun.

**Ask:** a second entry — `@kolkrabbi/kol-theme/core` — carrying the tier every
app needs (base-tokens → color → opacity → opaque → typography → typography-mono
→ type-mono-classes → type-roles → utilities → components-atoms → -molecules →
-organisms → -shell), in the same cascade order. The domain packs stay
individually importable after it, so an app that wants dashboards adds one line.
The umbrella `"."` keeps importing everything — no consumer moves unless it
chooses to.

## Part 2 — say what "fully consuming" means, and certify it

Right now the phrase has no definition, so no repo can claim it and no agent can
check it. Monitor's own audit found the split is real and per-tier: the app tier
(Home · Library · Create · Settings) is fully on the DS, and the rack tier is
hand-rolled — 996 lines of local `components.css` with 175 `var(--kol-*)` reads,
7 local atoms duplicating DS atoms across 31 module files, 47 `var()` reads in
JSX where a class exists.

**Ask:** the DS states the contract and ships the check. A rough shape, yours to
rule on:

1. **Packages** — the app tier installed (theme · component · framework · shell
   · icons · brand as applicable); no domain pack installed that the app does
   not render.
2. **Classes over tokens in JSX** — `var(--kol-*)` in JSX/TSX is a finding when
   an equivalent class exists (`bg-fg-12`, `text-fg-48`, `bg-oq-08`,
   `bg-surface-*`, `text-auto`). Tokens stay legal in CSS rules — pseudo-
   elements, descendant selectors, gradients, animations — which is what
   `kol-opacity.css` already says.
3. **`:root` bindings are the exception** — an app binding `--kol-accent-primary`,
   `--kol-media-focus`, jack-role tokens is consuming correctly, not violating.
4. **No local duplicate** of a shipped DS component; a thin seam is fine (a
   13-line wrapper adding an `iconComponent`), a fork is not.
5. **No hand-rolled CSS** for chrome the DS ships.
6. **Type** — every string on a `kol-mono-*` / `kol-helper-*` class, the
   wrap/no-wrap fault line respected; no freestyle sizing.

Then a repo is either certified or has a numbered list of what is left. A
per-repo badge / row in the DS docs is the user's call; the check and the
definition are the deliverable.

## Definition of done

- `@kolkrabbi/kol-theme/core` published and documented; the umbrella unchanged;
  a consumer swapping to it loses no core rule (diff the emitted CSS).
- The full-consumption contract written down in the docs vault, and a check a
  consumer agent can run in its own repo.
- Announced in the LLM_RULES bulletin, since it changes what every consumer's
  agent should be doing at init.
- Remainder for kol-monitor: swap to `/core`, then work its own list — the rack
  tier, the 47 JSX `var()` reads, the 7 duplicate atoms.

## Part 1 — shipped 2026-08-27 · kol-theme 0.77.0

`@kolkrabbi/kol-theme/core` — the app tier in the umbrella's order (base-tokens → color → opacity → opaque → typography → typography-mono → type-mono-classes → type-roles → utilities → atoms → molecules → organisms → shell → the design tokens); the five domain packs import individually after it. The umbrella is unchanged: its inline token block moved to `kol-design-tokens.css`, imported at the same position (checked: the core's import list is the umbrella's minus exactly `dashboards · chess · workshop · foundry · styleguide`, same order). README + `00-overview/03-install.md` carry the recipe. The bulletin is the user's to post.

## Part 2 — 🔴 held for the ruling

The definition of "fully consuming" is a law; the six-point shape above is the proposal on the table. On the yes: `00-overview/04-consumption-contract.md` (the contract, numbered) + `scripts/validate-consumption.mjs` run from a consumer's root (`pnpm dlx`-able), reporting a numbered list or a pass. kol-monitor's remainder for Part 1: swap to `/core`.

## ✅ RESOLUTION — 2026-08-27 · kol-theme 0.77.0 · docs

Part 1 — `@kolkrabbi/kol-theme/core` (theme 0.77.0): the app tier in the umbrella's order, the five domain packs import after it, umbrella unchanged (core = umbrella minus exactly those five, order checked). Part 2 — not a certificate, a checklist (user, 2026-08-27: "it's just for repos to know if they are fully using KOL"): `docs/documentation/00-overview/04-full-consumption.md` — the six checks as monitor shaped them, each with the grep to run from a consumer's root; a repo is fully consuming when every grep comes back empty, and records it as one line in its own ledger history. No script, no roster, no badge. 21 gates clean.

**Remainder here:** none — kol-monitor: swap the umbrella for `@import "@kolkrabbi/kol-theme/core"`; run the six greps and work the rack tier's list (the 47 JSX `var()` reads, the 7 duplicate atoms, the 996-line `components.css`). The LLM_RULES bulletin is the user's to post.

---
title: Tier rules
type: reference
status: active
created: 2026-09-21
updated: 2026-09-21
description: How an app is wired in this repo
tags:
  - domain/workflow
  - pattern/workflow
  - audience/agency-internal
aliases:
  - tier-rules
related:
  - "[[INDEX|Apps tier]]"
  - "[[02-media-app-plan|Media app plan]]"
  - "[[03-candidate-apps|Candidate apps]]"
---

# Tier rules

The mechanics, for this repo. The **why** is in `~/.dotfiles/docs/operations/systems/apps-tier/INDEX.md` and is not repeated here; an individual app's build order is its own page. What follows outlives any one app.

## Shape

An app is a Vite workspace under `apps/`, with its own dev script, depending on the packages by name — `@kolkrabbi/kol-component`, not a relative path. It is the same import a consumer writes, which is the point: if it resolves here it resolves there.

`packages/*` does not move under `apps/`. Published and runnable are different things and the folder split is what keeps them distinguishable.

## Publishing

**An app is never published.** `private: true` in its `package.json` is the enforcement, not a convention — everything in `packages/` is publishable by default and the release machinery walks workspaces.

Inside the repo there is no publish at all: `workspace:*` is a symlink from `node_modules/@kolkrabbi/x` to the package source, so editing a package updates every app immediately. Publishing exists for repos *outside* this one, and should happen **after** the work is proved rather than as the means of proving it.

## Ownership

**No UI component originates in an app.** When an app needs something that does not exist yet, it goes into a package and the app imports it. An app holds its fixture, its reset and its wiring — nothing else.

The failure this prevents is concrete: the media upload surface already exists twice, in kol-r2b2 and as a fork in kol-client-olina, because there was nowhere in this repo to put it. An app that grows its own components becomes a third copy that ships to nobody, while looking finished.

Where several apps share a shell — home and settings, an editor chrome, a client brand setup — the shell **becomes a package** that each imports. It is never copied per app. Same rule as the rest of the design system, one level up.

## Data

Fake, mutable, in-memory, with a reset control. No provider, no network, no credentials. Every operation the product offers must actually execute against the fixture; one that cannot be performed has not been proved. The provider is the consumer's choice and never this repo's business.

## Viewing

Two surfaces, two jobs. **Development and testing are local** — each app has its own dev script at the root (`pnpm media` beside `pnpm workbench`) and runs on its own port. **Every app also publishes to a slug** under the showcase's deploy — `ui.kolkrabbi.io/apps/<name>` — so the current state can be opened from any machine without building anything. The slug is a window, not a workspace.

Four pieces make the slug work:

- `base: '/apps/<name>/'` in the app's Vite config.
- `outDir` pointing into `showcase/dist/apps/<name>`, with `emptyOutDir: true`, built after the showcase so it is not wiped.
- A rewrite in `vercel.json` **above** the existing catch-all: `/apps/<name>/(.*)` → `/apps/<name>/index.html`. Without it, deep links fall through to the showcase's own index. Static assets are unaffected — Vercel serves real files before it applies rewrites.
- `basename="/apps/<name>"` on the app's router.

The apps share an origin with the showcase, so they share its `localStorage` — including the `kol-theme` key. An app wanting to honour a saved theme carries the same boot script `showcase/index.html` uses.

## Previews

**A preview is the file at its own aspect ratio, bounded by the frame.** User ruling, 2026-09-21: *"it just fucking takes the aspect ratio of the file and displays that."* No kind gets a forced box.

| Kind | Preview |
|---|---|
| image · video | the element at its intrinsic ratio, contained in the frame |
| audio | the player |
| markdown · code · json · yaml · text | the rendered document, height-capped to the frame, scrolling inside |
| everything else | the kind glyph |

The bound is a `max-height`, never an `aspect-ratio`. The two are not the same fix: the column preview once had **no** bound at all and a 7 KB JSON drew a pane taller than the browser, so a bound was correct — but the 3:5 that arrived with it decided a *shape*, and a short document then left most of a plate empty. Cap the height, let the content decide the rest. The overlay keeps 3:5 because that one is a sheet you read, not a thumbnail.

**One previewer.** `KindPreview` is it. The library wall grew a second, hand-rolled ladder that knew only image, poster and autoload-video, which is why every kind previewed in the column pane and nothing previewed in grid or list. A surface that cannot preview a kind calls the same component and gets the same answer.

## Gotchas

- **`publicDir`.** ARCHITECTURE §7 gives this repo exactly one `public/`, at the root, reached by each app's Vite config. An app at `apps/x/` is one level deeper than the two workspaces that predate the tier — the relative path is not the same one they use.
- **The workspace glob.** `apps/*` must be in `pnpm-workspace.yaml` or the app is invisible to the workspace and its `@kolkrabbi/*` deps resolve from the registry instead of the source — silently, and it will look like it works.
- **Repo gates.** The validators in `pnpm validate` were written when this repo had two tiers. Check whether a new one needs teaching about `apps/` rather than assuming it passes.

---
title: Using the workbench
type: playbook
status: active
updated: 2026-06-26
audience: internal
description: Zero-knowledge walkthrough of the Ladle component workbench — start it, read the UI, view components, switch states, address stories by URL, use the viewport/theme/source controls, and the HMR-vs-restart rule.
aliases:
  - using-the-workbench
  - workbench-usage
tags:
  - domain/design-system
  - domain/workflow
  - pattern/component-workbench
related:
  - "[workbench adoption plan](../../../.kol/llm-context/migration/2026-06-26-workbench-adoption.md)"
  - "[[../06-research/workflows/01-component-workbench|component workbench]]"
---

# Using the workbench

The **workbench** is a Ladle app that renders KOL components in isolation — one component, one state at a time — outside any real app. You use it to build, eyeball, and sanity-check components across every state without clicking through a running product.

A **story** is the unit: a single function that renders one component in one state (e.g. `Button` → `Disabled`). Stories live in `workbench/src/*.stories.jsx` and are grouped by component in the sidebar.

> Assumes the repo is cloned and `pnpm install` has been run. Nothing else.

## 0. Prerequisites

- Node 20+ and `pnpm` (the repo pins `pnpm@9.15.0`).
- Dependencies installed: `pnpm install` at the repo root.
- You're in the repo root: `kol-design-system/`.

## 1. Start the workbench

```bash
pnpm workbench
```

Runs `ladle serve` for the `workbench` package. It prints a URL — normally `http://localhost:61000/`. If 61000 is busy it climbs (61001, 62002, …); a high port is the tell that an old server is still running.

## 2. Open it in a browser

Open the printed URL. You land on a default story with the workbench UI around it.

## 3. Read the layout

Three regions:

- **Centre — canvas:** the live component renders here on a blank stage (top-left of the canvas), with the real KOL theme, classes, and brand fonts applied. One component, one state — sparse on purpose.
- **Right edge — sidebar:** a **Search** box on top, and a **tree** of components (Button, Icon, Table…), each expandable into its stories.
- **Bottom-left — toolbar:** six icon controls — theme (light/dark, the 💡), fullscreen, viewport, text-direction (RTL), view-source (`</>`), and about.

## 4. Browse the component tree

Click a component name (e.g. **Button**) to expand it. Its stories appear nested beneath: `Variants`, `Sizes`, `With icons`, `States`, `As link`. Each story is one view/state.

## 5. View a component

Click a story (e.g. **Button → Variants**). The canvas renders it live. `Variants` shows all five button variants side by side — primary, secondary, accent, outline, ghost — each in its real theme colour.

## 6. Switch between states

Click the sibling stories under the same component to move through its states — e.g. **Button → States** (default / disabled / selected / quiet), then **With icons**, then **Sizes**. This is the core loop: a component's value is behaving correctly across *all* of them, and here they're all one click apart.

## 7. Jump straight to a story by URL

Every story has its own address: `…/?story=button--states`. The pattern is `<file>--<export>` lower-cased (`Button.stories.jsx` → `button`, export `States` → `button--states`). Bookmark or share a specific state directly.

## 8. Search for a component

Type in the sidebar **Search** box to filter the tree by name — faster than scrolling once there are many components.

## 9. Resize the viewport (responsive)

Click the **viewport** control (toolbar) to constrain the canvas to preset widths. Use it to check a component's responsive behaviour without resizing the whole browser.

## 10. Toggle light / dark and RTL

- The workbench **defaults to dark** (`data-theme="dark"`), matching the design system's own default. The **Theme** toggle (💡) flips light ⇄ dark, and KOL's tokens switch correctly with it — both modes have verified contrast.
- **Heads-up:** browser extensions that recolor pages (**Dark Reader** and similar) fight the theme and make components look broken — vanishing text, wrong colours. Disable them for the workbench tab; it's the extension, not the component.
- **RTL** flips text direction to right-to-left — a quick check for bidi-sensitive layouts.

## 11. View a story's source code

Click the **view-source** control to see the exact JSX behind the current story — the canonical "how do I call this component" snippet.

## 12. Go fullscreen

Click **fullscreen**, or press **`f`**, to hide the workbench chrome and see the component on a clean canvas. Press `f` again to exit.

## 13. Edit a component or a story — it hot-reloads

Change a component's source in `packages/<pkg>/src/…`, **or** edit an existing `*.stories.jsx`, and save. The canvas **hot-reloads** automatically — no refresh, no restart. This is the live build loop.

## 14. Add a NEW story file — restart required

When you add a **new** story *file* (e.g. `workbench/src/Slider.stories.jsx`), Ladle's `meta.json` notices it but the in-browser story list does **not** hot-add it — you'll get "Story not found". Restart the server:

```bash
# Ctrl-C in the workbench terminal, then:
pnpm workbench
```

Editing an existing file never needs this — only brand-new files do.

## 15. Write a story (the shape)

Stories import the component **by package name** (not a relative path) and export one function per view:

```jsx
// workbench/src/Slider.stories.jsx
import { Slider } from '@kolkrabbi/kol-component'

export const Default = () => <Slider value={50} />
export const Disabled = () => <Slider value={50} disabled />
```

Full convention + the why-not-colocated reasoning: `workbench/README.md`.

## 16. Stop the workbench

`Ctrl-C` in the terminal running it. (If a story page later loads on an unexpectedly high port, an old server didn't die — find and stop it.)

## 17. Build a shareable static version (optional)

```bash
pnpm --filter workbench ladle:build
```

Outputs a static site to `workbench/build/` — the whole workbench as plain files you can host or hand off. Not required for daily use.

## 18. Verification

You've got it working if you can:

1. `pnpm workbench` → open `http://localhost:61000/`.
2. Expand **Button**, open **States**, and see the **disabled** button rendered dimmed and on-brand.
3. Click **viewport** and watch the canvas narrow.
4. Click **view-source** and read the story's JSX.

If all four work, the workbench and your design system are wired correctly.

---
title: Authoring stories
type: playbook
status: active
created: 2026-08-01
updated: 2026-08-01
audience: internal
description: Writing a story, and the restart rule
tags:
  - domain/workflow
  - audience/agency-internal
  - pattern/component-workbench
related:
  - "[[INDEX|using the workbench]]"
---

# Authoring stories

Editing a component or story, adding a new story file, the shape a story takes, and shipping a static build.

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

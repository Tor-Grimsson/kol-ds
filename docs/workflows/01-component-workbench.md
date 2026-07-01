---
title: The component workbench
type: guide
status: active
updated: 2026-06-26
description: The "component workbench" category — render UI outside the app, one state at a time. The story as the unit, and the stack of jobs a workbench covers.
tags:
  - domain/design-system
  - domain/workflow
aliases:
  - component-workbench
  - workbench
related:
  - "[[02-workbench-tools|workbench tools]]"
  - "[[INDEX|workflows]]"
  - "[[workbench/01-using-the-workbench|using the workbench]]"
---

# The component workbench

A separate dev environment whose only job is to **render your components outside the app**, one component — or one state of a component — at a time. Also called a *component explorer*. Storybook is the dominant example; it's a category, not one tool.

Instead of launching the app and clicking through to reach a state, you open the workbench and **every variant is already laid out and directly addressable**.

## The mental model: the story

A **story** is a single function that renders a component in one specific state.

```jsx
// Button.stories.jsx
export const Primary   = () => <Button variant="primary">Save</Button>
export const Disabled  = () => <Button disabled>Save</Button>
export const Loading   = () => <Button loading>Save</Button>
export const WithIcon  = () => <Button icon="check">Save</Button>
```

You write stories next to the component. The collection becomes a browsable sidebar.

**Why it's sticky — write once, reuse four ways.** The same set of stories simultaneously serves as:

1. the **dev surface** (build the component by building its states),
2. the **docs** (browsable, always current),
3. the **manual-QA surface** (every state on one screen),
4. the **input to automated tests** (visual regression, interaction, a11y all read the stories).

## How it changes development

You build a component by building its stories — which **forces you to think in all states up front**, including the awkward ones (empty, error, very long text, loading) that are easy to forget when you only ever hit the happy path inside an app.

For a design system this fits especially well: a DS component's whole value is behaving correctly across **every state and prop combination, in isolation from any app context**.

## The stack of jobs

A workbench is a *stack*. You can adopt any slice — the lower rungs are the point, the upper ones are optional weight.

| Rung | Job | Notes |
|---|---|---|
| 1 | **Isolated rendering** | One component, one state, outside the app. The floor — every tool does this. |
| 2 | **Stories** | States as functions. The "write once, reuse four ways" hook. |
| 3 | **Controls** | Auto-generated prop knobs from the component's props. Designer-facing; tweak props live, no code. |
| 4 | **Addons** | a11y/axe per story, viewport/responsive, interaction replay (script click/type/assert). |
| 5 | **Visual regression** | Screenshot every story per commit, flag pixel diffs. The "ship safely" end. |

Which tool you pick is just **where on this stack it stops** — see [[02-workbench-tools|workbench tools]].

## It runs on a Vite + Tailwind stack natively

Modern workbenches use **Vite** as the builder, so they reuse the existing Vite config. **Tailwind** works by importing the compiled CSS once in a global config file — every story picks it up.

## Honest tradeoffs

- A workbench is a **real dependency** with its own config, build, and upgrade burden.
- It can feel **heavy for a small system** — which is why lighter Vite-native alternatives exist.
- Some teams skip a dedicated tool and **bake a component playground into a docs site** instead.

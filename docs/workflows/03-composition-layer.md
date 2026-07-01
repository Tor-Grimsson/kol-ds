---
title: The composition layer — behavior primitives + variants
type: guide
status: active
updated: 2026-06-26
description: The layer between Tailwind utilities and a finished component — headless behavior/a11y primitives (Radix, React Aria, Base UI) and variant management (CVA + tailwind-merge).
tags:
  - domain/design-system
  - domain/workflow
  - domain/accessibility
aliases:
  - composition-layer
related:
  - "[[01-component-workbench|component workbench]]"
  - "[[INDEX|workflows]]"
---

# The composition layer

Tailwind gives you classes. A *component* needs two more things on top: **behavior + accessibility**, and **a way to manage variant classes**. This is where hand-rolled Tailwind systems most often differ from team setups — they hand-build both. There's a standard layer for each.

A workbench surfaces this layer: you end up writing a story per variant and per interaction state, which makes visible **how much behavior you're hand-rolling**.

---

## Part 1 — Behavior / a11y primitives (headless)

Rather than building dropdowns, dialogs, and comboboxes from scratch, most teams **compose on headless primitives**: libraries that supply **keyboard handling, focus management, and ARIA** but ship **no styles**. You bring the Tailwind classes.

"Headless" = behavior without appearance. The primitive owns the hard, invisible correctness work; you own the look.

| Library | By | Shape | Notes |
|---|---|---|---|
| **Radix UI** | WorkOS | unstyled components | The common default. Broad set (Dialog, Popover, Dropdown, Tooltip…). |
| **React Aria** | Adobe | hooks | The most thorough a11y/i18n; more wiring, more control. |
| **Base UI** | Radix + MUI authors | unstyled components | Newer, from the people behind Radix and MUI. |
| **Headless UI** | Tailwind Labs | unstyled components | Smaller set (Menu, Listbox, Dialog, Combobox…); pairs natively with Tailwind. |
| **Ark UI** | Chakra team | components (Zag state machines) | Multi-framework (React/Vue/Solid). |

**Why it matters:** keyboard nav, focus traps, `aria-*` wiring, screen-reader semantics, and edge cases (typeahead in a listbox, focus restore on close) are **easy to get wrong by hand and expensive to retrofit**. The primitive is where that correctness lives.

The styled, popular systems are mostly **headless primitive + Tailwind**: shadcn/ui is Radix + Tailwind; many others sit on React Aria or Radix.

---

## Part 2 — Variant management

A component has variants (`primary`/`secondary`, `sm`/`md`/`lg`, `disabled`, `loading`). The question is **how you turn props into class strings**.

### The hand-rolled way

Conditional class concatenation:

```jsx
className={`btn ${variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-100'} ${size === 'lg' ? 'px-6 py-3' : 'px-4 py-2'} ${disabled ? 'opacity-50' : ''}`}
```

Works, but gets unreadable fast and **silently conflicts** — pass two classes that set the same property and the cascade, not your intent, decides.

### The standard tooling

- **clsx** (or `classnames`) — conditional concatenation, cleaned up. `clsx('btn', isActive && 'btn-active')`.
- **tailwind-merge** — **dedupes conflicting Tailwind classes**, last-wins. `twMerge('px-2 px-4')` → `'px-4'`. Solves the override problem above, essential when a base component takes a `className` prop from a consumer.
- **CVA** (`class-variance-authority`) — declare a **variant → class map** once, get a typed function:

```js
const button = cva('inline-flex items-center rounded font-medium', {
  variants: {
    variant: { primary: 'bg-blue-600 text-white', secondary: 'bg-gray-100' },
    size:    { sm: 'px-3 py-1.5 text-sm', lg: 'px-6 py-3 text-lg' },
  },
  defaultVariants: { variant: 'primary', size: 'sm' },
})
// button({ variant: 'secondary', size: 'lg' })
```

- **`cn()`** — the shadcn convention: a one-liner wrapping **clsx + tailwind-merge** so every component merges classes safely.

```js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...args) => twMerge(clsx(args))
```

### `asChild` / slot merging

A related pattern from Radix: `asChild` lets a component **render as its child element** instead of its own, merging props/classes onto it — so `<Button asChild><a href>` produces a styled anchor, not a button wrapping an anchor. Composition without wrapper-div soup.

---

## How the two parts combine

The full modern recipe for one styled, accessible component:

> **headless primitive** (behavior + ARIA) → **CVA** (variant → classes) → **`cn()`** (safe merge with consumer overrides) → **Tailwind** (the actual styles).

shadcn/ui is exactly this stack made copy-pasteable.

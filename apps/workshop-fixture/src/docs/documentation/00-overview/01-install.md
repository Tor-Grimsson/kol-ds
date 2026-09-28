---
title: Install
type: guide
status: active
created: 2026-06-15
updated: 2026-09-18
description: Adding the packages to an app
tags:
  - domain/distribution
  - audience/consumer
---

# Install

Three packages and one CSS import order.

## Packages

```bash
pnpm add @fixture/theme @fixture/component @fixture/icons
```

## CSS order

The order is load-bearing: `tailwindcss` → `@fixture/theme` → the app's own sheet.

1. Import Tailwind first.
2. Import the theme second.
3. Import app CSS last.

## Fonts

Fonts are **served by the app** at `/fonts/`, never bundled.

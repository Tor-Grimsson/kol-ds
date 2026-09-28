---
title: Placement
type: reference
status: active
created: 2026-07-09
updated: 2026-09-22
description: Which tier and which package
tags:
  - domain/components
  - domain/architecture
  - pattern/structure
---

# Placement

## The membership test

A component belongs to the package whose job it does. An atom that only one app uses stays in
that app.

## Imports

- Across packages: by package name.
- Within a package: relative, file to file.
- Never upward: an atom never imports an organism.

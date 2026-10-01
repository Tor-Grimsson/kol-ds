---
title: Atoms
type: index
status: active
created: 2026-09-30
updated: 2026-09-30
description: One interface element that paints and stands alone
tags:
  - domain/components
  - domain/components/atoms
---

# Atoms

An atom is an **irreducible interface element** — one control, one indicator, one content primitive. Its visible parts cannot be named as other KOL components.

Two tests decide it:

1. **It paints.** Strip every child and every prop — something still renders. A wrapper that paints nothing is a utility.
2. **It stands alone.** It means something on an empty canvas. A mark only ever drawn onto something else, or a state another component falls back to, belongs to that component.

One element with elaborate behavior is still an atom — a rotary dial does a lot and decomposes into nothing nameable. A single-value selection control (a segmented toggle, a view toggle) is one atom: its cells are options of one control, not buttons.

Every package's atoms sit here together — a rack knob beside a button — because the ladder is about anatomy. A knob belongs to the panel tier's own scale, but it is still one element.

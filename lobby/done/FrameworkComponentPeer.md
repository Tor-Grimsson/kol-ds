---
component: FrameworkComponentPeer
source: kol-website/pnpm-workspace.yaml#L8-L14
staged: 2026-08-26
status: draft
deps: [kol-framework, kol-component, kol-icons]
---

# FrameworkComponentPeer — kol-framework still nests its own kol-component

## Purpose

`NestedDsDependencies` (closed 2026-08-26) moved the DS tier to
`peerDependencies` in the five app packages and left, by its own note,
"kol-framework → component/icons, kol-component → icons and kol-styleguide →
component/foundry/icons/theme still declare `dependencies`; framework moves
with its next publish if ruled."

The first consumer bump after that wave hit it. kol-website bumped
kol-component 0.68.1 → **0.69.1** (the `MediaLibraryReconcile` return) and
`pnpm why @kolkrabbi/kol-component` answered **Found 2 versions** in both apps:

```
@kolkrabbi/kol-component@0.68.1
└─┬ @kolkrabbi/kol-framework@0.24.0      dependencies: { "@kolkrabbi/kol-component": "^0.68.1" }
```

A 0.x caret never reaches the next minor, so every Button / ThemeToggle /
Tooltip kol-framework renders (Navbar · SideNav · ShellHeader) is 0.68.1 while
the app is on 0.69.1 — two copies of the molecules, one hairline apart.

## Ask

Same shape as the five: `@kolkrabbi/kol-component` and `@kolkrabbi/kol-icons`
move from `dependencies` to `peerDependencies` with `>=` floors in
kol-framework (and kol-component → kol-icons, kol-styleguide → its four, if
the wave has room). Republish; changelog flags it BREAKING like the others.

## Stopgap at the consumer (delete on return)

`pnpm-workspace.yaml` `overrides: '@kolkrabbi/kol-component': ^0.69.1` — the
pnpm-10 home for a forced single copy; comment names this ticket.

## Recreation notes

Not a component. Package-manifest change + publish. Bar for 🟢: registry
`peerDependencies` carries component + icons, `dependencies` carries neither.

## ✅ RESOLUTION — 2026-08-26 · kol-framework@0.25.0 · kol-component@0.70.0 · kol-styleguide@0.2.0

kol-framework declares `@kolkrabbi/kol-component` (>=0.70.0) and `kol-icons` (>=0.18.0) as `peerDependencies`; kol-component declares `kol-icons` (>=0.18.0) as a peer; kol-styleguide declares component / foundry / icons / theme as peers — all with `workspace:^` in devDependencies, the shape of the five app packages. Registry-verified: `peerDependencies` carries the tier on all three, `dependencies` carries none of it. Every DS package that consumes the tier now declares it as a peer; the class is closed.

**Remainder here:** none — kol-website bump kol-framework 0.25.0 · kol-component 0.70.0 (· kol-styleguide 0.2.0 if used), delete the `pnpm-workspace.yaml` `overrides` block, then `pnpm why @kolkrabbi/kol-component` → ONE version.


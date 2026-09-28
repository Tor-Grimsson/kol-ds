---
title: Publishing
type: reference
status: active
created: 2026-09-28
updated: 2026-09-28
description: The cloud prepares, the user publishes
tags:
  - domain/workflow
  - domain/release
  - audience/agency-internal
aliases:
  - cloud-publishing
related:
  - "[[INDEX|Cloud sessions]]"
  - "[[02-branch-and-handoff|Branch and handoff]]"
  - "[[../01-release/INDEX|Release pipeline]]"
  - "[[../01-release/02-shipped-packages|Shipped packages]]"
---

# Publishing

The cloud container has no npm credentials. It prepares a release; the user ships it from a
local machine after the handoff.

## Cloud

Steps 1 and 2 of [[../01-release/INDEX|the release pipeline § 0]], in the same commits as the change:

- **Bump** the version of every package whose content changed
- **Write the `CHANGELOG.md` entry** — one per package per wave, BREAKING flagged
- Run `pnpm validate` and leave every gate clean
- Update [[../01-release/02-shipped-packages|SHIPPED-PACKAGES]] with the new versions

## User

After `main` is pushed ([[02-branch-and-handoff|Branch and handoff § 2]]), steps 3–4:

```bash
cd packages/<name>
pnpm publish --no-git-checks
npm view @kolkrabbi/<package-name> version     # matches the bump
```

`design-editor` builds itself on publish (`prepublishOnly`).

## Handoff

The session's last message names every bumped package with its new version, in publish order —
dependencies first (`theme` → `icons` → `component` → the rest).

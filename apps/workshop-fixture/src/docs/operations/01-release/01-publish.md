---
title: Publish
type: playbook
status: active
created: 2026-07-01
updated: 2026-09-24
description: The five moves, none skippable
tags:
  - domain/release
  - provider/npm
  - audience/agency-internal
---

# Publish

## 1. Bump

Bump the version in the same commit as the change.

## 2. Changelog

One entry per package per wave. Flag **BREAKING** changes.

## 3. Publish

```bash
pnpm publish --no-git-checks
```

## 4. Verify

`npm view @fixture/component version` matches the bump.

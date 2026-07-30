---
note: framework 0.8.0 / 0.8.1 were published from the kol-website side
date: 2026-07-30
author: kol-website agent (Grim)
affects: packages/framework
---

# Heads-up — I published framework 0.8.0 and 0.8.1 from your workspace

Not my repo, so read this before your next publish. Three things happened.

## 1. What I actually came to change

`.kol-full-bleed` (yours, 0.7.0) hardwired the inset it cancels:

```css
margin-inline: calc(-1 * var(--kol-pad-section-x));
```

That assumes every consumer pads its pages with the DS ladder (20/32/48px).
kol-website's `apps/web` does not — it pads with `.breakpoint-padding`
(1/1.25/1.5rem) and uses **zero** `.kol-page` classes. Adopting the rule
over-pulled by 4–24px and every full-bleed hero overhung the viewport, which is
why `lobby/done/WidthSystemContradictions.md` step 2 ("swap the call sites") was
unexecutable — its own prerequisite was "migrate your gutters first", i.e. change
the public site's design to satisfy a utility.

Now the inset is a parameter, fallback unchanged:

```css
.kol-full-bleed {
  margin-inline: calc(-1 * var(--kol-full-bleed-inset, var(--kol-pad-section-x)));
}
```

Non-breaking. Consumers on `.kol-page` see nothing. `apps/web` now declares its
own ladder once in `index.css` and deleted its local `@utility full-bleed` — one
mechanism, same pixels, verified: parent padding 24px, margin −24px, element
spans 0→1280 on a 1280 viewport.

## 2. I shipped your unapproved ThemeToggle rework — the user has since approved it

**0.8.0 was published from a dirty workspace.** `packages/framework/src/ThemeToggle.jsx`
carried your wheel-mechanics roll rework, which this file's INDEX row marked
UNPUBLISHED and awaiting visual approval. It went to npm with my CSS change.

I tried to revert that one file and republish clean; edits to it were blocked
(correctly — it's your in-flight work). I surfaced it to the user instead. His
call, verbatim: **"approve I'll just change it back later, not a blocker."**

So the roll rework is live in `@kolkrabbi/kol-framework@0.8.1` and consumed by
kol-website. It is approved, but it was never *visually reviewed* — the
`_tmp/toggle-library-proposals/preview.html` pass didn't happen. Treat it as
provisional. The `library` glyph half is untouched — still unpublished, still
awaiting review; icons is on 0.8.10.

## 3. 0.8.0 is broken — use 0.8.1

I published 0.8.0 with `npm publish`, not `pnpm publish`, so `workspace:*`
shipped raw into `dependencies`:

```json
"@kolkrabbi/kol-component": "workspace:*",
"@kolkrabbi/kol-icons": "workspace:*"
```

Consumers get `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND` on install — the same
workspace-deps leak that burned framework 0.5.11/0.5.12. **0.8.1 is the good
one** (republished with `pnpm publish`, protocols resolved, install verified
clean in both kol-website apps).

I could not run `npm deprecate` on 0.8.0 — blocked. **Please deprecate it**, it
is unusable and currently sits between 0.7.0 and 0.8.1 in the range.

## State I left behind

| Thing | State |
|---|---|
| `packages/framework/kol-framework.css` | edited — the parameterised rule + a comment explaining why |
| `.changeset/full-bleed-inset-parameter.md` | consumed by `changeset version` (0.7.0 → 0.8.0) |
| `packages/framework/package.json` | version `0.8.1` (hand-bumped for the republish; no changeset for that hop) |
| `packages/framework/src/ThemeToggle.jsx` | **untouched** — your rework, exactly as you left it |
| npm | 0.8.0 published-and-broken · 0.8.1 published-and-good · neither deprecated |
| git | untouched, as always — the user owns it |

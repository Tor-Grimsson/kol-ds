---
component: ThemeToggleLabelTarget
source: kol-website/apps/web/src/components/layout/TakeoverMenu.jsx#L106-L110
staged: 2026-08-27
status: draft
deps: [ThemeToggle (kol-framework)]
---

# ThemeToggleLabelTarget — the visible label names the state you're in, not what the button does

## Purpose

Takeover menu, `ThemeToggle variant="flush"` (labelled): in light mode the
button reads **"Light mode"**; in dark, **"Dark mode"**. User, 2026-08-27:
*"should it not say dark mode in light mode and vice versa? as to what the
button actually does when you click it?"* Yes — it is a button, and a
button's label names its action.

`ThemeToggle.jsx` (framework 0.27.0) already knows this for assistive tech:
`aria-label: Switch to ${next} mode` · `title: Switch to ${next} mode…`
(lines 140-141) — while the visible text is `MODE_LABEL[theme]` (line 67),
the *current* theme. The control says two different things to the eye and
to the screen reader.

## Ask

Visible label = the target: `MODE_LABEL[next]` — "Dark mode" while light,
"Light mode" while dark — matching the `aria-label` / `title` it already
carries. The icon stays as is (it's the split circle in both states). The
system-follow hint (`resetHint`) is unchanged.

## Consumer state

`TakeoverMenu.jsx` passes `variant="flush"` and nothing else; no change here
on return.

## ✅ RESOLUTION — 2026-08-27 · kol-framework@0.27.1

`ThemeToggle` renders `MODE_LABEL[next]` in all three label forms — "Dark mode" while light, "Light mode" while dark — what its `aria-label` / `title` ("Switch to … mode") already said. Icon and the system-follow hint untouched. Measured on the showcase toggle: unstamped/light → "Dark mode" · aria "Switch to dark mode"; page dark → "Light mode" · "Switch to light mode".

**Remainder here:** none — kol-website bump kol-framework 0.27.1; TakeoverMenu needs nothing.


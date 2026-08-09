---
title: Browsing components
type: playbook
status: active
created: 2026-08-01
updated: 2026-08-01
audience: internal
description: Finding a component and driving its states
tags:
  - domain/workflow
  - audience/agency-internal
  - pattern/component-workbench
related:
  - "[[INDEX|using the workbench]]"
---

# Browsing components

Navigating the tree, switching states, addressing a story by URL, and the viewport / theme controls.

## 4. Browse the component tree

Click a component name (e.g. **Button**) to expand it. Its stories appear nested beneath: `Variants`, `Sizes`, `With icons`, `States`, `As link`. Each story is one view/state.

## 5. View a component

Click a story (e.g. **Button → Variants**). The canvas renders it live. `Variants` shows all five button variants side by side — primary, secondary, accent, outline, ghost — each in its real theme colour.

## 6. Switch between states

Click the sibling stories under the same component to move through its states — e.g. **Button → States** (default / disabled / selected / quiet), then **With icons**, then **Sizes**. This is the core loop: a component's value is behaving correctly across *all* of them, and here they're all one click apart.

## 7. Jump straight to a story by URL

Every story has its own address: `…/?story=button--states`. The pattern is `<file>--<export>` lower-cased (`Button.stories.jsx` → `button`, export `States` → `button--states`). Bookmark or share a specific state directly.

## 8. Search for a component

Type in the sidebar **Search** box to filter the tree by name — faster than scrolling once there are many components.

## 9. Resize the viewport (responsive)

Click the **viewport** control (toolbar) to constrain the canvas to preset widths. Use it to check a component's responsive behaviour without resizing the whole browser.

## 10. Toggle light / dark and RTL

- The workbench **defaults to dark** (`data-theme="dark"`), matching the design system's own default. The **Theme** toggle (💡) flips light ⇄ dark, and KOL's tokens switch correctly with it — both modes have verified contrast.
- **Heads-up:** browser extensions that recolor pages (**Dark Reader** and similar) fight the theme and make components look broken — vanishing text, wrong colours. Disable them for the workbench tab; it's the extension, not the component.
- **RTL** flips text direction to right-to-left — a quick check for bidi-sensitive layouts.

## 11. View a story's source code

Click the **view-source** control to see the exact JSX behind the current story — the canonical "how do I call this component" snippet.

## 12. Go fullscreen

Click **fullscreen**, or press **`f`**, to hide the workbench chrome and see the component on a clean canvas. Press `f` again to exit.

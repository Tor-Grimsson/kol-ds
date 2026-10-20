---
component: ModalPromptPassword
source: kol-component@0.280.0/src/molecules/Modal.jsx#L131-L139 (the prompt's Input)
staged: 2026-10-19
status: draft
deps: [Modal, Input]
---

# ModalPromptPassword

## Purpose
`useModal().prompt` is the family's sign-in (Mirror, FXR, and now kol-atlas's login page), but its input is always plain text, so a password shows on screen as it is typed.

## Anatomy
Unchanged — the prompt's `Input`.

## Variants
- **Text (default):** as today.
- **Password:** `prompt(title, '', { type: 'password' })` → the Input renders `type="password"`, `autoComplete="current-password"`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `type` (prompt options) | `'text' \| 'password'` | `'text'` | the Input's `type` and `autoComplete` |

## Styling
None new.

## States & interactions
Enter submits as today; focus lands in the field as today.

## Dependencies
`Modal`, `Input`.

## Recreation notes
One option on `prompt`, passed through to the Input. Consumers: kol-atlas `apps/workspace/login/main.jsx`, kol-mirror `useSignIn`, kol-fxr's sign-in.

## Resolution — 2026-10-19 · 🟢 closed · kol-component@0.281.0

`prompt(title, '', { type: 'password' })` renders the field `type="password"` with `autoComplete="current-password"`, and `placeholder` rides in the same options. Also in this release: OK is the bright `tone="inverted"` button (it drew like Cancel), and the dialog owns the keyboard. It opens focused (field / OK), Tab cycles inside it, Enter on a focused button presses that button, and it carries `role="dialog"`/`"alertdialog"` + `aria-modal`. Verified in the showcase's useModal preview: the password field is masked and focused, the plain prompt is still text, and Tab / Shift+Tab stay inside the dialog.

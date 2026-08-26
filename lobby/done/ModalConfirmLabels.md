---
component: Modal (confirm/prompt dialogs)
source: kol-fxr — draft-restore confirm (compose state), discard confirms (MenuTop)
staged: 2026-08-12
status: draft
deps: [Modal, Button]
---

# ModalConfirmLabels — custom button labels + a wrapping title

## Purpose
`useModal().confirm()` always renders **Cancel / OK**. A restore prompt needs its buttons to SAY the outcome — "Restore" / "New file" — because "Cancel" against "Restore your last canvas?" reads as ambiguous (cancel what?). The user hit exactly this on kol-fxr's draft-restore dialog.

## Current behaviour
- `Modal.jsx`'s `ModalView` hard-codes `<Button>Cancel</Button>` / `<Button>OK</Button>`; `confirm(title)` / `prompt(title, default)` accept no options.
- The title renders `kol-helper-12` — a **line-height-1 helper class on wrapping paragraph text**, against the mono type protocol (helper = single-line chrome; wrapping text takes `kol-mono-*`).

## Ask
- `confirm(title, { okLabel, cancelLabel })` (and the same on `prompt`) — defaults stay OK / Cancel so existing callers are untouched.
- Title type class → `kol-mono-12` (or `-14`) so multi-line dialog copy gets a real line-height.

## States & interactions
Enter/Escape keep their meanings regardless of labels.

## Dependencies
None.

## Recreation notes
Also worth knowing: `useModal()`'s no-context fallback is the NATIVE `window.confirm` — kol-fxr ran months without `ModalProvider` mounted and nobody noticed because the fallback swallowed it. A dev-time console.warn in the fallback would have surfaced it immediately (your call whether that's in scope).

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-component@0.35.0** (registry-verified).
`confirm(title, { okLabel, cancelLabel })` + the same options as `prompt`'s
third arg (defaults OK/Cancel, existing callers untouched); dialog title
`kol-helper-12` → `kol-mono-12`; the no-provider fallback now warns once per
session (labels are ignored on the native fallback — also in the warn text).
Adoption is kol-fxr's: bump, mount ModalProvider, label the restore dialog.

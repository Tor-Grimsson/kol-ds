---
component: DevSectionHeader
source: kol-fxr/src/pages/DevCards.jsx#L30-L41
staged: 2026-10-22
status: draft
deps: []
---

# DevSectionHeader

## Purpose
The header for one section INSIDE a `HubDev` tab. `HubDev` ships the page frame (masthead, chip tabs, the tab's content at full width) and nothing inside a tab, so every app invents its own section label for dev content — fxr's first try was a mono label over a `kol-helper-12` paragraph, which the user ruled illegal (*"stop using helper for paragraphs, thats illegal. and make the style indicate some hierarchy"*), then *"seems very disjointed, maybe title and description is one step bigger?"* — this is the approved result (2026-10-22).

## Anatomy
```
section (flex col, gap-4)
├─ header (flex col, gap-2)
│  ├─ eyebrow      — optional, the group ("HOME", "OPEN · 2.0")
│  ├─ title        — the section ("Grid — catalog")
│  └─ description  — optional, one short paragraph
└─ children        — the section's content (cards, CompareGrid, rows…)
```

## Variants
None (single form). Eyebrow and description are each optional.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `eyebrow` | node | — | the group line; omitted → not rendered |
| `title` | node | — | the section title (required) |
| `description` | node | — | the paragraph under the title; omitted → not rendered |
| `children` | node | — | the section body |
| `className` | string | `''` | extra classes on the root |

## Styling
- Root: `flex flex-col gap-4`; header block: `flex flex-col gap-2`.
- Eyebrow: `kol-eyebrow text-fg-48` (mono 12, uppercase, tracked).
- Title: `kol-sans-heading-04 text-fg-96` (24px, sans compact, 500), rendered as `h3`.
- Description: `kol-sans-body-01 text-fg-64 max-w-[64ch]` (16px sans, 160%), a `p`. **Never `kol-helper-*` for a paragraph.**
- Drop on recreation: fxr's prop name `note` → `description`.

## States & interactions
None — static text.

## Dependencies
None. Pairs with `HubDev` (kol-shell) and `CompareGrid` (kol-component) as the content of a dev tab.

## Recreation notes
Molecule in kol-component (or beside `HubDev` in kol-shell if it should stay dev-only — DS's call). Text casing at the call site: the eyebrow's uppercase is the `kol-eyebrow` role's, not a text-transform on the component. Worth a line in `HubDev`'s docstring: "a tab's sections use DevSectionHeader". fxr adopts it and retires its local `Section` to `_tmp/`.

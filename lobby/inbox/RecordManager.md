---
component: RecordManager
source: reference — Framer CMS (screenshots in `_assets/2026-08-06-recordmanager-*.png`); filed from kol-website
staged: 2026-08-06
status: draft
deps: [Table, Tag, Button, Icon, Input, Dropdown, Tooltip, MediaRow, MediaLibrary]
---

# RecordManager

## Purpose

A full-screen CMS record surface: a reorderable record table plus a slide-over
detail panel of labeled fields. The reference is Framer's CMS ("very much
kolkrabbi coded" — user, 2026-08-06); the consumers already waiting for it are
kol-website's slide-deck manager (rows on `MediaRow`, registry `data/decks.js`),
its Library surfaces, and kol-media-admin's list views. Three screenshots in
`_assets/`: list (light), detail (light), detail (dark) — light/dark parity is
part of the ask.

## Anatomy

```
RecordManager
├─ Toolbar        add(+) · sort(⇅) · filter · search
├─ RecordTable    full-bleed rows
│  └─ Row        ⠿ drag-handle · checkbox · Title (+ open affordance on hover)
│                 · Status (interactive chip w/ dropdown) · Slug (mono)
│                 · thumbnail cell · Focus (select)
└─ RecordPanel    slide-over, right, full-height
   ├─ Header      close × · overflow … · preview ▶ · save-state text · Publish (primary)
   └─ FieldRow[]  label column left · control right, one row per field
```

## Variants

The real variant axis is **FieldRow's control type**:

| type | control | in the reference |
|---|---|---|
| `text` | Input | Title; Slug (with derived-URL hint line under it) |
| `status` | interactive status chip opening a menu | Live ▾ |
| `select` | Dropdown | Cover Focus, Image N Focus |
| `media` | thumbnail + remove × | Cover Image, Thumbnail, Image 1–5 |
| `file` | filename token + remove × | Video Feature, Video Loop |

RecordPanel itself: slide-over (reference) vs full-page are the same stack.

## Props (sketch — DS agent's call on final shape)

| prop | type | default | controls |
|------|------|---------|----------|
| `columns` | array | — | table column spec (accessor/header/render, same contract as `Table`) |
| `rows` | array | — | record list |
| `onReorder` | fn(from, to) | — | drag-handle sort; absent → handles hidden |
| `onSelectRow` | fn(row) | — | opens the panel |
| `fields` | array | — | FieldRow specs `{key, label, type, options?}` |
| `value` / `onChange` | object / fn | — | the open record's field values |

## Styling

**This brief is from screenshots, not consumer code — there are no classes to
transcribe. Choose tokens from the KOL ladders; do not invent values.**

- Status chip is **interactive → `Tag`**, never Pill (chip taxonomy: Pill static
  / Tag interactive / Badge status; chips default `sm`).
- Slug + filename tokens: mono, single-line chrome → the `kol-helper-*` rung.
- Row separators / panel field separators: the `fg-08` hairline already used
  repo-wide.
- Thumbnails: small fixed-aspect, rounded — same treatment as `MediaRow`.
- Light + dark from tokens alone; the two reference screenshots must both fall
  out of one markup.

## States & interactions

- Row hover: reveals ⠿ handle + open affordance; drag lifts the row and shows a
  "Reorder row N" tooltip (reference does exactly this).
- Checkbox select per row + select-all in the header.
- Status Tag opens its menu in place, in the table AND in the panel.
- Media/file fields: hover reveals the remove ×.
- Panel open/close; Publish is the single primary in the surface.

## Dependencies

Composes existing DS: `Table`, `MediaRow`, `Tag`, `Dropdown`, `Tooltip`,
`Input`, `Button`, `Icon`. Media fields should open the existing
**`MediaLibrary`** organism as the picker — do not rebuild any part of it.
No consumer helpers to replace; this is a greenfield brief.

## Recreation notes

- Tier: **organism** (`RecordManager`), with **`FieldRow` as the new molecule**
  doing most of the work — it is reusable far beyond this surface.
- Drag-reorder: a small pointer-sort util (~50 lines) before any dependency.
- All labels/casing authored at call sites — no auto text-transform.
- Ship the CSS half in kol-theme in the same wave (standing consumer law:
  component and theme move together).

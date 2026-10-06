# The doc reader takes a consumer's field config and page actions

**Staged:** 2026-10-05 · from a kol-website session
**Change:** four components in kol-workshop — `DocsFrontmatter`, `DocumentationReader`, `RightRail`, `RailRow`

---

## The problem, in one case

kolkrabbi.io's `/workshop` is becoming a hub: one markdown file per app
(Monitor, Mirror, FXR, Chess …), each rendered through `DocumentationReader`
with `docId` and `rail={false}`. The frontmatter carries the kol-docs names the
block already knows (`title · description · status · updated`) plus six of the
page's own: `url · repo · icon · image · order · embed`.

All eight pages were rendered through kol-workshop **0.38.0** untouched, on the
built app, at 1440×900 and 390×844 (component 0.239.1 · theme 0.166.0). Nothing
is broken. Six things cannot be reached from the consumer side:

| # | What renders | Where |
|---|---|---|
| 1 | `url` and `repo` print as plain text. The value branch ends in `String(value)`, so a link in frontmatter is never a link. | `DocsFrontmatter.jsx`, the value render |
| 2 | A key outside `FIELD_ICONS` gets no icon. On the Monitor page four rows carry a glyph and five do not, so the label column has two left edges — the ragged edge the file's own header forbids (*"EVERY field carries an icon"*). | `FIELD_ICONS` |
| 3 | `icon`, `image`, `order` and `embed` are the consumer's plumbing and print as rows (`Embed  true`, `Order  4`). `HIDDEN` is internal. | `HIDDEN` |
| 4 | A key outside `FIELD_ORDER` sorts alphabetically after the contract keys, with a humanised label (`Url`). The consumer can set neither position nor label. | `FIELD_ORDER`, `FIELD_LABELS` |
| 5 | A page has no place for its primary action. The reader owns the article from the frontmatter block to the last section, so a button to the live app can only sit above the block or after the last section. At 390 the right rail is in the drawer: the Monitor page shows **no link to the live app at all**. | `DocumentationReader.jsx`, the returned article |
| 6 | In the right rail, a `Related` row with a `url` opens in the same tab — `RailRow` renders `<a href>` with no target — while a body link that leaves the site opens a new one (`render-tokens.jsx`, the 2026-10-02 rule). And `actions` rows pass only `to` and `onClick`, so an action that leaves the site cannot be a link. | `RailRow.jsx`, `RightRail.jsx` |

Screenshots, both from the built app:
`_assets/reader-takes-field-config-and-page-actions_monitor-1440.png` ·
`_assets/reader-takes-field-config-and-page-actions_monitor-390.png`

## The fix

The ask is the seam, not the six keys. After it, a new field on any consumer's
page is configuration in that consumer and never another ticket here.

**A. `DocsFrontmatter` takes a per-key config**, merged over its own tables, and
`DocumentationReader` passes it through:

```jsx
<DocumentationReader
  docId={id}
  fields={{
    url:   { label: 'Live', icon: 'external-link', order: 5 },
    repo:  { label: 'Repository', icon: 'code' },
    icon:  { hidden: true },
    order: { hidden: true },
    status: { render: (value, metadata) => <Badge …>{value}</Badge> },
  }}
/>
```

Per key: `label` · `icon` · `order` · `hidden` · `render(value, metadata)`. No
config is today's output.

**B. Two defaults that need no config:**

- a value that is a URL (`^https?://`) renders as a link — printed without the
  protocol, in the reader's own link idiom, opening a new tab. Single values
  and array items (`sources`) alike.
- a key with no icon entry renders a default glyph, so the label column keeps
  one left edge whatever a document carries.

**C. `DocumentationReader` takes `actions`** — a node rendered under the title
and before the intro. Absent, nothing renders. A page carries its button
without wrapping the reader.

**D. The rail treats a link that leaves the site the way the body does:**
`RailRow` gives an external `href` `target="_blank" rel="noreferrer"`, and
`RightRail`'s `actions` accept `href` and hand it to `RailRow`.

## Rejected alternative

- **Adding `url` and `repo` to `FIELD_ICONS` / `FIELD_LABELS`.** Fixes two keys
  for one consumer and guarantees the same ticket for the next key.
- **The consumer strips keys from `metadata` before handing over the
  inventory, or sets `showFrontmatter={false}` and rebuilds a header from
  atoms.** A second frontmatter presentation that drifts from the block's
  status badge, date format and tag rendering the day either changes.
- **A stopgap in kol-website.** None was written. Its launch waits for this
  instead, so nothing there needs deleting afterwards.

## Definition of done

- [ ] `DocsFrontmatter` accepts per-key `label · icon · order · hidden · render`, and `DocumentationReader` passes it through
- [ ] a URL value renders as a link with no config, as a single value and inside an array; it opens a new tab
- [ ] a key with no icon entry renders a default glyph — no iconless row
- [ ] `DocumentationReader` renders a consumer `actions` node under the title; absent, nothing
- [ ] `RailRow` opens an external `href` in a new tab; `RightRail` actions accept `href`
- [ ] a document passing no config renders as it does today, apart from the two defaults in B
- [ ] the new props are written on the components' prop docs

## Addressed — 2026-10-06

`fields` (label · icon · order · hidden · render) through `DocumentationReader` to `DocsFrontmatter`; URL values link in a new tab, single and in arrays; default glyph for unknown keys; `actions` under the title; `RailRow` external `href` new tab, `RightRail` actions take `href`. Checked by server render (`_tmp/2026-10-06-website-tickets/fm.jsx`).

**Shipped 2026-10-06 in kol-workshop 0.39.0**, confirmed on the registry. Remainder for kol-website: bump and drop any stopgap.

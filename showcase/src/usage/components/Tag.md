# Tag

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 75 across 38 files in 14 apps
- **Weighted inbound:** 120★ across 38 edges — 6×4★ · 32×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-docs, kol-docs-md, kol-docs-noter, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-mirror, kol-modulator, kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 14 | `kol-apps/kol-docs-noter/src/pages/component-test.tsx` |
| 4 | 4 | `kol-website/apps/web/src/routes/workshop/DocsComponents.jsx` |
| 4 | 3 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/Components.jsx` |
| 4 | 3 | `kol-apps/kol-mirror/src/components/styleguide/Components.jsx` |
| 4 | 3 | `kol-apps/kol-modulator/src/components/styleguide/Components.jsx` |
| 4 | 3 | `kol-apps/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/styleguide/Components.jsx` |
| 3 | 2 | `kol-apps/kol-client-ac/src/editor/color/SwatchControls.jsx` |
| 3 | 2 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/SwatchControls.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/CollectionCard.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/fontviewer/GlyphMetricsGrid.jsx` |
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/src/editor/color/SwatchControls.jsx` |
| 3 | 2 | `kol-apps/kol-docs-noter/src/components/metadata/sections/SectionConnections.tsx` |
| … | | _26 more_ |

## Import

```jsx
import { Tag } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/editor/color/SwatchControls.jsx`:

```jsx
<Tag
      {...props}
      {...rest}
      className={`inline-block ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        borderRadius: shape === 'circle' ? '50%' : 0,
        boxShadow: '0 0 0 1px #000, 0 0 0 2px #505050',
        padding: 0,
        border: 'none',
        ...style,
      }}
    />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/editor/color/SwatchControls.jsx`:

```jsx
<Tag
      {...props}
      className={`rounded-full overflow-hidden ${className}`}
      style={{
        width: 10,
        height: 10,
        background:
          'linear-gradient(45deg, #fff 0%, #fff 42%, #DC2626 42%, #DC2626 58%, #fff 58%, #fff 100%)',
        boxShadow: '0 0 0 1px var(--ac-fg-32)',
        ...style,
      }}
    />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/molecules/CollectionCard.jsx`:

```jsx
<Tag variant="light" size="sm">
                {item.type}
              </Tag>
```

From `kol-apps/kol-docs/src/components/docs/DocsHeader.jsx`:

```jsx
<Tag id={headingId} className={`docs-heading ${headingClasses[level]}`}>
          {title}
        </Tag>
```

From `kol-apps/kol-docs-noter/src/components/note-browsing/NoteCard.tsx`:

```jsx
<Tag
                  key={tag}
                  label={tag}
                  color={note.tagColors?.[tag]}
                  variant="default"
                  size="sm"
                />
```

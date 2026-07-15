# Tag

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 71 across 35 files in 14 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-docs, kol-docs-md, kol-docs-noter, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-mirror, kol-modulator, kol-monitor, kol-website

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

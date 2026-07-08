# Tag

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 53 across 24 files in 11 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-docs, kol-labs-single, kol-lightroom, kol-mirror, kol-modulator, kol-monitor, kol-noter, kol-radar

## Import

```jsx
import { Tag } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-docs/kol-docs/src/components/docs/DocsHeader.jsx`:

```jsx
<Tag id={headingId} className={`docs-heading ${headingClasses[level]}`}>
          {title}
        </Tag>
```

From `kol-apparat/kol-docs/kol-noter/src/components/note-browsing/NoteCard.tsx`:

```jsx
<Tag
                  key={tag}
                  label={tag}
                  color={note.tagColors?.[tag]}
                  variant="default"
                  size="sm"
                />
```

From `kol-apparat/kol-editors/kol-radar/src-grab/components/styleguide/preview/molecules/ComponentPreview.jsx`:

```jsx
<Tag {...props}>{props.children}</Tag>
      case 'dropdown':
        return (
          <Dropdown
            {...props}
            value={dropdownValue}
            onChange={setDropdownValue}
          />
```

From `kol-apparat/kol-lightroom/src/pages/Library.jsx`:

```jsx
<Tag key={t} size="sm">
                {t}
              </Tag>
```

From `kol-client/kol-client-ac/src/editor/color/SwatchControls.jsx`:

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

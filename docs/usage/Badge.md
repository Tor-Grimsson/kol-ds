# Badge

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 136 across 29 files in 7 apps
- **Used in:** kol-client-ac, kol-client-kolkrabbi, kol-mirror, kol-modulator, kol-monitor, kol-noter, kol-radar

## Import

```jsx
import { Badge } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-docs/kol-noter/src/components/metadata/MetadataNote.tsx`:

```jsx
<Badge
        variant="outline"
        className="fixed top-20 right-4 z-50 cursor-pointer hover:bg-white/5 opacity-50 hover:opacity-100"
        onClick={() => setShowDummyData(true)}
      >
        <Plus className="w-3 h-3 mr-1" />
```

From `kol-apparat/kol-video/kol-mirror/a_torg/design-system/components/00-dont-touch/ui-elements/molecules/MetricSelector.tsx`:

```jsx
<Badge variant="outline" size={size} className={className}>
        Unknown
      </Badge>
```

From `kol-apparat/kol-video/kol-modulator/design-system/components/00-dont-touch/ui-elements/molecules/MetricSelector.tsx`:

```jsx
<Badge variant={variants[health]} size={size} className={className}>
      {showLabel && labels[health]}
    </Badge>
```

From `kol-apparat/kol-video/kol-monitor/a_torg/design-system/components/00-dont-touch/ui-elements/molecules/MetricSelector.tsx`:

```jsx
<Badge variant="outline" size={size} className={className}>
        Unset
      </Badge>
```

From `kol-client/kol-client-ac/src/pages/site/BlogArticle.jsx`:

```jsx
<Badge variant="outline" size="sm">{article.tag}</Badge>
            </div>
          )}
          <h1 className="kol-prose-display-md">{article.title}</h1>
          <p className="kol-prose-lede">{article.excerpt}</p>
          <Divider className="pt-4" />
```

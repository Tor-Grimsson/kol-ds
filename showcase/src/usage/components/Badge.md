# Badge

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 89 across 30 files in 8 apps
- **Weighted inbound:** 101★ across 30 edges — 3×5★ · 5×4★ · 22×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-docs-noter, kol-editor-radar, kol-labs-monorepo, kol-modulator, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 18 | `kol-apps/kol-docs-noter/src/components/app-shell/HierarchyContent.tsx` |
| 5 | 18 | `kol-apps/kol-modulator/design-system/components/00-dont-touch/app-shell/HierarchyContent.tsx` |
| 5 | 6 | `kol-apps/kol-docs-noter/src/components/metadata/sections/SectionMedia.tsx` |
| 4 | 6 | `kol-apps/kol-docs-noter/src/components/metadata/sections/SectionConnections.tsx` |
| 4 | 6 | `kol-apps/kol-docs-noter/src/components/ui-elements/molecules/MetricSelector.tsx` |
| 4 | 6 | `kol-apps/kol-modulator/design-system/components/00-dont-touch/ui-elements/molecules/MetricSelector.tsx` |
| 4 | 3 | `kol-apps/kol-editor-radar/src-grab/components/styleguide/Components.jsx` |
| 4 | 3 | `kol-apps/kol-modulator/src/components/styleguide/Components.jsx` |
| 3 | 2 | `kol-apps/kol-docs-noter/src/pages/component-test.tsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/pages/site/Blog.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/pages/site/BlogArticle.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/pages/site/BlogAuthor.jsx` |
| … | | _18 more_ |

## Import

```jsx
import { Badge } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/pages/site/BlogArticle.jsx`:

```jsx
<Badge variant="outline" size="sm">{article.tag}</Badge>
            </div>
          )}
          <h1 className="kol-prose-display-md">{article.title}</h1>
          <p className="kol-prose-lede">{article.excerpt}</p>
          <Divider className="pt-4" />
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Gallery.jsx`:

```jsx
<Badge variant={entry.type === 'video' ? 'info' : 'default'} size="sm">{entry.type}</Badge>
                  </div>
                </div>
                <a
                  href={entry.src}
                  target="_blank"
                  rel="noreferrer"
                  className="text-meta hover:text-emphasis flex-shrink-0"
                  aria-label="Open in new tab"
                >
                  <Icon name="external-link" size={16} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/dashboards/cards/DashChartCard.jsx`:

```jsx
<Badge>{badge}</Badge>}
            {currentValue && <span className="dash-detail text-fg-64">{currentValue}</span>}
          </div>
        )}
      </div>

      <div className="relative w-full flex-1 min-h-0 flex flex-col">
        {children}
      </div>

      <LegendRow legends={legends} />
```

From `kol-apps/kol-docs-noter/src/components/metadata/MetadataNote.tsx`:

```jsx
<Badge
        variant="outline"
        className="fixed top-20 right-4 z-50 cursor-pointer hover:bg-white/5 opacity-50 hover:opacity-100"
        onClick={() => setShowDummyData(true)}
      >
        <Plus className="w-3 h-3 mr-1" />
```

From `kol-apps/kol-labs-monorepo/packages/dashboards/src/cards/DashFeaturedCard.jsx`:

```jsx
<Badge className="self-start">{badge}</Badge>}
          <CardHeader icon={icon} title={title} subtitle={description} />
```

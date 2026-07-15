# Badge

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 145 across 38 files in 10 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-docs-noter, kol-editor-radar, kol-labs-monorepo, kol-mirror, kol-modulator, kol-monitor, kol-website

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

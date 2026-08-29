# ListingCard

- **Package:** `@kolkrabbi/kol-content`
- **Category:** flat
- **Real-world usages found:** 3 across 1 files in 1 apps
- **Weighted inbound:** 5★ across 1 edges — 1×5★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 3 | `kol-website/apps/web/src/components/sections/shared/StackLatest.jsx` |

## Import

```jsx
import { ListingCard } from '@kolkrabbi/kol-content'
```

## Real usage

From `kol-website/apps/web/src/components/sections/shared/StackLatest.jsx`:

```jsx
<ListingCard
              key={article.slug ?? article.title ?? index}
              size="mini"
              title={article.title}
              thumbnail={article.image}
              meta={article.meta}
              tags={article.tags}
              titleClassName="kol-card-title"
              href={articleHref(article.slug)}
              onNavigate={handleNavigate(article.slug)}
            />
```

From `kol-website/apps/web/src/components/sections/shared/StackLatest.jsx`:

```jsx
<ListingCard
                key={article.slug ?? article.title ?? index}
                size="mini"
                title={article.title}
                summary={article.summary}
                thumbnail={article.image}
                meta={article.meta}
                tags={article.tags}
                titleClassName="kol-card-title"
                href={articleHref(article.slug)}
                onNavigate={handleNavigate(article.slug)}
              />
```

From `kol-website/apps/web/src/components/sections/shared/StackLatest.jsx`:

```jsx
<ListingCard
                key={article.slug ?? article.title ?? index}
                size="hero"
                showHeader={false}
                kicker={article.kicker}
                title={article.title}
                summary={article.summary}
                thumbnail={article.image}
                tags={article.tags}
                titleClassName="kol-sans-display-03 uppercase"
                kickerClassName="kol-card-kicker"
                href={articleHref(article.slug)}
                onNavigate={handleNavigate(article.slug)}
              />
```

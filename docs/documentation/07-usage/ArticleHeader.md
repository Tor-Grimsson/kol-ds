# ArticleHeader

- **Package:** `@kolkrabbi/kol-content`
- **Category:** flat
- **Real-world usages found:** 2 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-website/apps/web/src/routes/StackArticle.jsx` |

## Import

```jsx
import { ArticleHeader } from '@kolkrabbi/kol-content'
```

## Real usage

From `kol-website/apps/web/src/routes/StackArticle.jsx`:

```jsx
<ArticleHeader
          tags={article.tags || []}
          title={article.title}
          authorName={article.author?.name}
          authorTitle={article.author?.bio || 'Author'}
          authorImage={article.author?.image}
          date={formatDate(article.publishedAt)}
          readingTime={calculateReadingTime(article.body)}
          excerpt={article.excerpt}
          heroImage={article.coverImage?.url || article.coverImage?.asset?.url || 'placeholder'}
        />
```

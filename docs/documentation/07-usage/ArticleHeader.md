# ArticleHeader

- **Package:** `@kolkrabbi/kol-content`
- **Category:** flat
- **Real-world usages found:** 2 across 1 files in 1 apps
- **Used in:** kol-website

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

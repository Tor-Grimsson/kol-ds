# WorkListItem

- **Package:** `@kolkrabbi/kol-content`
- **Category:** flat
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/Work.jsx` |

## Import

```jsx
import { WorkListItem } from '@kolkrabbi/kol-content'
```

## Real usage

From `kol-website/apps/web/src/routes/Work.jsx`:

```jsx
<WorkListItem
            title={project.title}
            titleClassName="kol-mono-12 uppercase"
            thumbnail={project.thumbnail?.url}
            tags={project.tags?.length ? project.tags : undefined}
            tagsSeparator=" · "
            type={project.type}
            year={project.year}
            description={project.description}
            previewClassName="work-display-preview text-xl md:text-5xl"
            href={`/work/${project.slug.current}`}
            active={activeIndex === i}
            onMouseEnter={() => setActiveIndex(i)}
            onNavigate={(href, e) => { e.preventDefault(); navigate(href) }}
          />
```

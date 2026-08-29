# ContentRow

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 3 across 3 files in 1 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/_tmp/2026-08-27-foundry-reconcile/TypefaceLibraryGridWithVariables.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Work.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx` |

## Import

```jsx
import { ContentRow } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/_tmp/2026-08-27-foundry-reconcile/TypefaceLibraryGridWithVariables.jsx`:

```jsx
<ContentRow
              key={typeface.link}
              variant="typeface"
              title={typeface.name}
              body={typeface.styles}
              detail={typeface.classification}
              date={typeface.year}
              href={typeface.link}
              onNavigate={go(typeface.link)}
              footer={<TypefaceAlphabet fontFamily={face.fontFamily} fontStyle={face.fontStyle} />
```

From `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx`:

```jsx
<ContentRow
            key={print.id}
            variant="article"
            media={<img src={print.image} alt={print.name} loading="lazy" className="w-full h-full object-cover" />
```

From `kol-website/apps/web/src/routes/Work.jsx`:

```jsx
<ContentRow
          key={project._id}
          variant="work"
          title={project.title}
          tags={tagNodes(project.tags)}
          meta={project.type}
          date={project.year}
          body={project.description}
          /* the face is the page's (work-display-preview); voice/ink are the DS's */
          bodyClass="work-display-preview text-2xl md:text-6xl leading-tight text-emphasis truncate"
          media={project.thumbnail?.url ? <img src={project.thumbnail.url} alt="" />
```

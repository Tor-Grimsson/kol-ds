# ContentCollection

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 6 across 4 files in 1 apps
- **Weighted inbound:** 12★ across 4 edges — 4×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-website/_tmp/2026-08-27-foundry-reconcile/TypefaceLibraryGridWithVariables.jsx` |
| 3 | 2 | `kol-website/apps/web/src/routes/Work.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Stack.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx` |

## Import

```jsx
import { ContentCollection } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/_tmp/2026-08-27-foundry-reconcile/TypefaceLibraryGridWithVariables.jsx`:

```jsx
<ContentCollection form={mode === 'card' ? 'grid' : 'list'} cols={{ md: 2, lg: 4 }} gap={24}>
          {weights.map((w) => (
            <TypefaceVariablePreview
              key={`${typeface.name}-${w.weight}`}
              typeface={typeface}
              weight={w.weight}
              weightValue={w.value}
              variant={mode}
            />
```

From `kol-website/apps/web/src/routes/Stack.jsx`:

```jsx
<ContentCollection form={list ? 'list' : 'grid'} cols={{ md: 3, xl: 4 }}>
        {items.map((article, index) => (
          <Item
            key={article.slug || index}
            variant="article"
            media={article.image ? <img src={article.image} alt="" loading="lazy" className="w-full h-full object-cover" />
```

From `kol-website/apps/web/src/routes/Work.jsx`:

```jsx
<ContentCollection form="grid" cols={{ md: 3, xl: 4 }}>
        {projects.map((project) => <WorkContentCard key={project._id} item={toCardItem(project)} />
```

From `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx`:

```jsx
<ContentCollection form={list ? 'list' : 'grid'} cols={{ md: 2, lg: 4 }}>
        {filteredItems.map((print) => (list ? (
          <ContentRow
            key={print.id}
            variant="article"
            media={<img src={print.image} alt={print.name} loading="lazy" className="w-full h-full object-cover" />
```

From `kol-website/_tmp/2026-08-27-foundry-reconcile/TypefaceLibraryGridWithVariables.jsx`:

```jsx
<ContentCollection form="list" gap={24}>
        {items.map((typeface) => {
          const face = faceFor(typeface)
          return (
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

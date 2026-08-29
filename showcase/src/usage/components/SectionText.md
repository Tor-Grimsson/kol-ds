# SectionText

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 2 across 2 files in 1 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/Stack.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Work.jsx` |

## Import

```jsx
import { SectionText } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/routes/Stack.jsx`:

```jsx
<SectionText
            align="center"
            headline="Study Stack"
            headlineSize="display-01"
            headlineCase="upper"
            headlineAs="h1"
            body="Excercises in futility, manic obsessivities & braindumpster"
            slotClass={{ headline: 'reveal', body: 'reveal' }}
            slotStyle={{ headline: { '--reveal-delay': '0.2s' }, body: { '--reveal-delay': '0.3s' } }}

            className="max-w-[720px] mx-auto"
          />
```

From `kol-website/apps/web/src/routes/Work.jsx`:

```jsx
<SectionText
                  eyebrow="Use Cases"
                  headline="Featured client work, collections, tools and ui systems"
                  headlineSize="heading-01"
                  headlineAs="h1"
                />
```

# IconFrame

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 2 across 2 files in 1 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/brand/src/components/framework/SideNav.jsx` |
| 3 | 1 | `kol-website/apps/web/src/components/ui/SectionTitle.jsx` |

## Import

```jsx
import { IconFrame } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/brand/src/components/framework/SideNav.jsx`:

```jsx
<IconFrame
          name={collapsed ? 'chevron-right' : 'chevron-left'}
          variant="secondary"
          size="lg"
          radius="full"
        />
```

From `kol-website/apps/web/src/components/ui/SectionTitle.jsx`:

```jsx
<IconFrame name={icon} variant="secondary" size="md" />
```

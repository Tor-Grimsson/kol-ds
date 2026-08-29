# FoundryCTA

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/_tmp/web-quarantine-elder/PrintDetail.jsx` |

## Import

```jsx
import { FoundryCTA } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/_tmp/web-quarantine-elder/PrintDetail.jsx`:

```jsx
<FoundryCTA
          heading="Custom Commissions"
          description="Interested in a custom piece or collaboration? Get in touch to discuss your project."
          action={{
            to: 'mailto:hello@kolkrabbi.io',
            label: 'Get in Touch'
          }}
        />
```

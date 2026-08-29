# SectionFaq

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/FoundryLicensing.jsx` |

## Import

```jsx
import { SectionFaq } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/routes/foundry/FoundryLicensing.jsx`:

```jsx
<SectionFaq
        headline="Frequently Asked Questions"
        headlineSize="heading-01"
        body="Common questions about licensing and usage"
        items={faqs.map((f) => ({ q: f.question, a: f.answer }))}
        singleOpen
        defaultOpen={0}
      />
```

# SectionNewsletter

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/components/sections/home/HomeSignup.jsx` |

## Import

```jsx
import { SectionNewsletter } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/components/sections/home/HomeSignup.jsx`:

```jsx
<SectionNewsletter
      id="signup"
      background="bg-fg-ab-16"
      inputId="newsletter-email"
      headline="Subscribe to the newsletter"
      body="Get updates on new typefaces, design resources, and selected work."
      placeholder="Your mail address"
      submitLabel="Subscribe"
      onSubmit={handleSubmit}
    />
```

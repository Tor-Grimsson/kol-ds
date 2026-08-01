# FoundryCTA

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 5 across 5 files in 2 apps
- **Weighted inbound:** 15★ across 5 edges — 5×3★
- **Used in:** kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-monitor/a_torg/archive/jsx/PrintsGrid.jsx` |
| 3 | 1 | `kol-website/_tmp/web-quarantine-elder/PrintDetail.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/FoundryLicensing.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/components/TypefacePage.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx` |

## Import

```jsx
import { FoundryCTA } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-monitor/a_torg/archive/jsx/PrintsGrid.jsx`:

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

From `kol-website/apps/web/src/routes/foundry/FoundryLicensing.jsx`:

```jsx
<FoundryCTA
        heading="Need Custom Licensing?"
        description="If you need custom licensing terms, extended technical support, or commissioned typeface work, get in touch."
        action={[
          {
            href: "mailto:hello@kolkrabbi.com",
            label: "Contact Us"
          }
        ]}
      />
```

From `kol-website/apps/web/src/routes/foundry/components/TypefacePage.jsx`:

```jsx
<FoundryCTA
            heading="Licence"
            description="TG Málrómur is available for both personal and commercial use. Please review licensing terms before use."
            action={{
              href: '/foundry/licensing',
              label: 'Licence details',
              variant: 'primary'
            }}
            onNavigate={(href, e) => { e.preventDefault(); navigate(href) }}
          />
```

From `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx`:

```jsx
<FoundryCTA
          heading="Custom Commissions"
          description="Interested in a custom piece or collaboration? Get in touch to discuss your project."
          action={{
            href: 'mailto:hello@kolkrabbi.io',
            label: 'Get in Touch'
          }}
        />
```

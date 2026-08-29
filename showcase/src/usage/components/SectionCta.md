# SectionCta

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 5 across 5 files in 1 apps
- **Weighted inbound:** 15★ across 5 edges — 5×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/components/sections/foundry/TypefacePage.jsx` |
| 3 | 1 | `kol-website/apps/web/src/components/sections/shared/SectionCtaWrapper.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/FoundryLicensing.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/FoundryTypefaces.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx` |

## Import

```jsx
import { SectionCta } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/components/sections/foundry/TypefacePage.jsx`:

```jsx
<SectionCta
            variant="centered"
            headline="Licence"
            body="TG Málrómur is available for both personal and commercial use. Please review licensing terms before use."
            actions={
              <Button variant="primary" href="/foundry/licensing" onClick={(e) => { e.preventDefault(); navigate('/foundry/licensing') }}>
                Licence details
              </Button>
            }
          />
```

From `kol-website/apps/web/src/components/sections/shared/SectionCtaWrapper.jsx`:

```jsx
<SectionCta
      className="reveal"
      background={background}
      eyebrow="/ CONNECT"
      promptLabel="WORKING ON A PROJECT?"
      heading="SEND A MESSAGE"
      contactLabel="CONTACT"
      email="hello@kolkrabbi.io"
    />
```

From `kol-website/apps/web/src/routes/foundry/FoundryLicensing.jsx`:

```jsx
<SectionCta
        variant="centered"
        headline="Need Custom Licensing?"
        body="If you need custom licensing terms, extended technical support, or commissioned typeface work, get in touch."
        actions={<Button href="mailto:hello@kolkrabbi.com">Contact Us</Button>}
      />
```

From `kol-website/apps/web/src/routes/foundry/FoundryTypefaces.jsx`:

```jsx
<SectionCta
        variant="centered"
        headline="Licence"
        body="All Kolkrabbi typefaces are free for personal and commercial use. No sign-up, no tracking, no restrictions on usage."
        actions={
          <Button variant="primary" href="/foundry/licensing" onClick={(e) => { e.preventDefault(); navigate('/foundry/licensing') }}>
            Licence details
          </Button>
        }
      />
```

From `kol-website/apps/web/src/routes/prints/PrintsGrid.jsx`:

```jsx
<SectionCta
          variant="centered"
          headline="Custom Commissions"
          body="Interested in a custom piece or collaboration? Get in touch to discuss your project."
          actions={<Button href="mailto:hello@kolkrabbi.io">Get in Touch</Button>}
        />
```

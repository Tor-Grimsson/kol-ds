# SectionHero

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 3 across 3 files in 1 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/Stack.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/FoundryLicensing.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/FoundryTypefaces.jsx` |

## Import

```jsx
import { SectionHero } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/routes/foundry/FoundryLicensing.jsx`:

```jsx
<SectionHero
        height="60"
        label={<Pill variant="subtle">Free & Open Source</Pill>}
        headline="Licensing"
        headlineSize="display-01"
        headlineAs="h1"
        body="All Kolkrabbi typefaces are free for personal and commercial use. No sign-up, no tracking, no restrictions on usage."
      />
```

From `kol-website/apps/web/src/routes/foundry/FoundryTypefaces.jsx`:

```jsx
<SectionHero
        variant="split"
        theme="inverse"
        media={<img className="kol-full-bleed-hero-media" style={{ objectPosition: '0% 50%' }} src={heroStill} alt="" />
```

From `kol-website/apps/web/src/routes/Stack.jsx`:

```jsx
<SectionHero
        fullBleed
        height="h-[90vh]"
        justify="end"
        overlap={288}
        veil
        overlayOpacity={80}
        /* ready node so the focal point is ours: centre (user 2026-08-27) */
        media={
          <img
            className="kol-full-bleed-hero-media"
            style={{ objectPosition: '50% 50%' }}
            src={`${MOOD}/mood-05-1200.jpg`}
            srcSet={`${MOOD}/mood-05-400.jpg 400w, ${MOOD}/mood-05-800.jpg 800w, ${MOOD}/mood-05-1200.jpg 1200w, ${MOOD}/mood-05-1600.jpg 1600w`}
            sizes="100vw"
            alt=""
          />
```

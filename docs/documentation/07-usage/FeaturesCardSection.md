# FeaturesCardSection

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 3 across 3 files in 1 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/routes/Home.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Studio.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/foundry/components/InDevelopmentSection.jsx` |

## Import

```jsx
import { FeaturesCardSection } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/routes/Studio.jsx`:

```jsx
<FeaturesCardSection
            headerLabel="Services"
            headerDescription="Type design, visual identity, and design systems for brands."
            actions={[{ label: 'View Work', variant: 'primary', href: '/work' }]}
            headerClassName="w-full pt-16"
            headerTextWidthClass="w-full md:w-[40%]"
            buttonGroupClassName="pt-10 pb-16"
            showActions={false}
            sectionClassName="pb-16"
          />
```

From `kol-website/apps/web/src/routes/foundry/components/InDevelopmentSection.jsx`:

```jsx
<FeaturesCardSection
      features={features}
      showHeader={true}
      headerLabel={title}
      headerDescription={description}
      showActions={false}
      sectionClassName="py-16"
      headerClassName="w-full mb-12"
      headerTextWidthClass="w-full"
      cardsWrapperClassName="self-stretch inline-flex flex-col md:flex-row md:h-72 justify-start items-center gap-6"
    />
```

From `kol-website/apps/web/src/routes/Home.jsx`:

```jsx
<FeaturesCardSection />
```

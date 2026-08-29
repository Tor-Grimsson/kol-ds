# SectionCards

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 3 across 3 files in 1 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/components/sections/foundry/InDevelopmentSection.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Home.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/Studio.jsx` |

## Import

```jsx
import { SectionCards } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-website/apps/web/src/components/sections/foundry/InDevelopmentSection.jsx`:

```jsx
<SectionCards
      features={features}
      itemClassName="reveal"
      itemStyle={(i) => ({ '--reveal-delay': `${i * 0.15}s` })}
      headline={title}
      body={description}
      sectionClassName="py-16"
      headerClassName="w-full"
      headerTextWidthClass="w-full"
      cardsWrapperClassName="self-stretch inline-flex flex-col md:flex-row md:h-72 justify-start items-center gap-6"
    />
```

From `kol-website/apps/web/src/routes/Studio.jsx`:

```jsx
<SectionCards
            features={featureCards}
            itemClassName="reveal"
            itemStyle={(i) => ({ '--reveal-delay': `${i * 0.15}s` })}
            headline="Services"
            body="Type design, visual identity, and design systems for brands."
            headerClassName="w-full pt-16"
            headerTextWidthClass="w-full md:w-[40%]"
            sectionClassName="pb-16"
          />
```

From `kol-website/apps/web/src/routes/Home.jsx`:

```jsx
<SectionCards
            features={featureCards}
            itemClassName="reveal"
            itemStyle={(i) => ({ '--reveal-delay': `${i * 0.15}s` })}
            actionsClassName="reveal-group"
            headline="Typefaces & Design Systems"
            body="A design studio focused on typography, digital products, and creative technology."
            actions={
              <>
                <Button variant="primary" href="/work">Explore Projects</Button>
                <Button variant="secondary" href="mailto:hello@kolkrabbi.io" className="border border-fg-08">Get in Touch</Button>
              </>
```

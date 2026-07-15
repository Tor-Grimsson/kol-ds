# TiltCard

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 13 across 11 files in 6 apps
- **Used in:** kol-client-kolkrabbi, kol-editor-radar, kol-mirror, kol-modulator, kol-monitor, kol-website

## Import

```jsx
import { TiltCard } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/animations/InteractivePreview.jsx`:

```jsx
<TiltCard
              src={imageSrc}
              alt="Foundry preview"
              className="w-full h-full rounded-[4px]"
            />
```

From `kol-apps/kol-editor-radar/src-grab/components/styleguide/preview/organisms/CardResp.jsx`:

```jsx
<TiltCard
            src="/img/Kolk-img/trollatunga-3.png"
            alt="Dashboard card preview"
            className="w-full aspect-[4/5] rounded-3xl overflow-hidden"
          />
```

From `kol-website/apps/web/src/components/workshop/animations/InteractivePreview.jsx`:

```jsx
<TiltCard
  src={imageSrc}
  alt="Type Design"
  className="w-full aspect-[5/4] rounded-[4px]"
/>
```

From `kol-apps/kol-monitor/a_torg/archive/jsx/ShelfCard.jsx`:

```jsx
<TiltCard
          src={project.thumbnail?.url}
          alt={project.title}
          className="w-full h-full rounded-[4px] border border-fg-04"
          variant="grounded"
        >
          <div className="absolute inset-0 z-10 flex items-center justify-center p-8 bg-surface-inverse opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p
              className="text-auto-inverse text-4xl lg:text-5xl leading-tight text-center"
              style={{ fontFamily: 'TGDylgjur', fontWeight: 400 }}
            >
              {project.title}
            </p>
          </div>
        </TiltCard>
```

From `kol-website/apps/web/src/routes/foundry/components/FoundryFeatureSection.jsx`:

```jsx
<TiltCard
          src={imageSrc}
          alt={imageAlt}
          className={imageClassName}
        />
```

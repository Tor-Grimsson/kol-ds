# FeatureSplit

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 3 across 3 files in 2 apps
- **Used in:** kol-client, kol-client-ac

## Import

```jsx
import { FeatureSplit } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client/src/pages/Landing.jsx`:

```jsx
<FeatureSplit
        kicker="01 · The fleet"
        title={<>A starbase, <em>not a style guide.</em></>
```

From `kol-apps/kol-client-ac/src/pages/site/Home.jsx`:

```jsx
<FeatureSplit
        className="min-h-[70vh] sm:min-h-screen flex items-center"
        innerClassName="max-w-none !flex flex-1 justify-center text-center"
        columnClassName="!max-w-none items-center"
        bgImage="/brand/photoshoot/33a4402.jpg"
        kicker={<span className="font-display text-[var(--burgundy-100)]">Another Creation</span>}
        title={<span className="uppercase text-[clamp(56px,8vw,96px)] font-['Right_Grotesk_Narrow'] font-medium">Timeless Quality Design</span>}
      />
```

From `kol-apps/kol-client/src/pages/client-site/Home.jsx`:

```jsx
<FeatureSplit
        kicker="The fleet command"
        title={<>Bridge software, <em>unified.</em></>
```

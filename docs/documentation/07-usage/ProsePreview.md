# ProsePreview

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 3 across 3 files in 2 apps
- **Used in:** kol-client, kol-client-canalix

## Import

```jsx
import { ProsePreview } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client/src/pages/Brand.jsx`:

```jsx
<ProsePreview
          h1="Headline"
          paragraph="Paragraph. The outcome is Acme — a federation flag flying over a coherent family of vessels, each expressing the insignia in its own mission context without losing the command voice."
          code={`const flag = 'Acme'\nconst flagship = 'Acme'`}
          pullout="strong, trustworthy, elegant · flexible under pressure"
        />
```

From `kol-apps/kol-client-canalix/src/pages/Canalix.jsx`:

```jsx
<ProsePreview
          h1="Headline"
          paragraph="Paragraph. The outcome is Canalix — a master brand sitting over a coherent family of products, each expressing the identity in its own application context without losing the parent voice."
          code={`const brand = 'Canalix'\nconst flagship = 'Casedoc'`}
          pullout="strong, trustworthy, elegant · flexible under pressure"
        />
```

From `kol-apps/kol-client-canalix/src/pages/Casedoc.jsx`:

```jsx
<ProsePreview
          h1="Bringing the power of data to justice"
          paragraph="Paragraph. Casedoc offers judicial institutions a platform dedicated to justice processes — transparent, impartial, and superior."
          code={`const flagship = 'Casedoc'\nconst parent   = 'Canalix'`}
          pullout="transparent · impartial · superior"
        />
```

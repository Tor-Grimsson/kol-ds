# Avatar

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 21 across 13 files in 7 apps
- **Used in:** kol-client, kol-client-ac, kol-client-kolkrabbi, kol-mirror, kol-modulator, kol-monitor, kol-noter

## Import

```jsx
import { Avatar } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-docs/kol-noter/src/components/app-shell/UserProfile.tsx`:

```jsx
<Avatar className="h-16 w-16">
              <AvatarImage src="" alt="User" />
```

From `kol-apparat/kol-video/kol-mirror/a_torg/design-system/components/00-dont-touch/ui-elements/atoms/Avatar.tsx`:

```jsx
<Avatar className={cn(sizeStyles[size], className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />
```

From `kol-client/kol-client/src/pages/client-site/BlogArticle.jsx`:

```jsx
<Avatar initial={author.avatarInitial} size="lg" />
```

From `kol-client/kol-client-ac/src/pages/site/BlogArticle.jsx`:

```jsx
<Avatar initial={author.avatarInitial} size="sm" />
```

From `kol-client/kol-client-kolkrabbi/src/pages/Styleguide.jsx`:

```jsx
<Avatar bg="#FCFBFB" polarity="dark" />
```

# Avatar

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 32 across 17 files in 9 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-docs-noter, kol-mirror, kol-modulator, kol-monitor, kol-website

## Import

```jsx
import { Avatar } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-acyr-website/apps/website/src/pages/site/JournalArticle.jsx`:

```jsx
<Avatar
                  initial={author.avatarInitial}
                  src={author.avatar ? urlFor(author.avatar).width(64).height(64).url() : null}
                  alt={author.name}
                  size="sm"
                />
```

From `kol-apps/kol-docs-noter/src/components/app-shell/UserProfile.tsx`:

```jsx
<Avatar className="h-16 w-16">
              <AvatarImage src="" alt="User" />
```

From `kol-apps/kol-mirror/a_torg/design-system/components/00-dont-touch/ui-elements/atoms/Avatar.tsx`:

```jsx
<Avatar className={cn(sizeStyles[size], className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />
```

From `kol-apps/kol-client/src/pages/client-site/BlogArticle.jsx`:

```jsx
<Avatar initial={author.avatarInitial} size="lg" />
```

From `kol-apps/kol-client-ac/src/pages/site/BlogArticle.jsx`:

```jsx
<Avatar initial={author.avatarInitial} size="sm" />
```

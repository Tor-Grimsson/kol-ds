# Avatar

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 28 across 16 files in 8 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-mirror, kol-modulator, kol-monitor, kol-noter

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

From `kol-client/kol-client-acyr-website/apps/website/src/pages/site/JournalArticle.jsx`:

```jsx
<Avatar
                  initial={author.avatarInitial}
                  src={author.avatar ? urlFor(author.avatar).width(64).height(64).url() : null}
                  alt={author.name}
                  size="sm"
                />
```

From `kol-client/kol-client/src/pages/client-site/BlogArticle.jsx`:

```jsx
<Avatar initial={author.avatarInitial} size="lg" />
```

From `kol-client/kol-client-ac/src/pages/site/BlogArticle.jsx`:

```jsx
<Avatar initial={author.avatarInitial} size="sm" />
```

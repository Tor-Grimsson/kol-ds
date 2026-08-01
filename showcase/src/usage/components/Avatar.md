# Avatar

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 32 across 17 files in 9 apps
- **Weighted inbound:** 55★ across 17 edges — 4×4★ · 13×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-docs-noter, kol-mirror, kol-modulator, kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 4 | 4 | `kol-apps/kol-client-ac/src/pages/Styleguide.jsx` |
| 4 | 4 | `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Styleguide.jsx` |
| 4 | 4 | `kol-apps/kol-client-kolkrabbi/src/pages/Styleguide.jsx` |
| 4 | 4 | `kol-website/apps/brand/src/pages/Styleguide.jsx` |
| 3 | 2 | `kol-apps/kol-client/src/pages/client-site/BlogArticle.jsx` |
| 3 | 2 | `kol-apps/kol-client-ac/src/pages/site/BlogArticle.jsx` |
| 3 | 2 | `kol-apps/kol-client-acyr-website/apps/website/src/pages/site/JournalArticle.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/pages/site/BlogAuthor.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/website/src/pages/site/JournalAuthor.jsx` |
| 3 | 1 | `kol-apps/kol-docs-noter/src/components/app-shell/UserProfile.tsx` |
| 3 | 1 | `kol-apps/kol-docs-noter/src/components/ui-elements/atoms/Avatar.tsx` |
| 3 | 1 | `kol-apps/kol-mirror/a_torg/design-system/components/00-dont-touch/app-shell/UserProfile.tsx` |
| … | | _5 more_ |

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

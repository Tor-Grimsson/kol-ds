# Button

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 925 across 309 files in 20 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-divs, kol-docs-noter, kol-draw-3d, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-radial, kol-svg-distress, kol-video-editor, kol-website

## Import

```jsx
import { Button } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/pages/site/Cart.jsx`:

```jsx
<Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/site/checkout')}>
                  Checkout
                </Button>
```

From `kol-apps/kol-client-acyr-website/apps/styleguide/src/pages/Demo.jsx`:

```jsx
<Button variant={variant} size={size}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)} {size}
                  </Button>
                </div>
              ))}
              <span aria-hidden="true" />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/atoms/PrintBuyButton.jsx`:

```jsx
<Button
          variant="secondary"
          size={size}
          disabled
        >
          Coming Soon
        </Button>
```

From `kol-apps/kol-divs/src/components/site/CopyButton.jsx`:

```jsx
<Button variant="outline" size={size} onClick={handle} className={className}>
      {copied ? 'copied' : 'copy'}
    </Button>
```

From `kol-apps/kol-docs-noter/src/components/app-shell/ConflictResolutionDialog.tsx`:

```jsx
<Button
              variant={localNewer ? 'default' : 'secondary'}
              onClick={onKeepLocal}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
```

# Button

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 944 across 322 files in 20 apps
- **Weighted inbound:** 1099★ across 322 edges — 24×5★ · 85×4★ · 213×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-divs, kol-docs-noter, kol-draw-3d, kol-editor, kol-editor-radar, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-radial, kol-svg-distress, kol-video-editor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 14 | `kol-apps/kol-docs-noter/src/components/overviews/OverviewSystem.tsx` |
| 5 | 13 | `kol-apps/kol-video-editor/Clypra/src/components/editor/timeline/TimelineToolbar.tsx` |
| 5 | 12 | `kol-apps/kol-docs-noter/src/components/overviews/OverviewProject.tsx` |
| 5 | 6 | `kol-apps/kol-video-editor/Clypra/src/components/screens/LaunchScreen.tsx` |
| 5 | 5 | `kol-apps/kol-docs-noter/src/components/note-editor/visual/VisualEditor.tsx` |
| 5 | 5 | `kol-apps/kol-docs-noter/src/pages/ProjectView.tsx` |
| 5 | 4 | `kol-apps/kol-docs-noter/src/components/note-editor/modular/BlockEditor.tsx` |
| 5 | 4 | `kol-apps/kol-docs-noter/src/components/vault-system/VaultProvider.tsx` |
| 5 | 4 | `kol-apps/kol-svg-distress/src/components/ControlsPanel.jsx` |
| 5 | 4 | `kol-apps/kol-video-editor/Clypra/src/components/editor/media-tabs/CaptionsTab.tsx` |
| 5 | 3 | `kol-apps/kol-client-acyr-website/apps/website/src/pages/site/LoaderDev.jsx` |
| 5 | 3 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/atoms/PrintBuyButton.jsx` |
| … | | _310 more_ |

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

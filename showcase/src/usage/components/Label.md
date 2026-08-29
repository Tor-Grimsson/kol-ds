# Label

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 22 across 17 files in 11 apps
- **Weighted inbound:** 51★ across 17 edges — 17×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-docs-noter, kol-draw-3d, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-modulator, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-apps/kol-docs-noter/src/components/app-shell/UserProfile.tsx` |
| 3 | 2 | `kol-apps/kol-docs-noter/src/components/vault-system/MigrationWizard.tsx` |
| 3 | 2 | `kol-apps/kol-editor/src/pages/AtomsPage.jsx` |
| 3 | 2 | `kol-apps/kol-editor/src/pages/ComponentShowcase.jsx` |
| 3 | 2 | `kol-apps/kol-modulator/design-system/components/00-dont-touch/app-shell/UserProfile.tsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/molecules/PropertyInput.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/website/src/components/molecules/PropertyInput.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/components/molecules/PropertyInput.jsx` |
| 3 | 1 | `kol-apps/kol-docs-noter/src/components/ui/form.tsx` |
| 3 | 1 | `kol-apps/kol-draw-3d/src/components/molecules/PropertyInput.jsx` |
| 3 | 1 | `kol-apps/kol-editor/src/components/molecules/PropertyInput.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/editor/src/components/molecules/PropertyInput.jsx` |
| … | | _5 more_ |

## Import

```jsx
import { Label } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-ac/src/components/molecules/PropertyInput.jsx`:

```jsx
<Label className="kol-helper-10">{label}</Label>
      {type === 'number' ? (
        <Stepper value={value} onChange={onChange} min={min} max={max} step={step} />
```

From `kol-apps/kol-docs-noter/src/components/app-shell/UserProfile.tsx`:

```jsx
<Label htmlFor="notifications" className="text-sm cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
```

From `kol-apps/kol-editor/src/components/molecules/PropertyInput.jsx`:

```jsx
<Label className="text-fg-48">{label}</Label>
      {type === 'number' ? (
        <Stepper value={value} onChange={onChange} min={min} max={max} step={step} />
```

From `kol-apps/kol-modulator/design-system/components/00-dont-touch/app-shell/UserProfile.tsx`:

```jsx
<Label htmlFor="dark-mode" className="text-sm cursor-pointer">
                  Dark Mode
                </Label>
                <Switch id="dark-mode" />
```

From `kol-apps/kol-client-acyr-website/apps/website/src/components/molecules/PropertyInput.jsx`:

```jsx
<Label className={labelClassName}>{label}</Label>
```

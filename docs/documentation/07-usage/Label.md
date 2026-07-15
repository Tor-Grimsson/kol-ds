# Label

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 30 across 23 files in 15 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-docs-noter, kol-draw-3d, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-website

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

From `kol-apps/kol-mirror/a_torg/design-system/components/00-dont-touch/app-shell/UserProfile.tsx`:

```jsx
<Label htmlFor="dark-mode" className="text-sm cursor-pointer">
                  Dark Mode
                </Label>
                <Switch id="dark-mode" />
```

From `kol-apps/kol-modulator/design-system/components/00-dont-touch/ui/form.tsx`:

```jsx
<Label ref={ref} className={cn(error && "text-destructive", className)} htmlFor={formItemId} {...props} />
```

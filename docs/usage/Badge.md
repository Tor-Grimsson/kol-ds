# Badge

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 137 across 30 files in 8 apps
- **Used in:** kol-client-ac, kol-client-kolkrabbi, kol-labs-single, kol-mirror, kol-modulator, kol-monitor, kol-noter, kol-radar

## Import

```jsx
import { Badge } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-docs/kol-noter/src/components/metadata/MetadataNote.tsx`:

```jsx
<Badge
        variant="outline"
        className="fixed top-20 right-4 z-50 cursor-pointer hover:bg-white/5 opacity-50 hover:opacity-100"
        onClick={() => setShowDummyData(true)}
      >
        <Plus className="w-3 h-3 mr-1" />
```

From `kol-apparat/kol-video/kol-mirror/a_torg/design-system/components/00-dont-touch/ui-elements/molecules/MetricSelector.tsx`:

```jsx
<Badge variant="outline" size={size} className={className}>
        Unknown
      </Badge>
```

From `kol-apparat/kol-video/kol-modulator/design-system/components/00-dont-touch/ui-elements/molecules/MetricSelector.tsx`:

```jsx
<Badge variant={variants[health]} size={size} className={className}>
      {showLabel && labels[health]}
    </Badge>
```

From `kol-apparat/kol-video/kol-monitor/a_torg/design-system/components/00-dont-touch/ui-elements/molecules/MetricSelector.tsx`:

```jsx
<Badge variant="outline" size={size} className={className}>
        Unset
      </Badge>
```

From `kol-apparat/kol-labs-single/src/pages/distress/components/ModesPanel.jsx`:

```jsx
<Badge key={tag} variant="secondary" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      </Section>
    </>
```

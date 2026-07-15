# ShellHeader

- **Package:** `@kolkrabbi/kol-framework`
- **Category:** framework
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Used in:** kol-website

## Import

```jsx
import { ShellHeader } from '@kolkrabbi/kol-framework'
```

## Real usage

From `kol-website/apps/web/src/workshop-system/shell/ShellLayout.jsx`:

```jsx
<ShellHeader
            brand={brand}
            nav={navItems}
            isActive={isActive}
            onNavigate={handleNavigate}
            actions={searchTrigger}
            onMenuClick={() => {
              if (window.matchMedia('(min-width: 1024px)').matches) {
                setNavCollapsed((p) => !p)
                setTocCollapsed((p) => !p)
              } else {
                setIsNavDrawerOpen(true)
              }
            }}
            onNavToggle={() => setNavCollapsed((p) => !p)}
            onTocToggle={hasToc ? () => setTocCollapsed((p) => !p) : null}
            navCollapsed={navCollapsed}
            tocCollapsed={tocCollapsed}
          />
```

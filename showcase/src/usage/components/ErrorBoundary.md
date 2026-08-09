# ErrorBoundary

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 2 across 2 files in 2 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-video-editor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-video-editor/Clypra/src/components/screens/EditorScreen.tsx` |
| 3 | 1 | `kol-website/apps/web/src/App.jsx` |

## Import

```jsx
import { ErrorBoundary } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-video-editor/Clypra/src/components/screens/EditorScreen.tsx`:

```jsx
<ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <div className="w-full h-full overflow-hidden">
          <EditorLayout />
```

From `kol-website/apps/web/src/App.jsx`:

```jsx
<ErrorBoundary>
      <HelmetProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AppRoutes />
```

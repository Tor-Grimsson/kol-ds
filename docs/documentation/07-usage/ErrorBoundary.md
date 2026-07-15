# ErrorBoundary

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 2 across 2 files in 2 apps
- **Used in:** kol-video-editor, kol-website

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

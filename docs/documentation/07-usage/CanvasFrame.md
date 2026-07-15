# CanvasFrame

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 14 across 6 files in 5 apps
- **Used in:** kol-editor, kol-editor-radar, kol-labs-monorepo, kol-mirror, kol-monitor

## Import

```jsx
import { CanvasFrame } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/Canvas.jsx`:

```jsx
<CanvasFrame
          aspect={aspect}
          customRatio={customRatio}
          bgColor={bgColor}
          guideColor={guideColor}
        >
          {children}
        </CanvasFrame>
```

From `kol-apps/kol-editor-radar/src-grab/components/mirror/MirrorViewport.jsx`:

```jsx
<CanvasFrame ratio={state.hallCanvasRatio} customWidth={state.hallCustomWidth} customHeight={state.hallCustomHeight} hallLabel="Displacement">
          <DisplacementViewport state={state} />
```

From `kol-apps/kol-labs-monorepo/apps/mirror/src/components/mirror/MirrorViewport.jsx`:

```jsx
<CanvasFrame ratio={state.hallCanvasRatio} customWidth={state.hallCustomWidth} customHeight={state.hallCustomHeight} hallLabel="Copies">
          <CopiesViewport state={state} />
```

From `kol-apps/kol-mirror/src/components/mirror/MirrorViewport.jsx`:

```jsx
<CanvasFrame ratio={state.hallCanvasRatio} customWidth={state.hallCustomWidth} customHeight={state.hallCustomHeight} hallLabel="Movement">
          <MovementViewport state={state} />
```

From `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/social/SocialLab.jsx`:

```jsx
<CanvasFrame aspect={a}>
                  <Composition image={imageUrl} imageOpacity={imageOpacity / 100} bgColor={colors.background} />
```

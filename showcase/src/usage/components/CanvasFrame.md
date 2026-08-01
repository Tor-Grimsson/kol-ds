# CanvasFrame

- **Package:** `@kolkrabbi/kol-component`
- **Category:** organisms
- **Real-world usages found:** 14 across 6 files in 5 apps
- **Weighted inbound:** 26★ across 6 edges — 4×5★ · 2×3★
- **Used in:** kol-editor, kol-editor-radar, kol-labs-monorepo, kol-mirror, kol-monitor

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 3 | `kol-apps/kol-editor-radar/src-grab/components/mirror/MirrorViewport.jsx` |
| 5 | 3 | `kol-apps/kol-labs-monorepo/apps/mirror/src/components/mirror/MirrorViewport.jsx` |
| 5 | 3 | `kol-apps/kol-mirror/src/components/mirror/MirrorViewport.jsx` |
| 5 | 3 | `kol-apps/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/mirror/MirrorViewport.jsx` |
| 3 | 1 | `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/Canvas.jsx` |
| 3 | 1 | `kol-apps/kol-editor/docs/editor-port/from-kol-ac/color-review-refs/generators/social/SocialLab.jsx` |

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

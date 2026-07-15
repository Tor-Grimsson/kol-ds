# GameArchiveTable

- **Package:** `@kolkrabbi/kol-chess`
- **Category:** apparatus
- **Real-world usages found:** 4 across 4 files in 3 apps
- **Used in:** kol-client-kolkrabbi, kol-labs-monorepo, kol-website

## Import

```jsx
import { GameArchiveTable } from '@kolkrabbi/kol-chess'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/chess/src/pages/ChessComponents.jsx`:

```jsx
<GameArchiveTable onGameLoad={(game) => console.log('Game loaded:', game)} />
```

From `kol-website/apps/web/src/routes/workshop/ChessComponents.jsx`:

```jsx
<GameArchiveTable chessData={chessData} onGameLoad={(game) => console.log('Game loaded:', game)} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessAnalysisLayout.jsx`:

```jsx
<GameArchiveTable onGameLoad={handleGameLoad} />
```

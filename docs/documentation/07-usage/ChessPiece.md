# ChessPiece

- **Package:** `@kolkrabbi/kol-chess`
- **Category:** flat
- **Real-world usages found:** 10 across 6 files in 2 apps
- **Used in:** kol-client-kolkrabbi, kol-labs-monorepo

## Import

```jsx
import { ChessPiece } from '@kolkrabbi/kol-chess'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/AlternativeControlsMock.jsx`:

```jsx
<ChessPiece piece={piece} color={color} size="32px" pieceSet={pieceSet} />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/chess/apparatus/AlternativeControlsMock.jsx`:

```jsx
<ChessPiece piece={PIECE_MAP[piece]} color={color === 'white' ? 'black' : 'white'} size="20px" pieceSet={pieceSet} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessBoard.jsx`:

```jsx
<ChessPiece piece={pieceName} color={pieceColor} size={piecePixelSize} pieceSet={pieceSet} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessSidebar.jsx`:

```jsx
<ChessPiece key={`white-${piece}-${index}`} piece={piece} color="white" size={piecePixelSize} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/chess/apparatus/ChessSidebar.jsx`:

```jsx
<ChessPiece key={`black-${piece}-${index}`} piece={piece} color="black" size={piecePixelSize} />
```

import { ChessBoardWithSidebar } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

export const stage = 'full'

/* Board + sidebar composite in the `.board-playback` grid — transport
 * toolbars above, fluid board left, sidebar (game picker, piece palette,
 * playback) right. ChessControlsProvider lives inside; the `/data` adapter
 * seeds it with the sample games, so the first game is loaded and every
 * control is live — no network. `onToggleFullscreen` stays null: the
 * fullscreen branch is ChessBoardFullscreen's own demo. */
export default function ChessBoardWithSidebarDemo() {
  return <ChessBoardWithSidebar chessData={chessData} />
}

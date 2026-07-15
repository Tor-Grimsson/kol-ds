import { ChessAnalysisLayout } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

export const stage = 'full'

/* The 100dvh board-first stage: Games button opens the archive in a
 * FullscreenOverlay; loading a game closes it, landing focus on the board.
 * Data is consumer-injected via the package's `/data` adapter — the provider
 * inside seeds the board with the sample games, fully live.
 *
 * The real layout is viewport chrome (h-dvh root) — frame it for the docs
 * page and neutralise the viewport sizing, SideNav-style: `[&>div]:h-full`
 * out-specifies `h-dvh` so the apparatus fits the frame instead of the
 * viewport. The archive overlay is position:fixed, so it still escapes the
 * frame and covers the page — the real behavior. Page framing (x padding)
 * is the consumer's job, hence px-4 on the frame. */
export default function ChessAnalysisLayoutDemo() {
  return (
    <div className="relative h-[44rem] overflow-hidden rounded-[var(--kol-radius-sm)] border border-fg-12 px-4 [&>div]:h-full">
      <ChessAnalysisLayout chessData={chessData} />
    </div>
  )
}

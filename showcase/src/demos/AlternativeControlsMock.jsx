import { AlternativeControlsMock, ChessControlsProvider } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

export const stage = 'md'

/* The dense controls rail — setup toolbar, piece-set/board-theme pickers,
 * piece palette, game picker, material bar, captured pieces, notation, and
 * the playback unit. It reads everything from ChessControlsContext, so it
 * must sit inside a provider; the `/data` adapter seeds it with the sample
 * games, first game auto-selected — fully live, no network. The rail is
 * married-height chrome (min-h-full / lg:h-full with internal notation
 * scroll), so give it a fixed-height frame to marry into. */
export default function AlternativeControlsMockDemo() {
  return (
    <ChessControlsProvider chessData={chessData}>
      <div className="h-[36rem] w-full overflow-y-auto rounded-[var(--kol-radius-sm)] border border-fg-12">
        <AlternativeControlsMock />
      </div>
    </ChessControlsProvider>
  )
}

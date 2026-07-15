import { PlaybackControls, ChessControlsProvider } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

export const stage = 'hug'

/* PlaybackControls reads its transport (step/play/jump) from ChessControlsContext,
 * so it must sit inside a provider. Data is consumer-injected: the package's
 * `/data` adapter seeds the provider with the sample games, making the
 * controls fully live here — no network. */
export default function PlaybackControlsDemo() {
  return (
    <ChessControlsProvider chessData={chessData}>
      <div className="w-full max-w-[22rem]">
        <PlaybackControls />
      </div>
    </ChessControlsProvider>
  )
}

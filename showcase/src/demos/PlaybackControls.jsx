import PlaybackControls from '../workshop/chess/apparatus/PlaybackControls.jsx'
import { ChessControlsProvider } from '../workshop/chess/context/ChessControlsContext.jsx'

export const stage = 'hug'

/* PlaybackControls reads its transport (step/play/jump) from ChessControlsContext,
 * so it must sit inside a provider. The provider self-seeds from the bundled
 * sample games — no props, no network — making the controls fully live here. */
export default function PlaybackControlsDemo() {
  return (
    <ChessControlsProvider>
      <div className="w-full max-w-[22rem]">
        <PlaybackControls />
      </div>
    </ChessControlsProvider>
  )
}

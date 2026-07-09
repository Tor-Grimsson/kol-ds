import { PlaybackControls, ChessControlsProvider } from '@kolkrabbi/kol-chess'

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

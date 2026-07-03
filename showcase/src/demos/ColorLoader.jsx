import { useState } from 'react'
import { ColorLoader, Button } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/**
 * Play the loading curtain inside a framed stage (not auto-looping). It times
 * in the wordmark, then the down-chevron cue; `dismissOnClick` lets you click
 * the curtain to slide it up and fire onComplete, which resets the demo. The
 * wordmark's variable-font axes need a KOL variable font (a consumer asset) —
 * on the theme sans the pressure axes stay put but the timed reveal still runs.
 */
export default function ColorLoaderDemo() {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Button onClick={() => setPlaying(true)} disabled={playing}>
        Play loader
      </Button>
      <div className="relative h-[420px] w-full overflow-hidden rounded border bg-fg-04">
        {playing ? (
          <ColorLoader
            text="KOLKRABBI"
            dismissOnClick
            onComplete={() => setPlaying(false)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="kol-helper-12 text-fg-48">Press Play — then click the curtain to enter.</p>
          </div>
        )}
      </div>
    </div>
  )
}

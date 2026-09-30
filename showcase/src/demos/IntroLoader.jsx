import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'
import { IntroLoader } from '@kolkrabbi/kol-foundry'

export const stage = 'lg'

/**
 * Play the loading curtain inside a framed stage (not auto-looping). It times
 * in the wordmark, then the down-chevron cue; `dismissOnClick` lets you click
 * the curtain to slide it up and fire onComplete, which resets the demo. The
 * wordmark's variable-font axes need a KOL variable font — the showcase ships
 * TGRotVF, so the pressure interaction is live: move the pointer over the wordmark.
 */
export default function IntroLoaderDemo() {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Button onClick={() => setPlaying(true)} disabled={playing}>
        Play loader
      </Button>
      <div className="relative h-[420px] w-full overflow-hidden rounded border bg-fg-04">
        {playing ? (
          <IntroLoader
            text="KOLKRABBI"
            fontFamily="TG Rot VF"
            fontUrl="/fonts/tg-typefaces/TGRotVF.ttf"
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

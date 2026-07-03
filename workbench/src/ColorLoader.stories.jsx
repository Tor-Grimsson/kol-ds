import { useState } from 'react'
import { ColorLoader, Button } from '@kolkrabbi/kol-component'

/* Mounted behind a toggle inside a framed stage (the loader fills h-full).
 * dismissOnClick → click the curtain to slide it up + fire onComplete, which
 * resets the toggle. Toggle prefers-reduced-motion in devtools: the curtain
 * renders one static frame and completes immediately. */

const Frame = ({ children }) => (
  <div className="relative h-[420px] w-[640px] max-w-full overflow-hidden rounded border bg-fg-04">
    {children}
  </div>
)

export const Default = () => {
  const [on, setOn] = useState(false)
  return (
    <div className="flex flex-col items-start gap-3">
      <Button onClick={() => setOn(true)} disabled={on}>Play</Button>
      <Frame>
        {on ? (
          <ColorLoader text="KOLKRABBI" dismissOnClick onComplete={() => setOn(false)} />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="kol-mono-12 text-fg-48">Press Play, then click the curtain.</span>
          </div>
        )}
      </Frame>
    </div>
  )
}

export const CustomColors = () => {
  const [on, setOn] = useState(false)
  return (
    <div className="flex flex-col items-start gap-3">
      <Button onClick={() => setOn(true)} disabled={on}>Play</Button>
      <Frame>
        {on ? (
          <ColorLoader
            text="LOADING"
            dismissOnClick
            bgColor="var(--kol-surface-inverse)"
            markColor="var(--kol-surface-on-inverse)"
            wordmarkDelay={400}
            scrollDelay={900}
            onComplete={() => setOn(false)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="kol-mono-12 text-fg-48">Inverse backdrop, faster reveal.</span>
          </div>
        )}
      </Frame>
    </div>
  )
}

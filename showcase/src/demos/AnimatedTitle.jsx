import { useState } from 'react'
import { AnimatedTitle, Button } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* The preview stage centers content with no scroll runway, so the demo
 * mounts the title with `immediate` — the same word-by-word tween plays
 * on mount instead of on scroll (no ScrollTrigger). Replay remounts via
 * key. In a real page, omit `immediate` for the scroll-driven reveal.
 * overflow-hidden clips the 150vw off-screen start positions. */
export default function AnimatedTitleDemo() {
  const [run, setRun] = useState(0)

  return (
    <div className="flex flex-col items-center gap-10 overflow-hidden py-4">
      <AnimatedTitle
        key={run}
        immediate
        title="Words fly in <br /> one <b>by</b> one"
        containerClass="kol-sans-display-02 text-emphasis text-center"
      />
      <Button size="sm" onClick={() => setRun((n) => n + 1)}>Replay</Button>
    </div>
  )
}

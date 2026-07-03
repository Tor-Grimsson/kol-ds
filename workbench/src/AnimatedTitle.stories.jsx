import { useState } from 'react'
import { AnimatedTitle, Button } from '@kolkrabbi/kol-component'

/* Real scroll-driven reveal: a tall spacer above the title gives the page
 * a scroll runway — scroll down and the words fly in as the title enters
 * the viewport; scroll back up past it and the reveal reverses
 * (toggleActions: 'play none none reverse'). */
export const ScrollReveal = () => (
  <div className="overflow-x-hidden">
    <div
      className="flex items-center justify-center kol-mono-12 text-fg-48"
      style={{ height: '120vh', border: '1px dashed var(--kol-fg-12)' }}
    >
      scroll down
    </div>
    <AnimatedTitle
      title="Words fly in <br /> one <b>by</b> one"
      containerClass="kol-sans-display-02 text-emphasis text-center"
    />
    <div style={{ height: '120vh' }} />
  </div>
)

/* `immediate` skips ScrollTrigger and plays the same tween on mount —
 * for stages/panels with no scroll. Replay remounts via key. */
export const Immediate = () => {
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

/* Tuning knobs: slower stagger + a later start position. */
export const Tuned = () => (
  <div className="overflow-x-hidden">
    <div
      className="flex items-center justify-center kol-mono-12 text-fg-48"
      style={{ height: '120vh', border: '1px dashed var(--kol-fg-12)' }}
    >
      scroll down
    </div>
    <AnimatedTitle
      title="A slower <br /> staggered reveal"
      containerClass="kol-sans-display-02 text-emphasis text-center"
      stagger={0.08}
      start="top 80%"
    />
    <div style={{ height: '120vh' }} />
  </div>
)

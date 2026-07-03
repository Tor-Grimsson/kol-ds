import { Button, OverlayGlassPanel } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function OverlayGlassPanelDemo() {
  return (
    <div
      className="relative flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded"
      style={{ background: 'linear-gradient(135deg, var(--kol-fg-32), var(--kol-fg-08) 55%, var(--kol-fg-16))' }}
    >
      <OverlayGlassPanel maxWidth="max-w-[420px]">
        <p className="kol-helper-12 text-meta">Studio</p>
        <h3 className="kol-sans-display-04 text-emphasis">Glass over media</h3>
        <p className="kol-sans-body-02 text-body">
          The panel mixes surface-primary at 80% over whatever sits behind it,
          with a 1px backdrop blur.
        </p>
        <Button>Enter</Button>
      </OverlayGlassPanel>
    </div>
  )
}

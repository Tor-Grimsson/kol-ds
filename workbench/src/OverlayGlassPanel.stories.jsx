import { Button, OverlayGlassPanel } from '@kolkrabbi/kol-component'

const Backdrop = ({ children }) => (
  <div
    className="relative flex min-h-[320px] w-[560px] items-center justify-center overflow-hidden rounded"
    style={{ background: 'linear-gradient(135deg, var(--kol-fg-32), var(--kol-fg-08) 55%, var(--kol-fg-16))' }}
  >
    {children}
  </div>
)

export const Default = () => (
  <Backdrop>
    <OverlayGlassPanel maxWidth="max-w-[420px]">
      <p className="kol-helper-12 text-meta">Studio</p>
      <h3 className="kol-sans-display-04 text-emphasis">Glass over media</h3>
      <p className="kol-sans-body-02 text-body">Surface-primary at 80% + 1px backdrop blur.</p>
      <Button>Enter</Button>
    </OverlayGlassPanel>
  </Backdrop>
)

export const StartAligned = () => (
  <Backdrop>
    <OverlayGlassPanel align="start" gap="gap-3" maxWidth="max-w-[420px]">
      <p className="kol-helper-12 text-meta">About</p>
      <p className="kol-sans-body-02 text-body">Start-aligned variant with tighter rhythm.</p>
    </OverlayGlassPanel>
  </Backdrop>
)

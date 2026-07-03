// Relative import: ColorRamp isn't in the package barrel yet (off-limits this
// pass) — pull it from source so the stories resolve.
import { ColorRamp } from '@kolkrabbi/kol-component'

export const LiveRampSugar = () => (
  <ColorRamp ramp="kol-color-yellow" anchor={300} note="Live — resolves --kol-color-yellow-{stop} on mount." />
)

export const LiveVars = () => (
  <ColorRamp
    label="Surface (live vars)"
    vars={['--kol-surface-primary', '--kol-surface-secondary', '--kol-surface-tertiary', '--kol-surface-inverse']}
  />
)

export const StaticColors = () => (
  <ColorRamp
    label="Accent (static hex)"
    colors={[['yellow', '#FFCF33'], ['red', '#AD5038'], ['blue', '#222D3D']]}
    anchor="red"
  />
)

export const TenStop = () => (
  <ColorRamp ramp="grey" stops={[50, 100, 200, 300, 400, 500, 600, 700, 800, 900]} anchor={500} />
)

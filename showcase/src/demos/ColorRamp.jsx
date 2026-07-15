import { ColorRamp } from '@kolkrabbi/kol-component'

export const stage = 'full'

export default function ColorRampDemo() {
  return (
    <div className="flex w-full flex-col">
      {/* Live — the `ramp` sugar resolves --{ramp}-{stop} from the theme */}
      <ColorRamp ramp="kol-color-yellow" anchor={300} note="Pure-yellow lock — anchor at 300." />
      <ColorRamp ramp="kol-color-red" anchor={200} note="Rust / terracotta." />

      {/* Live — an explicit list of custom-property names */}
      <ColorRamp
        label="Surface ramp (live vars)"
        vars={['--kol-surface-primary', '--kol-surface-secondary', '--kol-surface-tertiary', '--kol-surface-inverse', '--kol-surface-contrast']}
      />

      {/* Static — literal colors (the merged former-Ramp mode) */}
      <ColorRamp
        label="Accent (static hex)"
        colors={[['yellow', '#FFCF33'], ['red', '#AD5038'], ['blue', '#222D3D']]}
        anchor="yellow"
      />
    </div>
  )
}

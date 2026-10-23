import { ColorRamp } from '@kolkrabbi/kol-component'

export const stage = 'full'

export default function ColorRampPreview() {
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

      {/* Ten steps — five a row below sm, captions truncate in their column (ColorRampNarrowCaptions) */}
      <ColorRamp
        label="Ten steps (static hex)"
        colors={[['highlight-cider', '#F2E3B3'], ['highlight-sand', '#E8D29A'], ['highlight-ochre', '#D9B65E'], ['highlight-amber', '#C9952F'], ['highlight-rust', '#AD5038'], ['highlight-brick', '#8A3B2A'], ['highlight-plum', '#5C2E40'], ['highlight-ink', '#2B2340'], ['highlight-navy', '#1B2440'], ['highlight-night', '#001141']]}
      />
    </div>
  )
}

import { ContentMedia } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* Ratio is the only knob; no children → AssetPlaceholder at the same ratio. */
const RATIOS = ['1 / 1', '16 / 9', '4 / 5', '3 / 4', '1 / 1.41421']

export default function ContentMediaDemo() {
  return (
    <div className="grid w-full max-w-[40rem] grid-cols-3 items-start gap-4">
      {RATIOS.map((ratio) => (
        <div key={ratio} className="flex flex-col gap-2">
          <p className="kol-helper-10 text-meta">{ratio}</p>
          <ContentMedia ratio={ratio} />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <p className="kol-helper-10 text-meta">with media</p>
        <ContentMedia ratio="1 / 1">
          <div className="flex h-full w-full items-center justify-center bg-fg-08">
            <span className="kol-mono-12 text-meta">img</span>
          </div>
        </ContentMedia>
      </div>
    </div>
  )
}

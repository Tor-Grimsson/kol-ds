import { TypeBlock } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

const SAMPLE = 'The quick brown fox'

export default function TypeBlockDemo() {
  return (
    <div className="flex flex-col gap-8 text-auto">
      {/* Display — Right Grotesk Bold, large */}
      <TypeBlock text={SAMPLE} cut="base" weight={700} size={72} lineHeight={1} />

      {/* Heading — Wide cut, medium, tracked out */}
      <TypeBlock text={SAMPLE} cut="Wide" weight={500} size={40} tracking={0.02} lineHeight={1.1} />

      {/* Body — Text cut, regular, wraps */}
      <TypeBlock
        text="The quick brown fox jumps over the lazy dog. Body copy at reading size, wrapping across lines."
        cut="Text"
        weight={400}
        size={20}
        lineHeight={1.5}
      />

      {/* Mono — JetBrains Mono, single line */}
      <TypeBlock text="const fox = () => jump()" cut="mono" weight={400} size={18} lineHeight={1.4} />

      {/* Outlined display — stroke only, no fill weight change */}
      <TypeBlock text="KOL" cut="base" weight={700} size={80} strokeWidth={2} strokeColor="#AD5038" color="transparent" />
    </div>
  )
}

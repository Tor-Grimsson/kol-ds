import { TypefaceAlphabet } from '@kolkrabbi/kol-foundry'

export const stage = 'full'

/* the specimen alphabet trimmed to what fits on one line — binary-searched
 * against the container, re-measured on resize; the typeface row's footer */
export default function TypefaceAlphabetDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <TypefaceAlphabet fontFamily="'Right Grotesk', sans-serif" />
      <div className="w-1/2">
        <TypefaceAlphabet fontFamily="'Right Grotesk Tight', sans-serif" />
      </div>
    </div>
  )
}

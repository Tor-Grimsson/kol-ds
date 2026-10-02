import { StoryType } from '@kolkrabbi/kol-styleguide'
import { Asset } from '@kolkrabbi/kol-brand/svg'

export const stage = 'sm'

/* A brand-book mock wearing the KOL mark on the package's own default palette and brand info. */
export default function StoryTypePreview() {
  return <StoryType mark={<Asset name="kol-logomark" title="Kolkrabbi" />} quote={<>Made by hand,<br />kept in use.</>} className="w-full" />
}

import { TextFold } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* the fold works below md — narrow the window to see More */
export default function TextFoldPreview() {
  return (
    <TextFold lines={3} as="p" className="kol-mono-14 text-body">
      A brand is the sum of what people remember after they stop looking. The mark, the type and the colour are the parts you can point at; the voice, the pace and the restraint are the parts they feel. This text folds to three lines on a phone, and the More button opens the rest — on a wider screen it reads whole and no button shows.
    </TextFold>
  )
}

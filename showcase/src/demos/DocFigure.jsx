import { DocFigure } from '@kolkrabbi/kol-workshop'

export const stage = 'md'

/* The framed container a preview or an image sits in, with its caption. */
export default function DocFigureDemo() {
  return (
    <DocFigure caption="A figure with a caption.">
      <div className="flex h-32 items-center justify-center kol-mono-12 text-meta">content</div>
    </DocFigure>
  )
}

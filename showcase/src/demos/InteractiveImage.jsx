import { InteractiveImage } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* Move the pointer across the frame: the mask follows it and the stage tilts.
 * On a touch device or under prefers-reduced-motion the mask sits centred and
 * no listeners mount at all — the same markup, no motion. */
export default function InteractiveImageDemo() {
  return (
    <div className="w-full max-w-xl aspect-[4/3]">
      <InteractiveImage
        src="/kol-images/tt-02.jpg"
        alt="A masked photograph that follows the cursor"
        className="w-full h-full"
      />
    </div>
  )
}

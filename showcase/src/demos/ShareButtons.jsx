import { ShareButtons } from '@kolkrabbi/kol-content'

export const stage = 'hug'

/**
 * ShareButtons — copy-link plus share-intent targets, all DS Buttons with
 * text labels (no icons). Copy really writes to the clipboard and flips the
 * label to "Copied" for 1.5 s; target buttons open the platform intent in a
 * new tab.
 */
export default function ShareButtonsDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <ShareButtons
        url="https://kolkrabbi.is/journal/measure-of-a-page"
        title="The measure of a page"
      />
      <ShareButtons
        url="https://kolkrabbi.is/work/hverfjall-series"
        title="Hverfjall Series"
        targets={['x', 'email']}
        label="Share this work"
      />
      <ShareButtons url="https://kolkrabbi.is" title="Kolkrabbi" label="" />
    </div>
  )
}

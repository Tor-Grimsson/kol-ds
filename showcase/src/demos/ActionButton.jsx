import { ActionButton } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* The confirm-flip, with the clipboard taken out: press it and the glyph
 * animates to `check` for 2s, then back. CopyButton is this with a
 * navigator.clipboard call wired into onAction. */
export default function ActionButtonDemo() {
  return (
    <div className="flex items-center gap-3">
      <ActionButton icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" onAction={() => {}} />
      <ActionButton icon="star" confirmIcon="check" label="Save" confirmLabel="Saved" onAction={() => {}} />
    </div>
  )
}

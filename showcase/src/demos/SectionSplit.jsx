import { Button, SectionSplit } from '@kolkrabbi/kol-component'

/* `align` is the one prop: right = media on the right (default), left = media
 * first, center = one column, text centred, media below. */
export const variants = ['right', 'left', 'center']
export const stage = 'full'

export default function SectionSplitDemo({ variant = 'right' }) {
  return (
    <SectionSplit
      align={variant}
      label="THE FLEET"
      headline={<>Built to hold <em>course</em></>}
      body="An editorial pull: label, display headline, and lede beside a cover-fit visual. Pass meta for a stats strip or actions for a button row — pick one."
      actions={
        <>
          <Button>Explore the fleet</Button>
          <Button variant="secondary">Read the log</Button>
        </>
      }
      media={
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, var(--kol-fg-08) 0%, var(--kol-fg-32) 100%)' }}
        />
      }
      caption="FIG 01 — HARBOUR, REYKJAVÍK"
    />
  )
}

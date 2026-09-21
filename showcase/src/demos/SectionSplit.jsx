import { Button, SectionSplit } from '@kolkrabbi/kol-component'

/* `align` is the one prop, and it carries all four placements: right = media on
 * the right (default), left = media first, top = media ABOVE the text, and
 * center / bottom = one column with the media below it — two names for the
 * layout `center` always rendered, since "centred" says where the column sits
 * and nothing about the order (section-split-vertical-align, 2026-09-03).
 * `fill` releases the bounded frame — the media covers its half edge to edge and
 * the text centres beside it (section-split-fill-variant, 2026-09-03). */
export const variants = ['right', 'left', 'center', 'top', 'bottom', 'fill']
export const stage = 'full'

export default function SectionSplitDemo({ variant = 'right' }) {
  return (
    <SectionSplit
      align={variant === 'fill' ? 'right' : variant}
      fill={variant === 'fill'}
      height={variant === 'fill' ? 'full' : undefined}
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

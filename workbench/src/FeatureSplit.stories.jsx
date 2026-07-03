import { Button, FeatureSplit } from '@kolkrabbi/kol-component'

const media = (
  <div
    className="absolute inset-0"
    style={{ background: 'linear-gradient(160deg, var(--kol-fg-08) 0%, var(--kol-fg-32) 100%)' }}
  />
)

export const Default = () => (
  <FeatureSplit
    kicker="THE FLEET"
    title={<>Built to hold <em>course</em></>}
    body="An editorial pull: kicker, display headline, and lede beside a cover-fit visual. The CTA variant renders a wrap-flex button row."
    ctas={
      <>
        <Button>Explore the fleet</Button>
        <Button variant="secondary">Read the log</Button>
      </>
    }
    media={media}
    caption="FIG 01 — HARBOUR, REYKJAVÍK"
  />
)

export const Stats = () => (
  <FeatureSplit
    kicker="BY THE NUMBERS"
    title={<>Steady in <em>any</em> weather</>}
    body="The stats variant swaps the CTA row for a bordered strip of number / label pairs."
    meta={[
      { num: '24', label: 'VESSELS' },
      { num: '11', label: 'HARBOURS' },
      { num: '99.2%', label: 'ON SCHEDULE' },
    ]}
    media={media}
  />
)

export const TextOnly = () => (
  <FeatureSplit
    kicker="NO MEDIA"
    title={<>Words <em>alone</em></>}
    body="Omit media and the visual column disappears — no empty nodes, the text column keeps its 640px measure."
    ctas={<Button>Continue</Button>}
  />
)

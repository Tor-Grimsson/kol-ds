import { Button, FeatureSplit } from '@kolkrabbi/kol-component'

export const stage = 'full'

export default function FeatureSplitDemo() {
  return (
    <FeatureSplit
      kicker="THE FLEET"
      title={<>Built to hold <em>course</em></>}
      body="An editorial pull: kicker, display headline, and lede beside a cover-fit visual. Pass meta for a stats strip or ctas for a button row — pick one."
      ctas={
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

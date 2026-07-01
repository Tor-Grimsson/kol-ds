import { PageSection } from '@kolkrabbi/kol-framework'

export const Default = () => (
  <PageSection
    id="figma-overview"
    label="01 — figma → tailwind"
    title="figma → tailwind"
    body="Figma and CSS use different words for the same things. You are not stupid for getting confused — the names actually are different. Here is the dictionary."
  >
    <div style={{ marginTop: 24, padding: 24, border: '1px solid var(--kol-border-default)', borderRadius: 8 }}>
      <p className="kol-sans-body-01 text-body m-0">Children render below the header block.</p>
    </div>
  </PageSection>
)

export const HeaderOnly = () => (
  <PageSection
    id="introduction"
    label="00 — introduction"
    title="Typography"
    body="The house runs on two families: a sans for product and UI, a serif as the display partner for marketing moments. Every style is production-sized — px values, not clamps."
  />
)

export const FullbleedWithDivider = () => (
  <PageSection
    id="logo"
    label="03 — logo"
    title="The crest"
    body="Fullbleed widens the header measure and a top divider separates it from the preceding section."
    fullbleed
    divider
  >
    <div style={{ marginTop: 24, height: 160, borderRadius: 8, background: 'var(--kol-surface-secondary)' }} />
  </PageSection>
)

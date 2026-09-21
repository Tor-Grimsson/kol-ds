import { MemoryRouter } from 'react-router-dom'
import { PageHero } from '@kolkrabbi/kol-framework'

export const Default = () => (
  <PageHero
    label="/ command"
    title="Federation"
    lede="Federation flag. Fleet commission. Strong, trustworthy, and elegant — yet flexible enough to counter the rigid nature of sovereign institutions."
  />
)

/* `mark` accepts any node — real apps pass a BrandLogo; a plain swatch stands in. */
export const WithMark = () => (
  <PageHero
    label="/ canalix"
    title="Canalix"
    lede="Master brand. Branded house. Strong, trustworthy, and elegant — yet flexible enough to counter the rigid nature of governmental institutions."
    mark={<div className="kol-hero-mark" style={{ width: 96, height: 96, borderRadius: 16, background: 'var(--kol-accent)' }} />}
  />
)

/* the sub-page form: a back link above the label (was SubPageHero) */
export const WithBackLink = () => (
  <MemoryRouter>
    <PageHero
      backTo="/canalix"
      backLabel="← back to canalix"
      label="canalix · marks"
      title="Marks"
      lede="Product icon family — 15 accented + 21 monochrome."
    />
  </MemoryRouter>
)

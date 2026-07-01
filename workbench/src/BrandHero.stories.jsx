import { BrandHero } from '@kolkrabbi/kol-framework'

export const Default = () => (
  <BrandHero
    label="/ command"
    title="Federation"
    lede="Federation flag. Fleet commission. Strong, trustworthy, and elegant — yet flexible enough to counter the rigid nature of sovereign institutions."
  />
)

/* `mark` accepts any node — real apps pass a BrandLogo; a plain swatch stands in. */
export const WithMark = () => (
  <BrandHero
    label="/ canalix"
    title="Canalix"
    lede="Master brand. Branded house. Strong, trustworthy, and elegant — yet flexible enough to counter the rigid nature of governmental institutions."
    mark={<div className="kol-hero-mark" style={{ width: 96, height: 96, borderRadius: 16, background: 'var(--kol-accent)' }} />}
  />
)

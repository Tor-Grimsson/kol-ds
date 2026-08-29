import SectionNewsletter from './SectionNewsletter.jsx'

/**
 * @deprecated 2026-08-27 — `NewsletterBand` is `SectionNewsletter` under its
 * old name: the newsletter joined the section family (SectionNewsletter,
 * kol-website). `title` → `headline`, `description` → `body`; everything else
 * passes through. On the retirement ledger (04-retirements.md) — dropped when
 * no repo imports it.
 */
export default function NewsletterBand({ title, description, ...rest }) {
  return <SectionNewsletter headline={title} body={description} {...rest} />
}

import { useResume } from '../data.jsx'

/**
 * The kit's contact footer — the identical strip that closes both the Cover and
 * the Back page. Every entry is a real link: Chrome's headless printToPDF keeps
 * <a href> as a clickable annotation, so the exported PDF is live off the page.
 *
 * Display text is the data string verbatim (example.com, linkedin.com/name);
 * only the href is synthesised, so the printed line reads the same as before.
 */
/* the contact is the person's (the seam): the entries are built from the provider's BRAND_INFO inside the component */
const entriesOf = ({ contact = {}, social = {} } = {}) => [
  [contact.emailJobs, `mailto:${contact.emailJobs}`],
  [contact.phone, `tel:${String(contact.phone ?? '').replace(/\s/g, '')}`],
  [contact.web, `https://${contact.web}`],
  [social.linkedin, `https://${social.linkedin}`],
  [social.github, `https://${social.github}`],
].filter(([label]) => label)

export default function ContactLine({ className = '' }) {
  const ENTRIES = entriesOf(useResume().BRAND_INFO)
  return (
    <p className={`kol-mono-10 text-meta mt-auto pt-6 border-t border-fg-08 ${className}`}>
      {ENTRIES.map(([label, href], i) => (
        <span key={label}>
          {i > 0 && '  ·  '}
          <a href={href} target="_blank" rel="noreferrer" className="no-underline text-inherit">
            {label}
          </a>
        </span>
      ))}
    </p>
  )
}

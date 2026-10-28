import { BRAND_INFO } from '@data/info.js'

/**
 * The kit's contact footer — the identical strip that closes both the Cover and
 * the Back page. Every entry is a real link: Chrome's headless printToPDF keeps
 * <a href> as a clickable annotation, so the exported PDF is live off the page.
 *
 * Display text is the data string verbatim (kolkrabbi.io, linkedin.com/grimsson);
 * only the href is synthesised, so the printed line reads the same as before.
 */
const { contact, social } = BRAND_INFO

const ENTRIES = [
  [contact.emailJobs, `mailto:${contact.emailJobs}`],
  [contact.phone, `tel:${contact.phone.replace(/\s/g, '')}`],
  [contact.web, `https://${contact.web}`],
  [social.linkedin, `https://${social.linkedin}`],
  [social.github, `https://${social.github}`],
].filter(([label]) => label)

export default function ContactLine({ className = '' }) {
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

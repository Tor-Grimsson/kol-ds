import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'

/**
 * ShareButtons — a share bar for an article or work page. A copy-link button
 * plus configurable share targets that open the platform's share intent in a
 * new tab/window. KOL-native (DS Button, no raw <button>); labels are authored
 * literals in their final case — no text-transform.
 *
 * @param {string}   url      the URL to share (required)
 * @param {string}   title    text passed to share intents (tweet text / mail subject)
 * @param {string[]} targets  any of 'x' | 'linkedin' | 'email' (default all three)
 * @param {string}   label    leading label (default 'Share'; '' hides it)
 * @param {string}   className extra classes on the root
 */
const INTENT = {
  x: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  linkedin: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  email: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
}
const LABEL = { x: 'X', linkedin: 'LinkedIn', email: 'Email' }

export default function ShareButtons({ url, title = '', targets = ['x', 'linkedin', 'email'], label = 'Share', className = '' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard blocked — no-op */ }
  }
  const open = (t) => window.open(INTENT[t](url, title), '_blank', 'noopener,noreferrer')
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`.trim()}>
      {label && <span className="kol-helper-12 text-fg-48">{label}</span>}
      <Button variant="outline" size="sm" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</Button>
      {targets.filter((t) => INTENT[t]).map((t) => (
        <Button key={t} variant="outline" size="sm" onClick={() => open(t)}>{LABEL[t] ?? t}</Button>
      ))}
    </div>
  )
}

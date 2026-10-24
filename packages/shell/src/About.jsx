import { warnJsx } from './warnJsx.js'

/* THE APP'S ABOUT, AS DATA: `app.about` is a string or an array of paragraphs, drawn here in the Hub's voice — mono-14,
 * meta ink, a 16px step between paragraphs — on the settings rail's About tab and the settings page alike. A node is
 * still drawn, with a dev warning: it is the consumer picking the class, which no Hub surface takes (2026-10-24). */
export default function About({ about }) {
  if (about == null) return null
  if (typeof about === 'string' || Array.isArray(about)) {
    return (
      <div className="kol-mono-14 text-fg-48" style={{ maxWidth: 640 }}>
        {(Array.isArray(about) ? about : [about]).map((p, i) => <p key={i} className={i ? 'mt-4' : ''}>{p}</p>)}
      </div>
    )
  }
  warnJsx('app.about', 'Pass a string, or an array of paragraphs.')
  return <div className="kol-mono-14 text-fg-48" style={{ maxWidth: 640 }}>{about}</div>
}

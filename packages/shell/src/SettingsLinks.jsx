/**
 * SettingsLinks — the About / Repo link list every app hand-wrote (ShellHomeSystem,
 * kol-fxr 2026-08-27): label `kol-helper-12 text-fg-32` at 72px, the URL as an
 * external link `text-fg-64 hover:text-fg-96 hover:underline`.
 *
 * @param {Array} links  `[{ label, url, text? }]` — `text` shows instead of the URL
 */
export default function SettingsLinks({ links = [], className = '' }) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {links.map(({ label, url, text }) => (
        <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <span className="text-fg-32 kol-helper-12" style={{ width: 72, flexShrink: 0 }}>{label}</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-fg-64 kol-helper-12 hover:text-fg-96 hover:underline">{text ?? url}</a>
        </div>
      ))}
    </div>
  )
}

/** SettingsColophon — the "Kolkrabbi Vinnustofa / 2026" foot under a settings scaffold. */
export function SettingsColophon({ name = 'Kolkrabbi Vinnustofa', year = new Date().getFullYear(), className = '' }) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span className="text-fg-32 kol-helper-12">{name}</span>
      <span className="text-fg-32 kol-helper-12">{year}</span>
    </div>
  )
}

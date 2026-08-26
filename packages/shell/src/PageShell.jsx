/**
 * PageShell — the page scaffold every shell page re-declared by hand (6 pages
 * in monitor, 4 in mirror — the most-duplicated block in both repos).
 *
 * `mode="scroll"` (default): min-height 100vh, natural page scroll.
 * `mode="fixed"`: height 100vh, overflow hidden — pair with a `flex:1
 * overflow:auto` body (the settings idiom; SettingsScaffold does this).
 *
 * Gutter is `--kol-shell-page-pad` (kol-theme). `PageBleed` breaks it for
 * full-width embeds (monitor's rack bleed).
 */
export default function PageShell({ mode = 'scroll', className = '', style, children }) {
  const modeStyle =
    mode === 'fixed'
      ? { height: '100vh', overflow: 'hidden' }
      : { minHeight: '100vh' }
  return (
    <div
      className={`bg-surface-primary ${className}`.trim()}
      style={{
        padding: 'var(--kol-shell-page-pad)',
        display: 'flex',
        flexDirection: 'column',
        ...modeStyle,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Full-bleed slot — cancels PageShell's horizontal gutter. */
export function PageBleed({ style, children }) {
  return (
    <div
      style={{
        marginLeft: 'calc(var(--kol-shell-page-pad) * -1)',
        marginRight: 'calc(var(--kol-shell-page-pad) * -1)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

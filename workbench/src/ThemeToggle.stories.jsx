import { ThemeToggle } from '@kolkrabbi/kol-framework'

/* Clicking any of these flips <html data-theme> and recolours the whole page —
 * that's the component's job, not a story bug. */

export const Default = () => <ThemeToggle variant="icon" />

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 240 }}>
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <span className="kol-mono-12" style={{ width: 72 }}>icon</span>
      <ThemeToggle variant="icon" />
    </div>
    <div>
      <span className="kol-mono-12">hop</span>
      <ThemeToggle variant="hop" />
    </div>
    <div>
      <span className="kol-mono-12">hop-bare</span>
      <ThemeToggle variant="hop-bare" />
    </div>
  </div>
)

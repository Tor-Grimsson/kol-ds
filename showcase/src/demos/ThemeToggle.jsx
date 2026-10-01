import { ThemeToggle } from '@kolkrabbi/kol-framework'

export const variants = ['button', 'flush']
export const tones = ['default', 'primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'sunken']
export const sizes = ['md', 'sm', 'lg']

export default function ThemeToggleDemo({ variant = 'button', tone = 'default', size = 'md' }) {
  /* The spec's two faces (0.9.0): THE button (default — grey fill, glyph +
   * label) and the quiet square for icon bars (fill none, no label). */
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle variant={variant} tone={tone} size={size} />
      <ThemeToggle variant={variant} tone={tone} size={size} fill="none" label={false} />
    </div>
  )
}

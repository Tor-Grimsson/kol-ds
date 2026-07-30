import { ThemeToggle } from '@kolkrabbi/kol-framework'

export default function ThemeToggleDemo() {
  /* The spec's two faces (0.9.0): THE button (default — grey fill, glyph +
   * label) and the quiet square for icon bars (fill none, no label). */
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <ThemeToggle fill="none" label={false} />
    </div>
  )
}

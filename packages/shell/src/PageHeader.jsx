/**
 * PageHeader — the page's masthead: an optional eyebrow, the title, and a mono
 * subtitle.
 *
 * TWO SCALES, because two things were being called a page header. An app page
 * (monitor's Library, mirror's settings) wears a compact heading; a SITE page
 * (kol-website's /work) opens on the display scale and the difference is not a
 * preference, it is which register you are in. `size` picks:
 *
 *   sm   kol-sans-heading-03  32px — app chrome, a titled panel
 *   md   kol-sans-display-03  36 / 42 / 48px — the default page masthead
 *   lg   kol-sans-display-02  44 / 56 / 64px — a landing or section opener
 *
 * The title used to be `kol-heading-sm`, a retired t-shirt stop with NO rule
 * anywhere in kol-theme, so every page title in every shell app fell through to
 * the browser's default h1 (found 2026-08-15). It was mapped to heading-03,
 * which was still too quiet for a page — hence the scale.
 *
 * `eyebrow` is the small label above the title (kol-website's "USE CASES").
 * It self-hides when unset, so an app page passes nothing and gets nothing.
 *
 * @param {ReactNode} eyebrow   small label above the title
 * @param {ReactNode} title
 * @param {ReactNode} subtitle  mono line under the title
 * @param {string}    size      sm | md | lg (default md)
 */
const TITLE = {
  sm: 'kol-sans-heading-03',
  md: 'kol-sans-display-03',
  lg: 'kol-sans-display-02',
}

export default function PageHeader({ eyebrow, title, subtitle, size = 'md', className = '' }) {
  return (
    /* the block owns its own rhythm — margins inline, never in a shared type
       class, which leaks estate-wide (ShellHeaderFilterRefinements, 2026-08-15) */
    <header className={`flex flex-col ${className}`.trim()} style={{ marginBottom: 40 }}>
      {eyebrow && (
        /* HELPER, not mono (user ruling 2026-08-15). An eyebrow is single-line
           chrome — that is the whole definition of the `kol-helper-*` ramp, and
           it carries its own tracking, so no inline letter-spacing here.
           Uppercase, and off `fg-48`: under half the ink read as disabled
           rather than quiet, and this is a live label, not a footnote. */
        <p
          className="text-oq-64 kol-helper-12"
          style={{ marginBottom: 12, textTransform: 'uppercase' }}
        >
          {eyebrow}
        </p>
      )}
      <h1 className={`text-fg-96 ${TITLE[size] ?? TITLE.md}`}>{title}</h1>
      {subtitle && (
        <p className="text-oq-64 kol-mono-14" style={{ marginTop: 12 }}>{subtitle}</p>
      )}
    </header>
  )
}

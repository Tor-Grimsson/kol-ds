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
 * @param {'sans'|'mono'} voice  the title's family (default sans). `mono` = the
 *                    app tier's masthead (PageHeaderMonoTitle, kol-fxr 2026-08-27 —
 *                    user ruling: kol-monitor's JetBrains Mono 32 / 500 is the look):
 *                    kol-mono-heading-03 · kol-mono-display-03 · kol-mono-display-02
 *                    (kol-theme ≥0.67.0). The subtitle stays kol-mono-14.
 * @param {string}    titleClass  replaces the title role whole (the ContentText seam)
 * @param {ReactNode} actions   a control cluster on the SUBTITLE's first baseline — on the title's
 *                    when there is no subtitle (PageHeaderTrailingSlot, kol-website 2026-08-28;
 *                    kol-r2b2's header is the reference: wordmark left, controls right, on the
 *                    line). Without it the consumer wrapped the header in a flex row and got the
 *                    h1's baseline, or re-rendered the subtitle as a bare <p> off copied classes
 *                    with an `!important` on the margin — a DS text role re-implemented outside.
 * @param {string}    subtitleMaxWidth  the lede's measure (e.g. '800px' or '60ch'), a prop
 *                    instead of a consumer selector reaching inside
 * The bottom rhythm is `--kol-page-header-mb` (default 40px): inline, as before, but through a
 * variable a consumer can re-point where an inline literal could only be `!important`-ed.
 */
const TITLE = {
  sans: { sm: 'kol-sans-heading-03', md: 'kol-sans-display-03', lg: 'kol-sans-display-02' },
  mono: { sm: 'kol-mono-heading-03', md: 'kol-mono-display-03', lg: 'kol-mono-display-02' },
}

export default function PageHeader({ eyebrow, title, subtitle, actions, subtitleMaxWidth, size = 'md', voice = 'sans', titleClass, className = '' }) {
  const roles = TITLE[voice] ?? TITLE.sans
  const h1 = <h1 className={`text-fg-96 ${titleClass ?? roles[size] ?? roles.md}`}>{title}</h1>
  const lede = subtitle && <p className="text-oq-64 kol-mono-14 min-w-0" style={{ marginTop: actions ? undefined : 12, maxWidth: subtitleMaxWidth }}>{subtitle}</p>
  /* The cluster shares a baseline row with the lede (or the title): flexbox
     exposes a flex item's FIRST baseline, so putting them in one row is the one
     way to land on the subtitle's line rather than the h1's.
     
     AND IT CONTRIBUTES NO HEIGHT (PageHeaderActionsGrowsBlock, kol-fxr
     2026-08-28). A flex row takes its tallest child, so a cluster of `sm`
     controls (28px since kol-theme 0.90.0) against a one-line `kol-mono-14`
     lede (18px) made the masthead 10px taller — measured, monitor's `/` at 65.2
     against fxr's `/settings` at 75.2 with identical titles. The masthead is the
     one block every page of an app shares, so a page with a control cluster sat
     10px lower than every page without one, with no way to opt out.
     
     `h-0` + `self-center` is the fix and it is not a magic number: a zero-height
     box centred on the row makes the children overflow it symmetrically, so the
     row's height is the TEXT's and the cluster is free at any rung (the gap is
     10px at `sm`, 14 at `md` — a constant would have been wrong). Horizontal
     layout is untouched: the box still takes its width, so `justify-between`
     holds and a long lede cannot run under the controls. */
  const cluster = actions && <div className="flex items-center gap-4 shrink-0 h-0 self-center">{actions}</div>
  return (
    /* the block owns its own rhythm — margins inline, never in a shared type
       class, which leaks estate-wide (ShellHeaderFilterRefinements, 2026-08-15) */
    <header className={`flex flex-col ${className}`.trim()} style={{ marginBottom: 'var(--kol-page-header-mb, 40px)' }}>
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
      {actions && subtitle ? (
        <>
          {h1}
          <div className="flex items-baseline justify-between gap-6" style={{ marginTop: 12 }}>
            {lede}
            {cluster}
          </div>
        </>
      ) : actions ? (
        <div className="flex items-baseline justify-between gap-6">
          {h1}
          {cluster}
        </div>
      ) : (
        <>
          {h1}
          {lede}
        </>
      )}
    </header>
  )
}

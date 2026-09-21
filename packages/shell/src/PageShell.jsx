/**
 * PageShell — the page scaffold every shell page re-declared by hand (6 pages
 * in monitor, 4 in mirror — the most-duplicated block in both repos).
 *
 * `mode="scroll"` (default): min-height 100vh, natural page scroll.
 * `mode="fixed"`: height 100vh, overflow hidden — pair with a `flex:1
 * overflow:auto` body (the settings idiom; SettingsScaffold does this).
 *
 * Gutter is `--kol-shell-page-pad` (kol-theme) — since theme 0.135.0 an alias
 * of `--kol-pad-section-x`, the ONE page-content ladder every `.kol-page`
 * wears (two-page-scaffolds-one-job, kol-client-olina 2026-09-03: two ladders
 * for one job agreed only at 48). `PageBleed` breaks it for full-width embeds
 * (monitor's rack bleed).
 *
 * THE GEOMETRY IS A CLASS — `.kol-shell-page` (+ `--fixed`, `--capped`), in
 * kol-components-shell.css — so a consumer has a selector to reach; inline is
 * the `style` prop only. `width` is the TIER: `bleed` (default) fills the
 * window, the app tier; `capped` takes the framework container ladder and
 * centres, the site tier — the one real difference between this and a
 * `.kol-page`, and a prop so a site adopting the shipped catalog page does
 * not silently get app geometry.
 *
 * `scrollbar-gutter: stable` on both modes (PageShellScrollbarGutter,
 * kol-monitor 2026-08-28 — user: "Create is the odd one out"). A page's content
 * width used to depend on whether it scrolls: `scroll` mode scrolls the
 * document, so the viewport's scrollbar takes its width out of the content box;
 * `fixed` mode is `overflow: hidden` and keeps it. That would cost nothing if
 * anything downstream were measured in absolute units — but `.kol-filters-first`
 * is `calc((100cqw - 120px) / 6)` (ContentFiltersFirstGroupFixedWidth), so a
 * scrollbar's width divides by six into the first filter group and every group
 * after it shifts, along with the 6-column grid beneath. One catalog column has
 * to mean one thing on every surface of an app.
 *
 * WHERE the declaration lands is not symmetric, and it is why this is on the
 * component rather than in the theme: in `fixed` mode this element IS the scroll
 * container (`overflow: hidden` qualifies), so it reserves the gutter and its
 * content box matches a scrolling page's. In `scroll` mode it is not one
 * (`overflow: visible`), the property does not apply, and the viewport keeps
 * doing what it already did — so this is inert there rather than a second
 * gutter. Equal widths, one declaration.
 *
 * Inert, too, wherever scrollbars overlay rather than take space (macOS with a
 * trackpad): there was no delta to fix and there is none to introduce.
 * The fuller fix — `html { scrollbar-gutter: stable }` — would also equalise a
 * SHORT scrolling page against a long one; that is an estate-wide change to
 * every consumer's root element and is not this ticket's.
 *
 * The background is `var(--kol-shell-page-wash, var(--kol-surface-primary))`
 * (ShellPageWash, 2026-08-27): unset, today's primary pixel; set by
 * `AppShell pageWash`, a transparent wash over the shell's primary back —
 * the lightness steps up and the structure stays visible, which an opaque
 * surface swap would hide. The ink stays `text-auto` (surface-on-primary).
 * ONE OWNER PER PIXEL (2026-09-03): the variable means what is LEFT to paint.
 * kol-shell's `AppShell` hands the wash down for this to paint; kol-framework's
 * `PageLayout` paints it on its own plane and hands down `transparent`, so a
 * PageShell inside it does not paint it again (it used to — two 0.02 layers).
 *
 * @param {'scroll'|'fixed'} mode   scroll (default) | fixed — see above
 * @param {'bleed'|'capped'} width  bleed (default, the app tier) | capped (the site tier — `--kol-container-max`, centred)
 * @param {string}  className
 * @param {object}  style           inline — the one thing that stays inline
 */
export default function PageShell({ mode = 'scroll', width = 'bleed', className = '', style, children }) {
  return (
    <div
      className={`kol-shell-page${mode === 'fixed' ? ' kol-shell-page--fixed' : ''}${width === 'capped' ? ' kol-shell-page--capped' : ''} text-auto ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  )
}

/** Full-bleed slot — cancels PageShell's horizontal gutter (`.kol-shell-page-bleed`). */
export function PageBleed({ style, children }) {
  return (
    <div className="kol-shell-page-bleed" style={style}>
      {children}
    </div>
  )
}

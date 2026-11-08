import { forwardRef } from 'react'

/* taxonomy-ok: molecule — the modal family's panel: the surface every modal, dialog and sheet window draws its parts on */

/**
 * ModalShell — The one modal panel (plan-2026-11-08-outstanding W2.1, his Figma issue 52: *"modals not built on one
 * modal"*). The surface, the radius, a header slot, the body and a footer slot — nothing else. The scrim, the portal,
 * the keys and the size stay the caller's (Modal, Dialog, FullscreenOverlay), so every overlay can wear it whatever
 * layer it sits in. Padding and the gap between the parts are the caller's too (`className`): a prompt and a media
 * window do not share them.
 *
 *   <ModalShell header={<ModalHeader … />} footer={<div>…actions</div>} className="gap-4 p-5" style={{ width: 560 }}>
 *     …body
 *   </ModalShell>
 *
 * ONE RADIUS: `--kol-radius-sm` (4px) — the radius Modal's prompts and Dialog wore. The float style's windows keep the
 * float window radius (`float`, 28) and the generator settings window its 16 (`settings`); both are the float style's
 * own, drawn in its Figma.
 *
 * @param {'lift'|'bordered'|'float'|'settings'} [variant='lift']
 *   `lift` — the overlay panel every KOL overlay wears (`.kol-overlay-panel`: oq-04, no border, the scrim is the edge);
 *   `bordered` — the page surface behind an fg-08 hairline (Modal's prompts); `float` — the float window
 *   (`kol-float-solid`); `settings` — the generator settings window (the secondary surface, oq-16 edge, the float shadow).
 * @param {ReactNode} [header]   drawn first
 * @param {ReactNode} [footer]   drawn last
 * @param {string}    [className] the caller's layout: padding, gap, size
 * @param {Object}    [style]
 * Any other prop (role, aria-*, onMouseDown, data-*) lands on the panel; the ref is the panel.
 */
const VARIANTS = {
  lift: { className: 'kol-overlay-panel rounded-[var(--kol-radius-sm)]', style: {} },
  bordered: { className: 'border border-fg-08 rounded-[var(--kol-radius-sm)]', style: { background: 'var(--kol-surface-primary)', color: 'var(--kol-surface-on-primary)' } },
  float: { className: 'kol-float-solid !rounded-[var(--kol-float-window-r)] text-fg-emphasis', style: {} },
  settings: { className: 'rounded-2xl border border-oq-16 bg-surface-secondary text-fg-96 font-(family-name:--kol-font-family-float) shadow-[var(--kol-shadow-float)]', style: {} },
}

const ModalShell = forwardRef(function ModalShell({ variant = 'lift', header, footer, className = '', style, children, ...rest }, ref) {
  const look = VARIANTS[variant] ?? VARIANTS.lift
  return (
    <div ref={ref} {...rest} className={`kol-modal flex flex-col ${look.className} ${className}`.trim()} style={{ ...look.style, ...style }}>
      {header}
      {children}
      {footer}
    </div>
  )
})

export default ModalShell

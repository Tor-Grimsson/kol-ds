import { forwardRef } from 'react'
import { KolboxShell } from '../utilities/Popover.jsx'

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
 * ONE RADIUS: `--kol-radius-4` (4px) — the radius Modal's prompts and Dialog wore. The float style's windows keep the
 * float window radius (`float`, 28) and the generator settings window its 20 (`settings`, no outer border — his mock 143:35343, plan-2026-11-12-one-header W8.1); both are the float style's
 * own, drawn in its Figma.
 *
 * @param {'lift'|'bordered'|'float'|'settings'|'kolbox'|'folio'} [variant='lift']
 *   `lift` — the overlay panel every KOL overlay wears (`.kol-overlay-panel`: oq-04, no border, the scrim is the edge);
 *   `bordered` — the page surface behind an fg-08 hairline (Modal's prompts); `float` — the float window
 *   (`kol-float-solid`); `settings` — the generator settings window (the secondary surface, radius 20, the float shadow, no border).
 *   `kolbox` (plan-2026-11-18-kolbox-system W31.2 batch 4, 2026-11-18) — kolbox's panel shell (its PopoverShell, carried
 *   line for line): radius 16, the secondary surface on the one floating surface, 240 wide (`--kol-kolbox-popover-w`)
 *   unless `width` says; it draws its own header from `leading`, `title`, `actions` and the close (`onClose`), the body,
 *   and `footer` as a row of buttons; `aria-label` defaults to the title. The panel every kolbox popover and window is.
 *   `folio` (Folio migration batch B, 2026-11-22) — Folio's overlay panel: `bordered`'s hairline and radius 4 on Folio's
 *   paper and rule (`.kol-modal--folio`); its ink and shadow are the caller's (the search modal's, the dialog's).
 * @param {ReactNode} [header]   drawn first
 * @param {ReactNode} [footer]   drawn last
 * @param {string}    [className] the caller's layout: padding, gap, size
 * @param {Object}    [style]
 * Any other prop (role, aria-*, onMouseDown, data-*) lands on the panel; the ref is the panel.
 */
const VARIANTS = {
  lift: { className: 'kol-overlay-panel rounded-[var(--kol-radius-4)]', style: {} },
  bordered: { className: 'border border-fg-08 rounded-[var(--kol-radius-4)]', style: { background: 'var(--kol-surface-primary)', color: 'var(--kol-surface-on-primary)' } },
  float: { className: 'kol-float-solid !rounded-[var(--kol-float-window-r)] text-fg-emphasis', style: {} },
  folio: { className: 'kol-modal--folio border rounded-[var(--kol-radius-4)]', style: {} },
  settings: { className: 'rounded-[20px] bg-surface-secondary text-fg-96 font-(family-name:--kol-font-family-float) shadow-[var(--kol-shadow-float)]', style: {} },
}

const ModalShell = forwardRef(function ModalShell(props, ref) {
  if (props.variant === 'kolbox') {
    const { variant, ...shell } = props
    return <KolboxShell ref={ref} {...shell} />
  }
  const { variant = 'lift', header, footer, className = '', style, children, ...rest } = props
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

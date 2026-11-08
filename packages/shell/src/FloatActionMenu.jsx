import { useState } from 'react'
import { Button, PopoverPanel, usePopover, floatSurfaceClass, floatMotion } from '@kolkrabbi/kol-component'
import MoreRows from './MoreSheet.jsx'

/* taxonomy-ok: molecule — a round Button that opens the More sheet's rows */

/**
 * FloatActionMenu — The masthead's round button and its sheet (FloatActionMenuExport, kol-website 2026-11-04 — lifted as is
 * from HubHome's private `HomeMenu`, which it still is): the inverted round button, × while its sheet is open, the sheet
 * beside it to the LEFT, top edges on one line, 12 off (user 2026-10-23), the phone More's rows. The catalog's
 * VariantsButton shape. FloatLayout draws it at the bar's end from `bar.menu`.
 *
 * @param {Array}    actions  `[{ label, icon?, onPress }]` — MoreRows' actions
 * @param {'more'|'plus'|string} [icon='more']  the button's glyph; anything but `more` turns to × while open
 * @param {'float'} [variant]  the sheet in the float look (`kol-more-sheet-float` on `surface`); unset, the plain sheet
 * @param {'solid'|'glass-dark'|'glass-light'} [surface='solid']  what the float sheet is made of — the button never changes
 * @param {'rotate'|'swap'} [iconMotion='rotate']  how a glyph that is not `more` becomes the × while open: `rotate` turns
 *                                the one glyph 45° (the + into the ×) and back on close; `swap` exchanges the icon
 * @param {boolean|Object} [motion=true]  the button's states, the turn and the sheet's enter and leave: `true` the
 *                                `--kol-float-*` tokens · `false` none · `{ duration, ease }` per app (floatMotion)
 * @param {string}   [className]
 *
 * The button's ladder (FloatActionStatesAndMotion, kol-website 2026-11-04): rest the solid inverted circle with the float
 * shadow · hover the same fill at `--kol-float-hover-opacity` · pressed `--kol-float-press-scale` · open the × on the same
 * fill and shadow (`.kol-float-action`; the shadow with `variant="float"`, so Home's plain masthead button is not lifted).
 */
export default function FloatActionMenu({ actions, icon = 'more', variant, surface = 'solid', iconMotion = 'rotate', motion = true, className = '' }) {
  const [open, setOpen] = useState(false)
  /* the sheet opens to the LEFT of the button, top edges on one line (user 2026-10-23) — as the phone's sits beside its × */
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'left-start', offset: 12 })
  const turn = icon !== 'more' && iconMotion === 'rotate'
  const glyph = icon === 'more' ? 'more' : open && !turn ? 'x' : icon
  return (
    <div className={className} style={floatMotion(motion).style}>
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex">
        {/* `icon` — `more` on Home, `plus` signed out (frame B2), the × while its sheet is open */}
        {/* always the inverted round button — `surface` dresses its menu only (HomeDockRound4, kol-fxr 2026-10-31 — user: *"this
          * also changed the action button, but it is not supposed to change"*) */}
        <Button iconOnly={glyph} size="lg" tone="inverted" radius="full" aria-label={open ? 'Close' : 'Actions'} pressed={open}
          className={`kol-float-action${variant === 'float' ? ' is-float' : ''}${turn ? ` kol-float-turn${open ? ' is-open' : ''}` : ''}`} />
      </span>
      <PopoverPanel popover={popover} panel={false} motion={motion} className={`kol-more-sheet${variant === 'float' ? ` kol-more-sheet-float ${floatSurfaceClass(surface, true)}` : ''}`} style={{ minWidth: 220 }}>
        <MoreRows actions={actions} variant={variant} onPick={() => setOpen(false)} />
      </PopoverPanel>
    </div>
  )
}

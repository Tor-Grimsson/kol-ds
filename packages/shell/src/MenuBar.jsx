import { useEffect, useRef, useState } from 'react'
import { Menu, MenuRow, MenuDivider, MenuFlyout, MenuLabel } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: organism — a row of kol-component `Menu`s with MenuRow · MenuFlyout · MenuDivider rows */

/**
 * MenuBar — The app's menu bar, inside the browser, above the app (plan-2026-11-05-float-editor W1.1; his frame
 * 20:13601, Section 5 20:12208). 40 tall on the secondary surface: the app's name first (bold), its menus beside it,
 * the `end` menus at the far right (Help). Every menu is DATA, so each app (the editor, Labs, Randomiser, Morph)
 * passes its own. Built on kol-component's `Menu` (the one engine) and its parts — MenuRow, MenuFlyout, MenuDivider,
 * MenuLabel; the look is the editor menu's (MenuTop): sans 13 medium, 26 triggers, a 250 list of 24 rows.
 *
 * A desktop menu bar's manners: once one menu is open, pointing at another opens it; ← / → walk the open menu along
 * the bar (wrapping, `end` included); Esc closes. Submenus open beside their row (MenuFlyout: hover, → in, ← out).
 *
 * @param {string|Object} app   the app's name ("FXR"), or a menu `{ label, items }` when the name opens the app menu
 * @param {Array}  menus        `[{ label, items, width? }]` — `width` the list's (default 250)
 * @param {Array}  end          the same, at the bar's far end (Help)
 * @param {'bar'|'capsule'} variant  `capsule` (plan-2026-11-05-float-editor W2b; his phone frame 06, 19:9544 — the Section 4
 *                                menu capsule 19:10617): the menus on a float sheet (the secondary surface, the window round,
 *                                20 in), each trigger the float label role in caps at fg-48 with a 10 chevron, 12 apart,
 *                                lit fg-96 while open. The same menus, lists and keys as the bar.
 * @param {string} className
 *
 * A row in `items` (Menu's own row keys): `{ label, onClick, kbd?, disabled?, checked?, indicator?, icon?, tone? }` ·
 * `{ label, items }` a submenu · `{ divider: true }` · `{ heading }` a section label.
 */
const ROW = 'kol-menubar-row w-full shrink-0 flex items-center gap-2 h-6 px-2 rounded-[var(--kol-radius-sm)] text-left font-[family-name:var(--kol-font-family-sans)] text-[13px] font-medium leading-normal text-[color:var(--kol-fg-emphasis)] hover:bg-[var(--kol-fg-08)] aria-expanded:bg-[var(--kol-fg-08)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:bg-[var(--kol-fg-08)]'
/* the list: the secondary surface, a 2% rim, 4 in, the large shadow; the key cap on the rim's fill, its ink oq-80 */
const LIST = 'kol-menubar-list flex flex-col bg-[var(--kol-surface-secondary)] border border-[var(--kol-fg-02)] rounded-[var(--kol-radius-sm)] p-1 shadow-[0_10px_15px_rgba(0,0,0,0.1)] [&_.kol-menu-kbd]:bg-[var(--kol-fg-02)] [&_.kol-menu-kbd]:border [&_.kol-menu-kbd]:border-[var(--kol-fg-02)] [&_.kol-menu-kbd]:text-[var(--kol-oq-80)] [&_.kol-menu-kbd]:rounded-[2px]'
/* the capsule's trigger (his 19:9544): Inter 11 caps at fg-48, the chevron 8 after, 26 tall, the text on the top */
const CAPSULE_TRIGGER = 'kol-menu-btn inline-flex items-start gap-2 h-[26px] p-0 bg-transparent border-0 kol-float-label uppercase whitespace-nowrap text-fg-48 hover:text-(--kol-fg-80) aria-expanded:text-(--kol-fg-96) focus-visible:outline-none focus-visible:text-(--kol-fg-96) [&_svg]:mt-[3px]'
/* the trigger: 26 tall, 12 in; lit while its menu is open. The line box is the pill (leading 26, not 13): a 13 line box
 * centred in 26 starts on a half pixel, and the glyphs rode it — the label's cap centre on the pill's centre, measured
 * in Chromium and Firefox (±0.5 at 1x is the 9px cap's own rounding). */
const TRIGGER = 'kol-menu-btn inline-flex items-center h-[26px] px-3 rounded-[var(--kol-radius-sm)] font-[family-name:var(--kol-font-family-sans)] text-[13px] leading-[26px] text-[color:var(--kol-fg-emphasis)] whitespace-nowrap hover:bg-[var(--kol-fg-08)] aria-expanded:bg-[var(--kol-fg-08)] focus-visible:outline-none focus-visible:bg-[var(--kol-fg-08)]'

function Rows({ items, width }) {
  return items.map((it, i) => {
    const key = it.key ?? `${it.label ?? 'r'}-${i}`
    if (it.divider) return <MenuDivider key={key} className="border-oq-08 mt-1 mb-[3px]" />
    if (it.heading) return <MenuLabel key={key}>{it.heading}</MenuLabel>
    const icon = it.icon && (typeof it.icon === 'string' ? <Icon name={it.icon} size={16} className="text-oq-88" /> : it.icon)
    if (it.items?.length) {
      return (
        /* the submenu butts the list it came from: its rim on the parent's right pad (his frame — 306 beside 316) */
        <MenuFlyout key={key} flyout label={it.label} iconLeft={icon} disabled={it.disabled} rowClass={ROW}
          panelClassName={LIST} panelStyle={{ width: it.width ?? width, marginLeft: -5 }}>
          <Rows items={it.items} width={it.width ?? width} />
        </MenuFlyout>
      )
    }
    return (
      <MenuRow key={key} rowClass={ROW} onClick={it.onClick} disabled={it.disabled} iconLeft={icon} tone={it.tone}
        indicator={it.indicator ?? (it.checked ? 'check' : undefined)} kbd={it.kbd}>
        {it.label}
      </MenuRow>
    )
  })
}

export default function MenuBar({ app, menus = [], end = [], variant = 'bar', className = '' }) {
  const capsule = variant === 'capsule'
  const appMenu = typeof app === 'string' ? { label: app } : app
  const all = [...(appMenu ? [{ ...appMenu, app: true }] : []), ...menus, ...end]
  const [open, setOpen] = useState(null)
  const triggers = useRef([])
  /* menus that open — the app's name without items is a label */
  const live = all.map((m, i) => (m.items?.length ? i : null)).filter((i) => i != null)

  /* ← / → walk the open menu along the bar; a flyout row's → (it opens the submenu) and a submenu's ← (it closes it)
   * are the flyout's own — MenuFlyout stops the ←; the → on a flyout row is skipped here */
  useEffect(() => {
    if (open == null) return undefined
    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (e.key === 'ArrowRight' && e.target.closest?.('[aria-haspopup="menu"][role="menuitem"]')) return
      if (e.key === 'ArrowLeft' && e.target.closest?.('[role="menu"] [role="menu"]')) return
      e.preventDefault()
      const at = live.indexOf(open)
      const next = live[(at + (e.key === 'ArrowRight' ? 1 : -1) + live.length) % live.length]
      setOpen(next)
      triggers.current[next]?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, live.join()]) // eslint-disable-line react-hooks/exhaustive-deps

  const item = (m, i) => {
    if (!m.items?.length) {
      return <span key={`${m.label}-${i}`} className={`${TRIGGER} hover:bg-transparent ${m.app ? 'font-bold' : 'font-medium'}`}>{m.label}</span>
    }
    return (
      <Menu key={`${m.label}-${i}`} offset={5}
        open={open === i}
        onOpenChange={(v) => setOpen((cur) => (v ? i : cur === i ? null : cur))}
        panelClassName={LIST} panelStyle={{ width: m.width ?? 250 }}
        trigger={({ open: isOpen, props }) => (
          <button {...props} ref={(el) => { triggers.current[i] = el }} type="button" aria-expanded={isOpen}
            /* the bar is live once a menu is open: pointing at another opens it (the mac menu bar) */
            onPointerEnter={() => { if (open != null && open !== i) setOpen(i) }}
            className={capsule ? CAPSULE_TRIGGER : `${TRIGGER} ${m.app ? 'font-bold' : 'font-medium'}`}>
            {m.label}
            {capsule && <Icon name="chevron-down" size={10} className="text-oq-48" />}
          </button>
        )}
      >
        <Rows items={m.items} width={m.width ?? 250} />
      </Menu>
    )
  }

  const startCount = (appMenu ? 1 : 0) + menus.length
  if (capsule) {
    return (
      <div role="menubar" aria-label="Menu bar" className={`kol-menubar kol-menubar--capsule flex items-start gap-3 p-5 rounded-[var(--kol-float-window-r)] bg-[var(--kol-surface-secondary)] ${className}`.trim()}>
        {all.map((m, i) => item(m, i))}
      </div>
    )
  }
  return (
    <div role="menubar" aria-label="Menu bar" className={`kol-menubar flex items-center gap-1 h-10 px-4 shrink-0 bg-[var(--kol-surface-secondary)] border-b border-[var(--kol-fg-02)] ${className}`.trim()}>
      {all.slice(0, startCount).map((m, i) => item(m, i))}
      {end.length > 0 && <span className="flex-1" aria-hidden="true" />}
      {all.slice(startCount).map((m, j) => item(m, startCount + j))}
    </div>
  )
}

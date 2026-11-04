import { useRef, useState } from 'react'
import { NavRail, useMediaQuery } from '@kolkrabbi/kol-component'
import TopControlsBar from './TopControlsBar.jsx'
import RailTrigger from './RailTrigger.jsx'
import RailFlyout from './RailFlyout.jsx'
import RailDisplayControls from './RailDisplayControls.jsx'

/* taxonomy-ok: module — the float page frame: NavRail float · RailTrigger · RailFlyout · TopControlsBar · PanelsRestore · the inspector slot · the bottom Rail slot */

/**
 * FloatLayout — The float workspace frame (plan-2026-11-04-float-views W1.1 — kol-float--style 9:15449 "Adaptive
 * workspace", its rules 9:15179). Assembled from the float chrome, nothing drawn here: the nav Rail (`NavRail
 * variant="float"`) in three states — `expanded` 280, `collapsed` 72 (a section's rows open beside a slot on hover,
 * RailFlyout), `hidden` 0 (RailTrigger and the breadcrumb take the corner) — the 64 TopControlsBar, the content slot,
 * ONE inspector slot (PropertyRail, 272 on the sheet radius), and a `bottom` Rail under both. 24 round the page and between the Rails, 40 under the bar.
 *
 * Visibility controls space, selection controls content: a hidden Rail is never removed — Panels ▾ (PanelsRestore)
 * shows in the bar exactly while one is hidden and brings it back as it was (the nav at its last width). Below `md` the
 * nav is the trigger and the inspector stacks under the content.
 *
 * @param {Array}    nav           NavRail float items — `{ heading }` | `{ icon, label, path, count?, sub? }`
 * @param {string}   currentPath · {Function} onNavigate  `(path) => void`
 * @param {string}   [title] · {string} [icon] · {Function} [onSwitch] · {Function} [onSearch]  the nav Rail's switcher and search
 * @param {'expanded'|'collapsed'|'hidden'} [rail]  the nav Rail's state (controlled); `defaultRail` uncontrolled (default `expanded`) · {Function} [onRailChange]
 * @param {Array}    [defaultExpanded]  paths of the nav's sections open at mount (NavRail's own; nothing auto-expands)
 * @param {ReactNode} [railFooter] the expanded Rail's foot (default RailDisplayControls: theme · Collapse · Hide)
 * @param {string|string[]} [breadcrumb]  the words beside RailTrigger while the nav is hidden
 * @param {Object}   [bar]         TopControlsBar's props (`document` · `tabs` · `tab` · `onTab` · `onSearch` · `action` · `start` · `center` · `end`); `panels` is the frame's
 * @param {ReactNode} [eyebrow]  a line in the 40 under the bar (float-operational W4.2, 9:14340's WORKSPACE / TASKS): 25 under
 *                                the bar, taking no height, so the content still starts 40 down. Below `md` it sits in flow
 *                                under the bar
 * @param {ReactNode|Function} [inspector]  the one inspector — a node, or `({ hide }) => node` (hand `hide` to PropertyRail's `onCollapse`)
 * @param {ReactNode} [bottom]   the bottom Rail (float-operational W1.1, 9:14340's Task index dock + filter capsule): runs under
 *                                the content AND the inspector, 24 below them, at its own height — the content row takes
 *                                what is left. Below `md` it scrolls with the content, after the inspector
 * @param {string}   [inspectorLabel]  its name in Panels ▾ (default "Inspector")
 * @param {boolean}  [inspectorHidden]  controlled; `defaultInspectorHidden` uncontrolled · {Function} [onInspectorHiddenChange]
 * @param {'solid'|'glass-dark'|'glass-light'} [surface]  what the floats are made of (default `solid`)
 * @param {ReactNode} children     the content
 * @param {string}   [className]
 */
export default function FloatLayout({
  nav = [], currentPath = '', onNavigate, title, icon, onSwitch, onSearch,
  rail, defaultRail = 'expanded', onRailChange, defaultExpanded, railFooter, breadcrumb,
  bar = {}, eyebrow, inspector, bottom, inspectorLabel = 'Inspector', inspectorHidden, defaultInspectorHidden = false, onInspectorHiddenChange,
  surface = 'solid', children, className = '',
}) {
  const [ownRail, setOwnRail] = useState(defaultRail)
  const [ownHidden, setOwnHidden] = useState(defaultInspectorHidden)
  const railNow = rail ?? ownRail
  const hidden = inspectorHidden ?? ownHidden
  const lastShown = useRef(railNow === 'hidden' ? 'expanded' : railNow)
  if (railNow !== 'hidden') lastShown.current = railNow
  const setRail = (r) => { if (rail === undefined) setOwnRail(r); onRailChange?.(r) }
  const setHidden = (h) => { if (inspectorHidden === undefined) setOwnHidden(h); onInspectorHiddenChange?.(h) }

  const phone = useMediaQuery('(max-width: 767px)')
  const shown = phone ? 'hidden' : railNow

  // the hover flyout: a section's rows beside the 72 Rail, kept open while the pointer is on the slot or the card
  const [fly, setFly] = useState(null)
  const timer = useRef(0)
  const hold = () => clearTimeout(timer.current)
  const drop = () => { hold(); timer.current = setTimeout(() => setFly(null), 160) }
  const onItemHover = (item, el) => {
    if (!item) return drop()
    hold()
    setFly(item.sub?.length ? { item, el } : null)
  }

  const restore = [
    ...(railNow === 'hidden' && !phone ? [{ label: 'Navigation', icon: 'panel-left', onPress: () => setRail(lastShown.current) }] : []),
    ...(inspector && hidden ? [{ label: inspectorLabel, icon: 'panel-right', onPress: () => setHidden(false) }] : []),
  ]
  const body = typeof inspector === 'function' ? inspector({ hide: () => setHidden(true) }) : inspector

  return (
    <div className={`kol-float-layout flex h-dvh gap-6 overflow-hidden bg-surface-primary p-6 max-md:p-4 ${className}`.trim()}>
      {shown !== 'hidden' && (
        <NavRail variant="float" items={nav} currentPath={currentPath} onNavigate={onNavigate}
          collapsed={shown === 'collapsed'} onCollapsedChange={(c) => { setFly(null); setRail(c ? 'collapsed' : 'expanded') }}
          title={title} icon={icon} onSwitch={onSwitch} onSearch={onSearch} onHide={() => setRail('hidden')}
          onItemHover={shown === 'collapsed' ? onItemHover : undefined} defaultExpanded={defaultExpanded}
          footer={shown === 'expanded' ? (railFooter ?? <RailDisplayControls onCollapse={() => setRail('collapsed')} onHide={() => setRail('hidden')} />) : undefined}
          className="shrink-0" />
      )}
      {shown === 'collapsed' && fly && (
        <span className="contents" onMouseEnter={hold} onMouseLeave={drop}>
          <RailFlyout icon={fly.item.icon} title={fly.item.label} items={fly.item.sub} active={currentPath} anchor={fly.el} surface={surface}
            onOpenChange={(o) => { if (!o) setFly(null) }}
            onPick={(i) => { setFly(null); if (i.path) onNavigate?.(i.path) }} />
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-10 max-md:gap-6">
        <div className="relative min-w-0 shrink-0">
          <div className="flex min-w-0 items-center gap-4">
            {shown === 'hidden' && <RailTrigger items={nav} currentPath={currentPath} onNavigate={onNavigate} title={title} breadcrumb={phone ? undefined : breadcrumb} surface={surface} className="shrink-0" />}
            <TopControlsBar {...bar} panels={restore.length ? { items: restore } : undefined} surface={surface}
              className={`min-w-0 flex-1 max-md:overflow-x-auto max-md:[scrollbar-width:none] ${bar.className ?? ''}`.trim()} />
          </div>
          {eyebrow && <div className="kol-float-layout-eyebrow absolute inset-x-0 top-full pt-[25px] max-md:static max-md:pt-6">{eyebrow}</div>}
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-6 max-md:overflow-y-auto">
          <div className="flex min-h-0 flex-1 gap-6 max-md:flex-none max-md:flex-col">
            <div className="kol-float-layout-content min-w-0 flex-1 overflow-y-auto max-md:flex-none max-md:overflow-visible">{children}</div>
            {body && !hidden && <aside aria-label={inspectorLabel} className="max-h-full shrink-0 self-start overflow-y-auto [scrollbar-width:none] max-md:max-h-none max-md:self-stretch">{body}</aside>}
          </div>
          {bottom && <div className="kol-float-layout-bottom min-w-0 shrink-0">{bottom}</div>}
        </div>
      </div>
    </div>
  )
}

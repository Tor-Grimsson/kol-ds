import { useRef, useState } from 'react'
import { NavRail, CommandOverlay, useMediaQuery, useRailKeys, floatMotion, useFloatPresence } from '@kolkrabbi/kol-component'
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
 * @param {false|Object} [railKeys]  `\` expanded ↔ collapsed, `⇧\` hide ↔ show (back to its last width) — kol-component's
 *                                `useRailKeys`, the same prop on AppShell and SiteLayout; `false` off, `{ collapse, hide }` rebinds
 * @param {'push'|'overlay'} [railMode='push']  `push` lays the rail beside the content (it resizes the page); `overlay` floats it
 *                                over the content at the frame's 24 inset, so expand, collapse and hide never move the page — the
 *                                content keeps its full width, the top bar and Panels ⌄ stay where they are, and the hidden
 *                                state's RailTrigger sits over the bar's start (FloatRailOverlayShadowRestore, 2026-11-04)
 * @param {Array}    [defaultExpanded]  paths of the nav's sections open at mount (NavRail's own; nothing auto-expands)
 * @param {ReactNode} [railFooter] the expanded Rail's foot (default RailDisplayControls: theme · Collapse · Hide)
 * @param {string|string[]} [breadcrumb]  the words beside RailTrigger while the nav is hidden
 * @param {Object}   [bar]         TopControlsBar's props (`document` · `tabs` · `tab` · `onTab` · `onSearch` · `action` · `menu` · `start` · `center` · `end`); `menu` — `[{ label, icon?, onPress }]` — is FloatActionMenu in the top-right corner; `panels` is the frame's
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
 * @param {boolean}  [panels=true]  Panels ⌄ (PanelsRestore) in the bar while a Rail is hidden; `false` drops it — the way back is
 *                                RailTrigger's "Show navigation" row and `⇧\` (FloatSearchAndPanels, 2026-11-04)
 * @param {Object}   [search]     CommandOverlay's props (`open` · `onClose` · `results` · `query` · `onQueryChange` · `onSelect` …):
 *                                the search modal, drawn on this frame's `surface`; the app keeps the data
 * @param {boolean|Object} [motion=true]  the float family's motion, handed to every piece (FloatActionStatesAndMotion,
 *                                2026-11-04): the nav Rail's expand ↔ collapse (width) and hide ↔ show (the width opens from and
 *                                closes to 0, fading), RailFlyout and RailTrigger's card in and out, the search modal, and the
 *                                + and its card. `true` the `--kol-float-*` tokens · `false` none · `{ duration, ease }` per app
 * @param {ReactNode} children     the content
 * @param {string}   [className]
 */
export default function FloatLayout({
  nav = [], currentPath = '', onNavigate, title, icon, onSwitch, onSearch,
  rail, defaultRail = 'expanded', onRailChange, railKeys, railMode = 'push', defaultExpanded, railFooter, breadcrumb,
  bar = {}, eyebrow, inspector, bottom, inspectorLabel = 'Inspector', inspectorHidden, defaultInspectorHidden = false, onInspectorHiddenChange,
  surface = 'solid', panels = true, search, motion = true, children, className = '',
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
  const overlay = railMode === 'overlay'
  const fm = floatMotion(motion)
  /* the rail is held while it hides, so its width closes to 0 instead of the page jumping (FloatActionStatesAndMotion) */
  const railShown = shown !== 'hidden'
  const railPresence = useFloatPresence(railShown, fm.rail)
  const lastRail = useRef(shown)
  if (railShown) lastRail.current = shown
  const railState = railShown ? shown : lastRail.current

  // the hover flyout: a section's rows beside the 72 Rail, kept open while the pointer is on the slot or the card
  const [fly, setFly] = useState(null)
  /* the last card is kept so RailFlyout can play its leave after `fly` clears */
  const lastFly = useRef(null)
  if (fly) lastFly.current = fly
  const timer = useRef(0)
  const hold = () => clearTimeout(timer.current)
  const drop = () => { hold(); timer.current = setTimeout(() => setFly(null), 160) }
  const onItemHover = (item, el) => {
    if (!item) return drop()
    hold()
    setFly(item.sub?.length ? { item, el } : null)
  }

  /* the rail keys (useRailKeys): `\` 280 ↔ 72, `⇧\` hide ↔ show at its last width (`lastShown`) */
  useRailKeys(railKeys, {
    onCollapse: () => { if (railNow !== 'hidden') { setFly(null); setRail(railNow === 'expanded' ? 'collapsed' : 'expanded') } },
    onHide: () => setRail(railNow === 'hidden' ? lastShown.current : 'hidden'),
  })

  const restore = [
    ...(railNow === 'hidden' && !phone ? [{ label: 'Navigation', icon: 'panel-left', onPress: () => setRail(lastShown.current) }] : []),
    ...(inspector && hidden ? [{ label: inspectorLabel, icon: 'panel-right', onPress: () => setHidden(false) }] : []),
  ]
  const body = typeof inspector === 'function' ? inspector({ hide: () => setHidden(true) }) : inspector

  return (
    <div className={`kol-float-layout relative flex h-dvh gap-6 overflow-hidden bg-surface-primary p-6 max-md:p-4 ${className}`.trim()} style={fm.style}>
      {railPresence.mounted && (
        <NavRail variant="float" items={nav} currentPath={currentPath} onNavigate={onNavigate} motion={motion}
          collapsed={railState === 'collapsed'} onCollapsedChange={(c) => { setFly(null); setRail(c ? 'collapsed' : 'expanded') }}
          title={title} icon={icon} onSwitch={onSwitch} onSearch={onSearch} onHide={() => setRail('hidden')}
          onItemHover={shown === 'collapsed' ? onItemHover : undefined} defaultExpanded={defaultExpanded}
          footer={railState === 'expanded' ? (railFooter ?? <RailDisplayControls onCollapse={() => setRail('collapsed')} onHide={() => setRail('hidden')} />) : undefined}
          className={`${overlay ? 'absolute inset-y-6 left-6 z-[var(--kol-z-sticky)] !h-auto' : 'shrink-0'}${railPresence.entering ? ' is-entering' : ''}${railPresence.exiting ? ' is-exiting' : ''}`} />
      )}
      {shown === 'collapsed' && lastFly.current && (
        <span className="contents" onMouseEnter={hold} onMouseLeave={drop}>
          <RailFlyout icon={lastFly.current.item.icon} title={lastFly.current.item.label} items={lastFly.current.item.sub} active={currentPath}
            anchor={lastFly.current.el} open={!!fly} surface={surface} motion={motion}
            onOpenChange={(o) => { if (!o) setFly(null) }}
            onPick={(i) => { setFly(null); if (i.path) onNavigate?.(i.path) }} />
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-10 max-md:gap-6">
        <div className="relative min-w-0 shrink-0">
          <div className="flex min-w-0 items-center gap-4">
            {shown === 'hidden' && <RailTrigger items={nav} currentPath={currentPath} onNavigate={onNavigate} title={title} breadcrumb={phone ? undefined : breadcrumb} surface={surface} motion={motion}
              onRestore={phone ? undefined : () => setRail(lastShown.current)}
              className={overlay && !phone ? 'absolute inset-y-0 left-0 z-[var(--kol-z-sticky)]' : 'shrink-0'} />}
            <TopControlsBar motion={motion} {...bar} panels={panels && restore.length ? { items: restore } : undefined} surface={surface}
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
      {search && <CommandOverlay {...search} surface={surface} motion={motion} />}
    </div>
  )
}

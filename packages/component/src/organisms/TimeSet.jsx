import { useEffect, useMemo, useRef } from 'react'
import { timelineModel } from './time/model.js'
import { mountTimeline } from './time/view.js'

/**
 * TimeSet — a project in time, four ways: Timeline (phases across the whole project, dated checkpoints, breaks, the Today
 * line) · Month · Week · Day, one switch, one legend, a phase's detail on click. kol-atlas's timeline views carried
 * verbatim (TimeSetAndSiteRailFade, kol-website 2026-10-29 — user: *"in kol-atlas there are date components … we might
 * just need day? and then we have a full 'time' set?"*), Day added. The views are plain HTML from `time/view.js`; this
 * mounts them. Styles: kol-theme's `kol-components-time.css` (`--tl-*`, mapped to KOL's tokens).
 *
 * @param {Array}  milestones  parseProject's milestones (kol-atlas's shape) — `{ id, title, when, phases: [{ id, title, when,
 *                             dw?, reason?, marks, items: [{ num, text, kind, date?, time? }] }] }`; or pass `model`
 * @param {Object} model       a `timelineModel(milestones)` already built
 * @param {string} today       ISO day the Today line marks (default: the real today)
 * @param {Date|string} now    the moment Day's Today line marks (default: now)
 * @param {string} view        'timeline' | 'month' | 'week' | 'day' — the view to open on (else the viewer's last)
 * @param {string} storageKey  where the viewer's view is remembered (default `kol-time-view`)
 */
export default function TimeSet({ milestones, model, today, now, view, storageKey, className = '' }) {
  const ref = useRef(null)
  const m = useMemo(() => model ?? timelineModel(milestones ?? []), [model, milestones])
  useEffect(() => mountTimeline(ref.current, m, { today, now, view, storageKey }), [m, today, now, view, storageKey])
  return <div ref={ref} className={className} />
}

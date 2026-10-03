import { useEffect, useState } from 'react'
import { ShortcutsOverlay } from '@kolkrabbi/kol-shell'
import MirrorPlayground from './pages/MirrorPlayground.jsx'
import { KEYBOARD_SHORTCUTS } from './data/shortcuts'
import { transport } from './hooks/transport'
import { useRenderStats, setStatsEnabled } from './hooks/renderStats'
import { useRenderQuality } from './hooks/renderQuality'
import { useAdaptiveQuality } from './hooks/adaptiveQuality'
import './mixer.css'

/* THE STUDIO ALONE — kol-mirror's `/studio` (pages/MirrorPlayground.jsx and everything it reaches
 * are mirror's files, copied at mirror's own paths) with nothing around it: no nav rail and none
 * of mirror's other pages. No router of its own either — the showcase's Mixer set mounts this file
 * and already sits inside the showcase's router, where a second one cannot nest.
 *
 * `StudioKeys` is what mirror's `App.jsx` shell gave the studio, copied from it. Its rail keys
 * (Option + digit) are not here — there is no rail. */
function FpsMeter() {
  const stats = useRenderStats()
  const q = useRenderQuality()
  useEffect(() => { setStatsEnabled(true); return () => setStatsEnabled(false) }, [])
  const rows = Object.entries(stats.stages || {}).filter(([, ms]) => ms > 0.01)
  const bad = stats.fps > 0 && stats.fps < 50
  return (
    <div
      className="kol-helper-10 bg-surface-secondary border border-fg-08"
      style={{ position: 'fixed', right: 12, top: 12, borderRadius: 4, padding: '6px 8px', zIndex: 'var(--kol-z-tooltip)', fontVariantNumeric: 'tabular-nums', minWidth: 132, pointerEvents: 'none' }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className={bad ? 'text-[#e74c3c]' : 'text-fg-96'}>{stats.fps} fps</span>
        <span className="text-fg-32">{stats.frameMs ? `${stats.frameMs}ms` : '—'}</span>
      </div>
      {(stats.p95 > 0 || stats.jank > 0) && (
        <div className="flex items-center justify-between gap-4 text-fg-32">
          <span>p95 {stats.p95}ms</span>
          <span className={stats.jank > 0 ? 'text-[#e74c3c]' : ''}>{stats.jank} jank</span>
        </div>
      )}
      {rows.length > 0 && (
        <div className="flex flex-col" style={{ marginTop: 4 }}>
          {rows.map(([name, ms]) => (
            <div key={name} className="flex items-center justify-between gap-4 text-fg-48">
              <span>{name}</span><span>{ms.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
      {Object.keys(stats.perChannel || {}).length > 0 && (
        <div className="flex flex-col" style={{ marginTop: 4 }}>
          {Object.entries(stats.perChannel).map(([i, ms]) => (
            <div key={i} className="flex items-center justify-between gap-4 text-fg-48">
              <span>ch {Number(i) + 1}</span><span>{ms.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between gap-4 text-fg-32" style={{ marginTop: 4 }}>
        <span>{stats.pixels ? `${(stats.pixels / 1e6).toFixed(2)}MP` : '—'}</span>
        <span>{q.effectiveScale === 1 ? 'full' : `${q.effectiveScale}x`}{q.adaptive && q.autoScale && q.autoScale < q.scale ? ' auto' : ''} · {stats.channels} ch</span>
      </div>
    </div>
  )
}

/* What mirror's shell gave EVERY route — the frame budget (F), Space for the transport, adaptive
 * quality — and its shortcuts sheet (S). A hub has its own sheet on S (AppHub), so apps/mixer-hub
 * mounts this with `sheet={false}`. */
export function StudioKeys({ sheet = true }) {
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showFps, setShowFps] = useState(false)
  useAdaptiveQuality()

  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      if (e.key === ' ') { if (t.tagName === 'BUTTON') return; e.preventDefault(); transport.toggle() }
      else if (sheet && e.key.toLowerCase() === 's') setShowShortcuts((v) => !v)
      else if (e.key.toLowerCase() === 'f') setShowFps((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sheet])

  return (
    <>
      {showShortcuts && <ShortcutsOverlay shortcuts={KEYBOARD_SHORTCUTS} onClose={() => setShowShortcuts(false)} />}
      {showFps && <FpsMeter />}
    </>
  )
}

export default function Standalone() {
  return (
    /* THE GROUND THE SHELL WOULD PAINT. In mirror, AppShell's main is `surface-primary` and hands
     * the page its wash (`pageWash="var(--kol-fg-02)"`), which the studio's root reads. */
    <div className="bg-surface-primary" style={{ '--kol-shell-page-wash': 'var(--kol-fg-02)' }}>
      <MirrorPlayground />
      <StudioKeys />
    </div>
  )
}

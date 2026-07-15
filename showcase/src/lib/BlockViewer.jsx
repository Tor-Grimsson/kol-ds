import { useEffect, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { Button } from '@kolkrabbi/kol-component'

/**
 * BlockViewer — the shadcn /blocks stage. A toolbar (Preview/Code · description
 * · device breakpoints · open standalone · refresh · copy source) over a
 * resizable preview iframe pointed at the bare /blocks/preview/:slug route, so
 * the block's OWN responsive breakpoints fire at the frame width.
 *
 * Sizing follows shadcn exactly: desktop = the preview fills the card flush,
 * no dot background. Tablet/mobile = the frame anchors LEFT, the dot-grid
 * off-canvas area shows on the right, and a drag handle on the frame's right
 * edge resizes it freely (pointer events; iframe pointer-events are cut while
 * dragging so it can't swallow the drag).
 */

const DEVICES = [
  { key: 'desktop', icon: 'monitor', width: '100%', label: 'Desktop' },
  { key: 'tablet', icon: 'tablet', width: 768, label: 'Tablet' },
  { key: 'mobile', icon: 'smartphone', width: 390, label: 'Mobile' },
]

const MIN_W = 340
/* Real-device frame height — 620 starved every dvh-budgeted layout (the chess
 * board sizes itself off 100dvh; at 620 it collapsed). ~real iPhone height. */
const FRAME_H = 800
/* Desktop preset must actually BE desktop: when the card is narrower than the
 * lg breakpoint the frame renders at a true desktop width and scales down to
 * fit, so the iframe's media queries fire at 1280, not at the card width. */
const DESKTOP_W = 1280
const LG = 1024

const DOT_GRID = {
  backgroundImage: 'radial-gradient(var(--kol-fg-16) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

function IconBtn({ icon, label, active, onClick, href }) {
  const cls = `inline-flex h-7 w-7 items-center justify-center rounded-[var(--kol-radius-sm)] transition-colors ${active ? 'bg-fg-08 text-emphasis' : 'text-meta hover:text-emphasis hover:bg-fg-04'}`
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} aria-label={label} title={label}>
        <Icon name={icon} size={15} />
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls} aria-label={label} title={label} aria-pressed={active}>
      <Icon name={icon} size={15} />
    </button>
  )
}

export default function BlockViewer({ entry, previewBase = '/blocks/preview', srcDir = 'blocks' }) {
  const [tab, setTab] = useState('preview')
  const [device, setDevice] = useState('desktop')
  const [width, setWidth] = useState('100%')
  const [reloadKey, setReloadKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [bodyW, setBodyW] = useState(0)
  const bodyRef = useRef(null)

  /* Track the card width so presets can scale-to-fit instead of lying:
   * a 768 tablet frame in a 700px card renders at 768 and shrinks visually. */
  useEffect(() => {
    if (!bodyRef.current) return
    const ro = new ResizeObserver(([e]) => setBodyW(e.contentRect.width))
    ro.observe(bodyRef.current)
    return () => ro.disconnect()
  }, [])

  const previewPath = `${previewBase}/${entry.key}`
  const isDesktop = width === '100%'

  /* The frame's TRUE width — what the iframe's media queries key on.
   * Desktop: the card itself when it's already ≥ lg, else a real desktop
   * width (scaled down). Presets/custom: their pixel width. */
  const handleW = isDesktop ? 0 : 24
  const availW = Math.max(bodyW - handleW, 0)
  const frameW = isDesktop
    ? (bodyW >= LG ? bodyW : DESKTOP_W)
    : width
  const scale = availW > 0 && frameW > availW ? availW / frameW : 1

  const pickDevice = (d) => {
    setDevice(d.key)
    setWidth(d.width)
  }

  /* shadcn's resize handle: drag sets a free width; the active device chip
   * clears since the width no longer matches a preset. */
  const startDrag = (e) => {
    e.preventDefault()
    setDragging(true)
    setDevice('custom')
    const rect = bodyRef.current.getBoundingClientRect()
    const onMove = (ev) => {
      const max = rect.width - 24
      setWidth(Math.round(Math.min(Math.max(ev.clientX - rect.left, MIN_W), max)))
    }
    const onUp = () => {
      setDragging(false)
      window.removeEventListener('pointermove', onMove)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
  }

  const copySource = async () => {
    try {
      await navigator.clipboard.writeText(entry.source || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard blocked — no-op */ }
  }

  const Divider = () => <span className="mx-1 h-4 w-px shrink-0 bg-fg-12" aria-hidden="true" />

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--kol-radius-md)] border border-fg-12 bg-surface-primary">
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-fg-12 px-3 py-2">
        <div className="flex items-center gap-1">
          {['preview', 'code'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`kol-mono-12 rounded-[var(--kol-radius-sm)] px-3 py-1 capitalize transition-colors ${tab === t ? 'bg-fg-08 text-emphasis' : 'text-meta hover:text-emphasis'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <Divider />
        <span className="kol-mono-12 min-w-0 truncate text-meta">{entry.description}</span>

        <div className="ml-auto flex items-center gap-1">
          {tab === 'preview' && (
            <>
              <div className="hidden items-center gap-1 sm:flex">
                {DEVICES.map((d) => (
                  <IconBtn key={d.key} icon={d.icon} label={d.label} active={device === d.key} onClick={() => pickDevice(d)} />
                ))}
              </div>
              <Divider />
              {/* shadcn's expand control: the standalone, chrome-less view */}
              <IconBtn icon="maximize" label="Open standalone view" href={previewPath} />
              <IconBtn icon="refresh-cw" label="Refresh preview" onClick={() => setReloadKey((k) => k + 1)} />
              <Divider />
            </>
          )}
          {/* Copy source — KOL blocks are copy-paste, not npx-installable */}
          <Button
            variant="primary"
            size="sm"
            iconLeft={copied ? 'check' : 'terminal'}
            onClick={copySource}
            title="Copy the block source"
          >
            {copied ? 'copied' : `${srcDir}/${entry.key}.jsx`}
          </Button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      {/* ONE persistent iframe: device switches and Preview/Code flips only
       * change wrapper classes/width, never remount it — remounting reboots
       * the whole app inside the frame (the original slow-switch bug).
       * loading="lazy" keeps off-screen stages (browse-all stacks six) from
       * loading until scrolled into view. */}
      <div
        ref={bodyRef}
        className={`${tab === 'preview' ? 'flex' : 'hidden'} items-stretch overflow-hidden`}
        style={isDesktop ? undefined : DOT_GRID}
      >
        <div
          className={`overflow-hidden bg-surface-primary ${isDesktop ? '' : 'rounded-r-[var(--kol-radius-md)] border-r border-fg-12'} ${dragging ? '' : 'transition-[width] duration-200 ease-out'}`}
          style={bodyW ? { width: Math.round(frameW * scale), height: Math.round(FRAME_H * scale) } : { width: '100%', height: FRAME_H }}
        >
          {/* The iframe holds its TRUE device dimensions (media queries fire
            * there) and scales down visually when the card is narrower. */}
          <iframe
            key={reloadKey}
            src={previewPath}
            title={entry.title}
            loading="lazy"
            className={`block border-0 ${dragging ? 'pointer-events-none' : ''}`}
            style={{
              width: frameW,
              height: FRAME_H,
              transform: scale === 1 ? undefined : `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
        {!isDesktop && (
          <div
            className="flex w-4 shrink-0 cursor-ew-resize items-center justify-center"
            onPointerDown={startDrag}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize preview"
          >
            <div className="h-10 w-1.5 rounded-full bg-fg-16" />
          </div>
        )}
      </div>
      {tab === 'code' && (
        <pre className="kol-mono-12 max-h-[620px] overflow-auto whitespace-pre bg-fg-04 px-4 py-3 text-fg">
          {entry.source || '// no source'}
        </pre>
      )}
    </div>
  )
}

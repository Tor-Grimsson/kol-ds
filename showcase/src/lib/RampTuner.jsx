import { useMemo, useState } from 'react'
import { SpectrumControls, ColorInputRow, Button, Table } from '@kolkrabbi/kol-component'
import { hexToHsv, hsvToHex, hexToHsl, hslToHex, contrastRatio } from './color-math.js'

/**
 * RampTuner — retune one brand ramp's ANCHOR in the page that documents it.
 *
 * Built on the DS's own picker family (`SpectrumControls` = HueStrip over
 * SBSquare) and `ColorInputRow` for hex, because both already exist and are
 * hand-tuned; the only thing added here is the ramp relationship, the contrast
 * readout and the CSS output.
 *
 * The siblings' offsets from the anchor are MEASURED from the shipped ramp at
 * mount, not assumed, so "ramp follows" preserves whatever relationship the
 * palette was actually tuned with rather than imposing an even curve.
 *
 * It reads the ramp it is given and emits CSS — it does NOT write to the
 * theme. `kol-brand-color.css` is a source file and editing it is the user's
 * call, so this hands over a paste rather than taking it.
 */
export default function RampTuner({ name, cssVarPrefix, stops, anchor, notes = {} }) {
  const [hsv, setHsv] = useState(() => hexToHsv(stops[anchor]))
  const [follows, setFollows] = useState(true)
  const [copied, setCopied] = useState(false)

  const keys = useMemo(
    () => Object.keys(stops).map(Number).sort((a, b) => a - b),
    [stops],
  )

  /* measured once per ramp — the tuning that already exists */
  const offsets = useMemo(() => {
    const a = hexToHsl(stops[anchor])
    return Object.fromEntries(keys.map((k) => {
      const c = hexToHsl(stops[k])
      return [k, { h: c.h - a.h, s: c.s - a.s, l: c.l - a.l }]
    }))
  }, [keys, stops, anchor])

  const hex = hsvToHex(hsv)

  const next = useMemo(() => {
    if (!follows) return { ...stops, [anchor]: hex }
    const a = hexToHsl(hex)
    return Object.fromEntries(keys.map((k) => {
      const o = offsets[k]
      return [k, hslToHex(a.h + o.h, a.s + o.s, a.l + o.l)]
    }))
  }, [follows, hex, keys, offsets, stops, anchor])

  const css = [
    `  /* ${name} */`,
    ...keys.map((k) => `  ${cssVarPrefix}-${k}: ${next[k]};${k === anchor ? ' /* anchor */' : ''}`),
  ].join('\n')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard blocked — the block is selectable */ }
  }

  const pairs = [
    ['White on it', '#FFFFFF', hex],
    ['Ink on it', '#121215', hex],
    ['It on white', hex, '#FFFFFF'],
    ['It on near-black', hex, '#0E0E11'],
  ]

  return (
    <div className="flex flex-col gap-6 max-w-[var(--kol-content-panel)]">
      <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <div className="h-[200px]">
            <SpectrumControls value={hsv} onChange={setHsv} />
          </div>
          <ColorInputRow
            label={`${anchor}`}
            value={hex}
            onChange={(v) => { const h = hexToHsv(v); if (h) setHsv(h) }}
          />
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setHsv(hexToHsv(stops[anchor]))}>
              Reset
            </Button>
            <Button
              size="sm"
              variant={follows ? 'primary' : 'outline'}
              onClick={() => setFollows((f) => !f)}
              aria-pressed={follows}
            >
              {follows ? 'Ramp follows' : 'Anchor only'}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <Table
            variant="simple"
            columns={[
              { accessor: 'stop', header: 'Stop' },
              {
                accessor: 'swatch',
                header: '',
                render: (r) => (
                  <span
                    className="inline-block h-6 w-16 rounded-[var(--kol-radius-sm)] border border-fg-08 align-middle"
                    style={{ background: r.hex }}
                  />
                ),
              },
              { accessor: 'hex', header: 'Value', render: (r) => <code className="kol-helper-12 text-emphasis">{r.hex}</code> },
              { accessor: 'note', header: 'Note', render: (r) => <span className="text-meta">{r.note}</span> },
            ]}
            rows={keys.map((k) => ({
              stop: k === anchor ? `${k} ★` : String(k),
              hex: next[k],
              note: [
                notes[k],
                next[k].toUpperCase() !== stops[k].toUpperCase() ? `was ${stops[k]}` : null,
              ].filter(Boolean).join(' · ') || '—',
            }))}
          />

          <div className="grid gap-2 sm:grid-cols-2">
            {pairs.map(([who, fg, bg]) => {
              const ratio = contrastRatio(fg, bg)
              const verdict = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large only' : 'fails'
              return (
                <div key={who} className="flex items-baseline justify-between gap-3 border border-fg-08 rounded-[var(--kol-radius-sm)] px-3 py-2">
                  <span className="kol-helper-12 text-meta">{who}</span>
                  <span className="kol-mono-14 text-emphasis tabular-nums">{ratio.toFixed(2)}</span>
                  <span className="kol-helper-10 text-subtle">{verdict}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="kol-doc-eyebrow text-meta">Paste into kol-brand-color.css</span>
          <Button size="sm" variant="outline" iconLeft={copied ? 'check' : 'copy'} onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <pre className="kol-mono-12 overflow-x-auto rounded-[var(--kol-radius-sm)] bg-fg-04 px-4 py-3 text-body">{css}</pre>
      </div>
    </div>
  )
}

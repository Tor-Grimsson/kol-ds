import { useState } from 'react'
import { CodeBlock, Dropdown, TabChips } from '@kolkrabbi/kol-component'
import PreviewStage from './PreviewStage.jsx'

/**
 * PreviewCard — THE Preview/Code card. One chrome, every surface.
 *
 * This existed alongside `BlockViewer`, which reimplemented the same idea and
 * diverged on seven axes: 960 vs 1574px, radius 4 vs 8, `--kol-oq-08` vs
 * `border-fg-12`, authored `Preview`/`Code` vs lowercase strings CSS-capitalised,
 * `CodeBlock` vs a bespoke `<pre>`, and a toolbar the other didn't have. Two
 * cards, two answers to every question. They are now one component: this file
 * owns the frame, the seam, the radius, the tab bar and the code tab, and the
 * BODY is pluggable — a live preview here, a device-resizable iframe in blocks.
 *
 * The width cap is a PROP, not a fork. Component pages cap at `panel`; blocks
 * and sets cap at `shell`, because page-level compositions are shell-wide by
 * nature — the distinction this file's old comment already drew ("truly
 * shell-wide apparatus lives in Blocks/Sets, not on component pages"). Both
 * read the same scale; neither improvises a pixel value.
 *
 * min-h floor is 10rem: the old 20rem stage read as a void around one-row previews.
 */
const TABS = [
  { key: 'preview', label: 'Preview' },
  { key: 'code', label: 'Code' },
]

const CHROME = {
  /* bordered toolbar over a framed figure — component pages, blocks, sets */
  figure: 'kol-doc-figure',
  /* no frame of its own: the BODY brings one (InstallBlock's CodeBlock does) */
  flush: '',
}

const CAPS = {
  panel: 'max-w-[var(--kol-content-panel)]',
  shell: 'max-w-[var(--kol-content-shell)]',
}

/** Vertical hairline between toolbar groups. */
export const ToolbarDivider = () => (
  <span className="mx-1 h-4 w-px shrink-0 bg-oq-08" aria-hidden="true" />
)

/* THE SIZE KNOB READS UP THE RAMP (2026-10-01 — user: "why does sizing start at md? should it not
 * be relative to size ramp from smallest to biggest?"). A preview lists its DEFAULT size first, which
 * is what the preview opens on; the picker shows the ramp in order. Names off the ramp keep the
 * preview's order. */
const RAMP = ['xs', 'sm', 'md', 'lg', 'xl']
const byRamp = (list) => (list.every((v) => RAMP.includes(v)) ? [...list].sort((a, b) => RAMP.indexOf(a) - RAMP.indexOf(b)) : list)

/* One axis, one control, and it says what it is (open-questions Round 6, ruled 2026-10-01 — user:
 * "can we have in the variant dropdown say first item 'variant' then divider then the list?", and
 * on the size toggle: "it clashes with the dropdown having that border. maybe we change to
 * dropdown?"). Every axis is a Dropdown: its name as the first row, a divider, the list. Labels
 * are capitalised (user, twice: "everything is always in lowercase"); the value passed on is raw. */
const capitalise = (v) => (typeof v === 'string' && v ? v[0].toUpperCase() + v.slice(1) : v)
const AxisPicker = ({ options, value, onChange, label }) => (
  <Dropdown
    size="sm"
    options={[{ heading: label }, { divider: true }, ...options.map((v) => ({ value: v, label: capitalise(v) }))]}
    value={value}
    onChange={onChange}
  />
)

export default function PreviewCard({
  entry,
  minH = 'min-h-[10rem]',
  cap = 'panel',
  /** tab set — Preview/Code by default; InstallBlock passes pnpm/npm/yarn/bun */
  tabs = TABS,
  /** (key) => ReactNode. Overrides the built-in preview/code bodies entirely. */
  renderTab,
  /** container geometry ONLY (the ThemeToggle law): 'figure' | 'flush' */
  chrome = 'figure',
  /** accessible name for the tab strip — 'View' fits Preview/Code, not pnpm/npm */
  tabsLabel = 'View',
  /** toolbar caption, right of the tabs (blocks use the entry description) */
  description,
  /** right-aligned toolbar controls; receives the active tab so preview-only
   *  controls can hide on Code without a second toolbar */
  actions,
  /** replaces the centred preview canvas — blocks pass their iframe stage. Kept
   *  mounted across tab flips so the frame never reboots on a Code→Preview
   *  round trip (remounting it was the original slow-switch bug). */
  renderBody,
  children,
}) {
  const [tab, setTab] = useState(tabs[0]?.key ?? 'preview')
  /* Variant preview (user ruling 2026-08-01) / size preview (2026-08-09): a
   * preview exports `variants` / `sizes` and the pickers ride the toolbar's
   * EXISTING actions lane, so both axes flip in place instead of needing a
   * second preview file or a trip off the page. */
  const variants = entry?.variants ?? null
  const [variant, setVariant] = useState(variants?.[0] ?? null)
  /* tone (W19, 2026-09-30 — user: "atom button had dropdown for variant, to atom ne and size, now its
   * back to only variant?"): the ground axis (tone-is-the-ground-axis) beside the look */
  const tones = entry?.tones ?? null
  const [tone, setTone] = useState(tones?.[0] ?? null)
  const sizes = entry?.sizes ?? null
  const [size, setSize] = useState(sizes?.[0] ?? null)
  /* the third axis (2026-09-30, the names audit: *"can props not be set like buttons variants
   * … in dropdown?"*): a preview exports `states` for what it would otherwise stack twice —
   * CurveOverlay's empty · handles · both */
  const states = entry?.states ?? null
  const [state, setState] = useState(states?.[0] ?? null)

  return (
    <div className={`${CHROME[chrome] ?? CHROME.figure} ${CAPS[cap] ?? CAPS.panel}`.trim()}>
      {/* seam law: opaque oq-08 (fg alpha brightens over tinted fills; 08 = the table wrapper's weight) */}
      {/* py-2.5, not py-2: at py-2 the rule sat flush under the Preview chip —
        * the chip's own block padding ate the whole gap, so the toolbar read
        * as a bug rather than a row. */}
      <div className="flex items-center gap-2 border-b border-oq-08 px-3 py-2.5">
        {/* THE DS tab chips (kol-component `TabChips`, 2026-10-01) — this was the local DocTabs */}
        <TabChips tabs={tabs.map((t) => ({ id: t.key, label: t.label }))} value={tab} onChange={setTab} ariaLabel={tabsLabel} />
        {description && (
          <>
            <ToolbarDivider />
            <span className="kol-mono-12 min-w-0 truncate text-meta">{description}</span>
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          {variants?.length > 1 && tab === 'preview' && (
            <AxisPicker options={variants} value={variant} onChange={setVariant} label="Variant" />
          )}
          {tones?.length > 1 && tab === 'preview' && (
            <AxisPicker options={tones} value={tone} onChange={setTone} label="Tone" />
          )}
          {sizes?.length > 1 && tab === 'preview' && (
            <AxisPicker options={byRamp(sizes)} value={size} onChange={setSize} label="Size" />
          )}
          {states?.length > 1 && tab === 'preview' && (
            <AxisPicker options={states} value={state} onChange={setState} label="State" />
          )}
          {actions && <div className="flex items-center gap-1">{actions(tab)}</div>}
        </div>
      </div>

      {renderTab ? (
        renderTab(tab)
      ) : renderBody ? (
        /* hidden, not unmounted — see renderBody above */
        <div className={tab === 'preview' ? 'block' : 'hidden'}>{renderBody()}</div>
      ) : entry?.frame ? (
        /* a page-sized preview runs in its own document (previews-registry `frame`) */
        tab === 'preview' && (
          <iframe title={`${entry.name} preview`} src={`/components/preview/${entry.name}`} className="block w-full border-0 bg-surface-primary" style={{ height: typeof entry.frame === 'number' ? entry.frame : 560 }} />
        )
      ) : (
        tab === 'preview' && (
          <div className={`flex ${minH} items-center justify-center bg-surface-sunken p-10`}>
            {entry?.Component ? (
              <PreviewStage entry={entry} variant={variant} tone={tone} size={size} state={state} />
            ) : children || (
              <span className="kol-mono-12 text-meta">no live preview — see usage below</span>
            )}
          </div>
        )
      )}

      {tab === 'code' && (
        /* bare — the figure IS the frame; the block's own surface + padding
         * run edge-to-edge below the tab bar. ONE code idiom (user ruling
         * 2026-07-30): blocks used to render a hand-rolled <pre> here. */
        <CodeBlock bare code={entry?.source || '// no source'} language="jsx" />
      )}
    </div>
  )
}

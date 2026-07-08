import { useState } from 'react'
import {
  Button,
  Dropdown,
  Input,
  SegmentedToggle,
  Tag,
  Textarea,
  ToggleSwitch,
} from '@kolkrabbi/kol-component'

/**
 * /demo — live review page for the 2026-07-08 chrome-law landing.
 * Real components + the full spec per section: every class emitted and
 * every state → token mapping, straight from the landed theme CSS.
 */

const DD_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'pattern', label: 'Pattern' },
]

const SEG_OPTIONS = [
  { value: 'fill', label: 'Fill' },
  { value: 'stroke', label: 'Stroke' },
  { value: 'both', label: 'Both' },
]

const SIZES = ['sm', 'md', 'lg']

function Section({ title, note, children }) {
  return (
    <section className="mb-16">
      <h2 className="kol-mono-16 text-emphasis mb-1">{title}</h2>
      {note && <p className="kol-mono-12 text-meta mb-6 max-w-[70ch]">{note}</p>}
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="kol-mono-12 text-meta w-28 shrink-0">{label}</span>
      {children}
    </div>
  )
}

/* Spec block — classes in use + state → token table. Data is hand-held to
 * the landed CSS; if these drift from the theme, the theme wins. */
function Spec({ classes, rows }) {
  return (
    <div className="mt-2 border-t border-fg-08 pt-4 flex flex-col gap-3">
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <span className="kol-mono-12 text-meta w-28 shrink-0">classes</span>
        <div className="flex-1 min-w-[300px] flex flex-col gap-1">
          {classes.map((c) => (
            <code key={c} className="kol-mono-12 text-body block">{c}</code>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <span className="kol-mono-12 text-meta w-28 shrink-0">states → tokens</span>
        <table className="flex-1 min-w-[300px] border-collapse">
          <tbody>
            {rows.map(([state, tokens]) => (
              <tr key={state} className="border-b border-fg-08 last:border-b-0 align-top">
                <td className="kol-mono-12 text-meta py-1 pr-4 whitespace-nowrap">{state}</td>
                <td className="kol-mono-12 text-body py-1">{tokens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Demo() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [pressed, setPressed] = useState(false)
  const [ddPrimary, setDdPrimary] = useState('solid')
  const [ddOutline, setDdOutline] = useState('solid')
  const [seg, setSeg] = useState('stroke')
  const [switches, setSwitches] = useState({ bare: true, primary: false, outline: true })
  const [text, setText] = useState('Value')

  const flipTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    setTheme(next)
  }

  const setSwitch = (key) => (next) => setSwitches((s) => ({ ...s, [key]: next }))

  return (
    <div className="min-h-screen bg-surface-primary text-fg px-8 py-12">
      <div className="max-w-[1080px] mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <p className="kol-mono-12 text-meta">chrome-law landing · 2026-07-08</p>
            <h1 className="kol-mono-20 text-emphasis">/demo — live component review</h1>
          </div>
          <Button variant="outline" size="sm" onClick={flipTheme}>
            theme: {theme}
          </Button>
        </header>

        <Section
          title="Button"
          note="Hover, click, and Tab through — hovers are opaque oq stops, active is one stop past hover, focus rings are new."
        >
          {SIZES.map((size) => (
            <Row key={size} label={size}>
              <Button variant="primary" size={size}>Primary</Button>
              <Button variant="secondary" size={size}>Secondary</Button>
              <Button variant="accent" size={size}>Accent</Button>
              <Button variant="outline" size={size}>Outline</Button>
              <Button variant="ghost" size={size}>Ghost</Button>
              <Button variant="primary" size={size} disabled>Disabled</Button>
            </Row>
          ))}
          <Row label="toggle (md)">
            <Button variant="primary" pressed={pressed} onClick={() => setPressed(!pressed)}>
              {pressed ? 'Snapping on' : 'Snapping off'}
            </Button>
            <span className="kol-mono-12 text-meta">pressed = solid inverted ink</span>
          </Row>
          <Spec
            classes={[
              'kol-btn kol-btn-{primary|secondary|accent|outline|ghost} kol-btn-{sm|md|lg} kol-mono-{12|14|16}',
              'modifiers: kol-btn-pressed · kol-btn-quiet · kol-btn-animate (kills default hovers)',
              'geometry: pad 4/12 · 6/16 · 8/20 → heights 26/32/40 · radius --kol-radius-sm · transition --kol-transition-base',
            ]}
            rows={[
              ['primary', 'rest --kol-surface-secondary → hover --kol-oq-08 → active --kol-oq-16'],
              ['secondary', 'rest --kol-surface-on-primary → hover --kol-oq-inverse-40 (label stays --kol-surface-primary) → active --kol-oq-inverse-48'],
              ['accent', 'rest --kol-accent-primary → hover --kol-accent-primary-strong (accent 80% → surface, opaque) → active accent 70% → surface'],
              ['outline', 'rest transparent · border --kol-oq-16 → hover bg --kol-oq-02 · border on-primary 25% → surface → active --kol-oq-08'],
              ['ghost', 'rest text --kol-oq-48 → hover bg --kol-oq-04 · text on-primary → active --kol-oq-08'],
              ['pressed', 'bg --kol-surface-on-primary · text --kol-surface-primary (held)'],
              ['focus', 'outline 2px --kol-focus-ring · offset 2px'],
              ['disabled', 'opacity --kol-opacity-disabled (.5) · cursor not-allowed'],
            ]}
          />
        </Section>

        <Section
          title="Dropdown"
          note="Trigger is button chrome (kol-btn classes). Open it: primary fuses with its panel — same fill, no border, no gap, hairline inside. Outline carries its border down."
        >
          {SIZES.map((size) => (
            <Row key={size} label={size}>
              <Dropdown variant="primary" size={size} options={DD_OPTIONS} value={ddPrimary} onChange={setDdPrimary} />
              <Dropdown variant="outline" size={size} options={DD_OPTIONS} value={ddOutline} onChange={setDdOutline} />
            </Row>
          ))}
          <Spec
            classes={[
              'trigger: kol-btn kol-btn-{primary|outline} kol-btn-{sm|md|lg} kol-mono-{12|14|16} kol-dd-trigger [kol-dd-trigger--open]',
              'panel: kol-dd-panel kol-dd-panel--{primary|outline} · divider: kol-dd-div (primary only)',
              'items: MenuDropdownItem — kol-helper-12 · text-body → hover:text-emphasis (text-only hover)',
              'legacy aliases: default/subtle → primary · minimal → outline',
            ]}
            rows={[
              ['trigger', 'inherits every button state above (same classes)'],
              ['open trigger', 'radius --kol-radius-sm --kol-radius-sm 0 0 (flat bottom, fuses with panel)'],
              ['panel primary', 'bg --kol-surface-secondary (= trigger fill) · no border · radius 0 0 4 4'],
              ['panel outline', 'bg --kol-surface-primary · border 1px --kol-oq-16, top none'],
              ['divider', '1px --kol-border-default, inset 12px (primary panel only)'],
            ]}
          />
        </Section>

        <Section
          title="Input"
          note="filled = button-primary chrome; outline = the one secondary treatment (ghost is a legacy alias for outline now)."
        >
          {SIZES.map((size) => (
            <Row key={size} label={size}>
              <Input variant="filled" size={size} value={text} onChange={(e) => setText(e.target.value)} />
              <Input variant="outline" size={size} value={text} onChange={(e) => setText(e.target.value)} />
              <Input variant="filled" size={size} value="Disabled" disabled onChange={() => {}} />
            </Row>
          ))}
          <Row label="adorned (md)">
            <Input variant="filled" size="md" prefix="#" value="1B2836" chars={7} onChange={() => {}} />
            <Input variant="outline" size="md" suffix="%" value="80" chars={4} onChange={() => {}} />
          </Row>
          <Spec
            classes={[
              'shell: kol-control kol-control--{filled|outline} kol-control-{sm|md|lg} kol-mono-{12|14|16}',
              'inner input: bg-transparent border-none outline-none text-auto · h-16/18/22px (pins to type line-height)',
              'adornments: prefix/suffix at text-meta · iconLeft via Icon',
            ]}
            rows={[
              ['filled', 'bg --kol-surface-secondary · text --kol-surface-on-primary'],
              ['outline', 'transparent · border 1px --kol-oq-16'],
              ['ghost (legacy)', 'aliases to outline in JSX; .kol-control--ghost CSS deprecated in place'],
              ['disabled', 'aria-disabled → opacity .5 + pointer-events none'],
            ]}
          />
        </Section>

        <Section title="Textarea" note="Same shell as Input, block form. Wraps; drags vertically — one grip, drawn to match the native look at the native spot.">
          <Row label="filled (md)">
            <Textarea variant="filled" size="md" rows={3} defaultValue="Notes on the shader pass — banding in the highlight ramp shows above 80% luminance." />
          </Row>
          <Row label="outline (md)">
            <Textarea variant="outline" size="md" rows={3} defaultValue="Notes on the shader pass — banding in the highlight ramp shows above 80% luminance." />
          </Row>
          <Spec
            classes={[
              'shell: kol-control kol-control--{filled|outline} kol-control--textarea kol-control-{size} kol-mono-{N}',
              'inner textarea: block w-full bg-transparent · resize: none (native grip unhideable in Firefox)',
              'grip: Icon resize-grip (kol-icon-set-v1/misc) in kol-textarea-resize-icon — native placement, fg-48, cursor nwse-resize; the grip IS the drag handle (JS corner drag, both axes)',
            ]}
            rows={[
              ['variants', 'same tokens as Input (filled / outline)'],
              ['resize', 'drag the grip — both axes (corner drag), min 120×40'],
            ]}
          />
        </Section>

        <Section
          title="ToggleSwitch"
          note="Bare by default — the box is gone. Shells (primary/outline) sit at exact button heights; track scales; on = inverted ink. Click them."
        >
          {SIZES.map((size) => (
            <Row key={size} label={size}>
              <ToggleSwitch variant="bare" size={size} label="Snap to grid" checked={switches.bare} onChange={setSwitch('bare')} />
              <ToggleSwitch variant="primary" size={size} label="Snap to grid" checked={switches.primary} onChange={setSwitch('primary')} />
              <ToggleSwitch variant="outline" size={size} label="Snap to grid" checked={switches.outline} onChange={setSwitch('outline')} />
            </Row>
          ))}
          <Spec
            classes={[
              'toggle-switch toggle-switch--{bare|primary|outline} toggle-switch--{sm|md|lg} kol-mono-{12|14|16}',
              'parts: toggle-switch-label · toggle-switch-indicator · state via data-state="on|off"',
              'legacy aliases: plain → bare · default → outline',
            ]}
            rows={[
              ['bare', 'padding 0 · no border · no fill (the default)'],
              ['primary shell', 'bg --kol-surface-secondary · button padding per size'],
              ['outline shell', 'border 1px --kol-oq-16 · button padding per size'],
              ['track off', 'bg --kol-oq-16 · 16×10 / 20×12 / 24×14 per size · thumb --kol-surface-primary'],
              ['track on', 'bg --kol-surface-on-primary · thumb --kol-surface-primary · translate 6/8/10px'],
              ['focus', 'outline 2px --kol-focus-ring · offset 2px'],
            ]}
          />
        </Section>

        <Section
          title="SegmentedToggle"
          note="Already law-aligned (sizes mirror Button exactly); here as the married reference."
        >
          {SIZES.map((size) => (
            <Row key={size} label={size}>
              <SegmentedToggle size={size} options={SEG_OPTIONS} value={seg} onChange={setSeg} ariaLabel="Paint mode" />
            </Row>
          ))}
          <Spec
            classes={[
              'kol-seg kol-seg--{sm|lg} (md = base) · cells: kol-seg-cell [is-active] + kol-mono-{N} via JSX',
            ]}
            rows={[
              ['frame', 'border 1px --kol-fg-04 · radius --kol-radius-sm · cell dividers --kol-fg-04'],
              ['cell rest', 'transparent · text --kol-fg-meta'],
              ['cell hover', 'text --kol-fg-emphasis (text-only)'],
              ['cell active', 'bg --kol-surface-secondary · text --kol-fg-emphasis'],
              ['cell focus', 'outline 1px --kol-fg-emphasis, inset -2px'],
            ]}
          />
        </Section>

        <Section title="Tag" note="Hover/active fills are oq-12 — opaque over anything.">
          <Row label="states">
            <Tag>Texture</Tag>
            <Tag active>Texture</Tag>
          </Row>
          <Spec
            classes={[
              'tag-control tag-{sm|md|lg} [is-active] · radius --kol-radius-full (pill)',
            ]}
            rows={[
              ['rest', 'bg --kol-surface-primary · border 1px --kol-border-default'],
              ['hover', 'bg --kol-oq-12 · border transparent'],
              ['active', 'bg --kol-oq-12 · border --kol-oq-12'],
            ]}
          />
        </Section>
      </div>
    </div>
  )
}

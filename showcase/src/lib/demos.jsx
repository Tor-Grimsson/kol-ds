import { useState } from 'react'
import {
  Button, Badge, Tag, Pill, Divider, Label, ColorSwatch,
  ToggleSwitch, ToggleCheckbox, SegmentedToggle, Slider, Input, Stepper,
  Textarea, TransparentX, ToggleBracket, ViewToggle, PropertyInput, LabeledControl,
} from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-loader'
import { ThemeToggle } from '@kolkrabbi/kol-framework'

/**
 * Curated live demos for the safe-to-render components. Each entry pairs a
 * `render` (the live preview, error-boundaried by ComponentPreview) with the
 * canonical `code` snippet shown in the Code tab — co-located so they can't
 * drift. Prop-hungry components (Table, Carousel, Modal…) are intentionally
 * absent; their mined usage reference still renders on the page.
 */

/* ── interactive demo components (need local state) ── */

function ToggleSwitchDemo() {
  const [on, setOn] = useState(true)
  return <ToggleSwitch label="Enabled" checked={on} onChange={setOn} />
}
function ToggleCheckboxDemo() {
  const [on, setOn] = useState(false)
  return <ToggleCheckbox label="Accept" checked={on} onChange={setOn} />
}
function SegmentedToggleDemo() {
  const [v, setV] = useState('grid')
  return (
    <SegmentedToggle
      value={v}
      onChange={setV}
      options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'feed', label: 'Feed' }]}
    />
  )
}
function SliderDemo() {
  const [v, setV] = useState(40)
  return <Slider label="Opacity" min={0} max={100} step={1} value={v} onChange={setV} variant="minimal" />
}
function InputDemo() {
  const [v, setV] = useState('')
  return <Input placeholder="Type…" value={v} onChange={(e) => setV(e?.target?.value ?? e)} />
}
function StepperDemo() {
  const [v, setV] = useState(2)
  return <Stepper value={v} onChange={setV} min={0} max={10} />
}
function TextareaDemo() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <Textarea variant="filled" size="sm" placeholder="filled · sm" />
      <Textarea variant="ghost" size="sm" placeholder="ghost · sm" />
      <Textarea variant="outline" size="sm" placeholder="outline · sm" />
    </div>
  )
}
function TransparentXDemo() {
  return (
    <div className="flex items-center gap-4">
      <span className="relative inline-flex border border-fg-08 rounded overflow-hidden" style={{ width: 24, height: 24 }}>
        <TransparentX />
      </span>
      <span className="relative inline-flex border border-fg-08 rounded overflow-hidden" style={{ width: 32, height: 32 }}>
        <TransparentX />
      </span>
    </div>
  )
}
function ToggleBracketDemo() {
  const [br1, setBr1] = useState(false)
  const [br2, setBr2] = useState(true)
  const [brP, setBrP] = useState(true)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ToggleBracket label="Default off" value={br1} onToggle={setBr1} />
      <ToggleBracket label="Default on" value={br2} onToggle={setBr2} />
      <ToggleBracket label="Plain variant" value={brP} onToggle={setBrP} variant="plain" />
    </div>
  )
}
function ViewToggleDemo() {
  const [view, setView] = useState('grid')
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ViewToggle viewMode={view} onViewChange={setView} />
      <ViewToggle viewMode={view} onViewChange={setView} variant="icon" />
    </div>
  )
}
function PropertyInputDemo() {
  const [x, setX] = useState(707)
  const [y, setY] = useState(499)
  return (
    <div className="grid grid-cols-2 gap-4 max-w-xs">
      <PropertyInput label="X" type="number" value={x} onChange={(e) => setX(Number(e.target.value))} step={5} />
      <PropertyInput label="Y" type="number" value={y} onChange={(e) => setY(Number(e.target.value))} step={5} />
    </div>
  )
}
function LabeledControlDemo() {
  const [n, setN] = useState(8)
  const [hex, setHex] = useState('AD5038')
  return (
    <div className="grid grid-cols-2 gap-6 max-w-md">
      <LabeledControl label={`Columns · ${n}`}>
        <Slider min={1} max={32} value={n} onChange={setN} />
      </LabeledControl>
      <LabeledControl label="Hex" hint="6-char">
        <Input prefix="#" value={hex} onChange={(e) => setHex(e.target.value)} uppercase chars={6} />
      </LabeledControl>
    </div>
  )
}
function ThemeToggleDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ThemeToggle variant="icon" />
    </div>
  )
}

/* ── registry: render + canonical code, keyed by component name ── */

export const DEMOS = {
  Button: {
    render: () => (
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="primary" iconLeft="plus">New</Button>
        <Button variant="outline" iconOnly="settings-01" />
      </div>
    ),
    code: `<div className="flex flex-wrap items-center gap-2">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="primary" iconLeft="plus">New</Button>
  <Button variant="outline" iconOnly="settings-01" />
</div>`,
  },
  Icon: {
    render: () => (
      <div className="flex flex-wrap items-center gap-3">
        {['arrow-right', 'check', 'search', 'settings-01', 'star', 'heart-1', 'rabbit'].map((n) => (
          <Icon key={n} name={n} size={18} />
        ))}
      </div>
    ),
    code: `<Icon name="arrow-right" size={18} />
<Icon name="check" size={18} />
<Icon name="settings-01" size={18} />`,
  },
  Badge: {
    render: () => (
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success">Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="critical">Error</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="outline">Draft</Badge>
      </div>
    ),
    code: `<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="critical">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="outline">Draft</Badge>`,
  },
  Tag: {
    render: () => (
      <div className="flex flex-wrap items-center gap-2">
        <Tag>design</Tag>
        <Tag>system</Tag>
        <Tag variant="solid">kol</Tag>
        <Tag hash={false}>plain</Tag>
      </div>
    ),
    code: `<Tag>design</Tag>
<Tag variant="solid">kol</Tag>
<Tag hash={false}>plain</Tag>`,
  },
  Pill: {
    render: () => (
      <div className="flex flex-wrap items-center gap-2">
        <Pill variant="outline">Outline</Pill>
        <Pill variant="subtle">Subtle</Pill>
        <Pill variant="inverse">Inverse</Pill>
      </div>
    ),
    code: `<Pill variant="outline">Outline</Pill>
<Pill variant="subtle">Subtle</Pill>
<Pill variant="inverse">Inverse</Pill>`,
  },
  Divider: {
    render: () => (
      <div className="w-full max-w-xs">
        <Divider />
      </div>
    ),
    code: `<Divider />`,
  },
  Label: {
    render: () => <Label>Field label</Label>,
    code: `<Label>Field label</Label>`,
  },
  ColorSwatch: {
    render: () => (
      <div className="flex items-center gap-2">
        {['#0a0a0a', '#3b82f6', '#22c55e', '#ef4444'].map((c) => (
          <ColorSwatch key={c} color={c} />
        ))}
      </div>
    ),
    code: `<ColorSwatch color="#3b82f6" />
<ColorSwatch color="#22c55e" />
<ColorSwatch color="#ef4444" />`,
  },
  ToggleSwitch: {
    render: ToggleSwitchDemo,
    code: `const [on, setOn] = useState(true)

<ToggleSwitch label="Enabled" checked={on} onChange={setOn} />`,
  },
  ToggleCheckbox: {
    render: ToggleCheckboxDemo,
    code: `const [on, setOn] = useState(false)

<ToggleCheckbox label="Accept" checked={on} onChange={setOn} />`,
  },
  SegmentedToggle: {
    render: SegmentedToggleDemo,
    code: `const [v, setV] = useState('grid')

<SegmentedToggle
  value={v}
  onChange={setV}
  options={[
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
    { value: 'feed', label: 'Feed' },
  ]}
/>`,
  },
  Slider: {
    render: SliderDemo,
    code: `const [v, setV] = useState(40)

<Slider label="Opacity" min={0} max={100} step={1} value={v} onChange={setV} variant="minimal" />`,
  },
  Input: {
    render: InputDemo,
    code: `const [v, setV] = useState('')

<Input placeholder="Type…" value={v} onChange={(e) => setV(e.target.value)} />`,
  },
  Stepper: {
    render: StepperDemo,
    code: `const [v, setV] = useState(2)

<Stepper value={v} onChange={setV} min={0} max={10} />`,
  },
  Textarea: {
    render: TextareaDemo,
    code: `<Textarea variant="filled" size="sm" placeholder="filled · sm" />
<Textarea variant="ghost" size="sm" placeholder="ghost · sm" />
<Textarea variant="outline" size="sm" placeholder="outline · sm" />`,
  },
  TransparentX: {
    render: TransparentXDemo,
    code: `<span className="relative inline-flex" style={{ width: 24, height: 24 }}>
  <TransparentX />
</span>`,
  },
  ToggleBracket: {
    render: ToggleBracketDemo,
    code: `const [on, setOn] = useState(true)

<ToggleBracket label="Default on" value={on} onToggle={setOn} />
<ToggleBracket label="Plain variant" value={on} onToggle={setOn} variant="plain" />`,
  },
  ViewToggle: {
    render: ViewToggleDemo,
    code: `const [view, setView] = useState('grid')

<ViewToggle viewMode={view} onViewChange={setView} />
<ViewToggle viewMode={view} onViewChange={setView} variant="icon" />`,
  },
  PropertyInput: {
    render: PropertyInputDemo,
    code: `const [x, setX] = useState(707)

<PropertyInput label="X" type="number" value={x} onChange={(e) => setX(Number(e.target.value))} step={5} />`,
  },
  LabeledControl: {
    render: LabeledControlDemo,
    code: `<LabeledControl label="Columns" hint="1–32">
  <Slider min={1} max={32} value={n} onChange={setN} />
</LabeledControl>`,
  },
  ThemeToggle: {
    render: ThemeToggleDemo,
    code: `import { ThemeToggle } from '@kolkrabbi/kol-framework'

<ThemeToggle variant="icon" />`,
  },
}

/**
 * Per-component doc data for the generic component page. Keyed by component
 * name. Main preview = DEMOS[name]; `examples` reference other demo files;
 * `api` is the props table (read from each component's real source); `usage`
 * is the snippet under Usage. A component with no entry still renders header +
 * install + usage.
 */
export const DOC_DATA = {
  Badge: {
    usage: '<Badge variant="secondary">Badge</Badge>',
    examples: [
      { id: 'variants', label: 'Variants', desc: 'Use the `variant` prop to change the badge style.', demo: 'Badge' },
      { id: 'with-icon', label: 'With Icon', desc: 'Pass an `icon` name to render a leading glyph.', demo: 'BadgeWithIcon' },
      { id: 'sizes', label: 'Sizes', desc: 'Three sizes via the `size` prop.', demo: 'BadgeSizes' },
    ],
    api: [
      { prop: 'variant', type: 'default | secondary | destructive | outline | success | warning | critical | info', def: 'default', desc: 'Visual style of the badge.' },
      { prop: 'size', type: 'sm | md | lg', def: 'md', desc: 'Badge size.' },
      { prop: 'icon', type: 'string', def: '—', desc: 'Icon name rendered before the label.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Badge content.' },
      { prop: 'className', type: 'string', def: '—', desc: 'Additional classes.' },
    ],
  },

  Button: {
    usage: '<Button variant="primary" iconLeft="plus">New</Button>',
    api: [
      { prop: 'variant', type: 'primary | secondary | accent | outline | ghost | control', def: 'primary', desc: 'Visual style.' },
      { prop: 'size', type: 'sm | md | lg', def: 'md', desc: 'Button size.' },
      { prop: 'iconLeft / iconRight', type: 'string', def: '—', desc: 'Icon name on a given side.' },
      { prop: 'iconOnly', type: 'string', def: '—', desc: 'Renders an icon-only button.' },
      { prop: 'href', type: 'string', def: '—', desc: 'Renders an `<a>` instead of a button.' },
      { prop: 'onClick', type: 'function', def: '—', desc: 'Click handler (renders a `<button>`).' },
      { prop: 'disabled', type: 'boolean', def: 'false', desc: 'Disabled state.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Button label.' },
    ],
  },

  Slider: {
    usage: '<Slider label="Opacity" min={0} max={100} value={v} onChange={setV} />',
    api: [
      { prop: 'value', type: 'number', def: '—', desc: 'Current value (controlled).' },
      { prop: 'onChange', type: '(n) => void', def: '—', desc: 'Fires with the new value.' },
      { prop: 'min / max', type: 'number', def: '0 / 100', desc: 'Range bounds.' },
      { prop: 'step', type: 'number', def: '1', desc: 'Step increment.' },
      { prop: 'label', type: 'string', def: '—', desc: 'Inline label — part of the slider\'s single-row anatomy (label · track · editable readout). For a stacked label around a label-less control, use `LabeledControl`.' },
      { prop: 'variant', type: 'default | minimal | subtle', def: 'default', desc: 'Visual style — bordered track, bare track, or filled chip.' },
    ],
  },

  Icon: {
    usage: '<Icon name="arrow-up" size={16} />',
    api: [
      { prop: 'name', type: 'string', def: '—', desc: 'Icon name (see the Icons page).' },
      { prop: 'size', type: 'number | string', def: '16', desc: 'Icon size in pixels.' },
      { prop: 'variant', type: 'stroke | solid', def: 'stroke', desc: 'Icon cut.' },
      { prop: 'className', type: 'string', def: '—', desc: 'Additional classes.' },
    ],
  },

  Tag: {
    usage: '<Tag solid>kol</Tag>',
    api: [
      { prop: 'children / text', type: 'ReactNode / string', def: '—', desc: 'Tag label.' },
      { prop: 'solid', type: 'boolean', def: 'false', desc: 'Solid fill style.' },
      { prop: 'active', type: 'boolean', def: 'false', desc: 'Active/selected state.' },
      { prop: 'hash', type: 'boolean', def: 'true', desc: 'Prefix with `#`.' },
      { prop: 'size', type: 'sm | md | lg', def: 'md', desc: 'Tag size.' },
      { prop: 'icon', type: 'string', def: '—', desc: 'Leading icon name.' },
      { prop: 'onRemove', type: 'function', def: '—', desc: 'Shows a remove affordance.' },
    ],
  },

  Pill: {
    usage: '<Pill variant="subtle">Subtle</Pill>',
    api: [
      { prop: 'variant', type: 'outline | subtle | inverse', def: 'outline', desc: 'Visual style.' },
      { prop: 'size', type: 'sm | md | lg', def: 'md', desc: 'Pill size.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Pill content.' },
    ],
  },

  Divider: {
    usage: '<Divider />',
    api: [
      { prop: 'variant', type: 'horizontal | vertical', def: 'horizontal', desc: 'Orientation.' },
      { prop: 'opacity', type: 'string', def: '08', desc: 'Line opacity (fg-* stop).' },
      { prop: 'inverse', type: 'boolean', def: 'false', desc: 'Use inverse foreground.' },
    ],
  },

  Label: {
    usage: '<Label htmlFor="email">Email</Label>',
    api: [
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Label text.' },
      { prop: 'htmlFor', type: 'string', def: '—', desc: 'Associated input id.' },
    ],
  },

  ColorSwatch: {
    usage: '<ColorSwatch hex="#3b82f6" />',
    api: [
      { prop: 'hex', type: 'string', def: '—', desc: 'Swatch colour.' },
      { prop: 'size', type: 'number', def: '24', desc: 'Chip size in pixels.' },
      { prop: 'selected', type: 'boolean', def: 'false', desc: 'Selected state.' },
      { prop: 'frame', type: 'boolean', def: 'true', desc: 'Draw a border frame.' },
      { prop: 'radius', type: 'tight | …', def: 'tight', desc: 'Corner radius token.' },
      { prop: 'showTransparent', type: 'boolean', def: 'false', desc: 'Render the transparency marker.' },
      { prop: 'onClick', type: 'function', def: '—', desc: 'Click handler.' },
    ],
  },

  ToggleSwitch: {
    usage: '<ToggleSwitch label="Enabled" checked={on} onChange={setOn} />',
    api: [
      { prop: 'checked', type: 'boolean', def: 'false', desc: 'On/off state (controlled).' },
      { prop: 'onChange', type: '(bool) => void', def: '—', desc: 'Fires with the next state.' },
      { prop: 'label', type: 'string', def: '—', desc: 'Field label.' },
      { prop: 'hint', type: 'string', def: '—', desc: 'Secondary hint text.' },
      { prop: 'variant', type: 'default | …', def: 'default', desc: 'Visual style.' },
    ],
  },

  ToggleCheckbox: {
    usage: '<ToggleCheckbox label="Accept" checked={on} onChange={setOn} />',
    api: [
      { prop: 'checked', type: 'boolean', def: 'false', desc: 'Checked state (controlled).' },
      { prop: 'onChange', type: '(bool) => void', def: '—', desc: 'Fires with the next state.' },
      { prop: 'label', type: 'string', def: '—', desc: 'Field label.' },
      { prop: 'hint', type: 'string', def: '—', desc: 'Secondary hint text.' },
    ],
  },

  SegmentedToggle: {
    usage: '<SegmentedToggle value={v} onChange={setV} options={[{ value: "grid", label: "Grid" }]} />',
    api: [
      { prop: 'value', type: 'string', def: '—', desc: 'Selected option value.' },
      { prop: 'onChange', type: '(value) => void', def: '—', desc: 'Fires with the chosen value.' },
      { prop: 'options', type: '{ value, label }[]', def: '[]', desc: 'Segments to render.' },
      { prop: 'size', type: 'sm | md | lg', def: 'md', desc: 'Control size.' },
    ],
  },

  Input: {
    usage: '<Input placeholder="Type…" value={v} onChange={(e) => setV(e.target.value)} />',
    api: [
      { prop: 'value', type: 'string', def: '—', desc: 'Field value (controlled).' },
      { prop: 'onChange', type: '(event) => void', def: '—', desc: 'Change handler.' },
      { prop: 'variant', type: 'filled | ghost | outline', def: 'filled', desc: 'Visual style.' },
      { prop: 'size', type: 'sm | md | lg', def: 'md', desc: 'Field size.' },
      { prop: 'prefix / suffix', type: 'ReactNode', def: '—', desc: 'Adornments inside the field.' },
      { prop: 'iconLeft', type: 'string', def: '—', desc: 'Leading icon name.' },
      { prop: 'uppercase', type: 'boolean', def: 'false', desc: 'Force uppercase input.' },
    ],
  },

  Stepper: {
    usage: '<Stepper value={v} onChange={setV} min={0} max={10} />',
    api: [
      { prop: 'value', type: 'number', def: '—', desc: 'Current value (controlled).' },
      { prop: 'onChange', type: '(n) => void', def: '—', desc: 'Fires with the new value.' },
      { prop: 'min / max', type: 'number', def: '—', desc: 'Bounds.' },
      { prop: 'step', type: 'number', def: '1', desc: 'Increment.' },
      { prop: 'size', type: 'sm | md | lg', def: 'sm', desc: 'Control size.' },
    ],
  },

  Textarea: {
    usage: '<Textarea variant="filled" placeholder="Notes…" />',
    api: [
      { prop: 'value', type: 'string', def: '—', desc: 'Field value (controlled).' },
      { prop: 'onChange', type: '(event) => void', def: '—', desc: 'Change handler.' },
      { prop: 'variant', type: 'filled | ghost | outline', def: 'filled', desc: 'Visual style.' },
      { prop: 'size', type: 'sm | md | lg', def: 'md', desc: 'Field size.' },
      { prop: 'rows', type: 'number', def: '3', desc: 'Visible rows.' },
    ],
  },

  TransparentX: {
    usage: '<TransparentX />',
    api: [
      { prop: 'tone', type: 'string', def: 'warning', desc: 'Colour tone of the marker.' },
      { prop: 'className', type: 'string', def: '—', desc: 'Additional classes.' },
    ],
  },

  ToggleBracket: {
    usage: '<ToggleBracket label="Snap" value={on} onToggle={setOn} />',
    api: [
      { prop: 'value', type: 'boolean', def: 'false', desc: 'On/off state (controlled).' },
      { prop: 'onToggle', type: '(bool) => void', def: '—', desc: 'Fires with the next state.' },
      { prop: 'label', type: 'string', def: '—', desc: 'Bracket label.' },
      { prop: 'onLabel / offLabel', type: 'string', def: 'ON / OFF', desc: 'State text.' },
      { prop: 'variant', type: 'default | plain', def: 'default', desc: 'Visual style.' },
    ],
  },

  ViewToggle: {
    usage: '<ViewToggle viewMode={view} onViewChange={setView} />',
    api: [
      { prop: 'viewMode', type: 'string', def: '—', desc: 'Active view value.' },
      { prop: 'onViewChange', type: '(value) => void', def: '—', desc: 'Fires with the chosen view.' },
      { prop: 'variant', type: 'text | icon', def: 'text', desc: 'Label or icon rendering.' },
      { prop: 'options', type: '{ value, label, icon }[]', def: 'grid / list', desc: 'Views to offer.' },
    ],
  },

  PropertyInput: {
    usage: '<PropertyInput label="X" type="number" value={x} onChange={(e) => setX(+e.target.value)} />',
    api: [
      { prop: 'label', type: 'string', def: '—', desc: 'Field label.' },
      { prop: 'value', type: 'string | number', def: '—', desc: 'Field value (controlled).' },
      { prop: 'onChange', type: '(event) => void', def: '—', desc: 'Change handler.' },
      { prop: 'type', type: 'text | number', def: 'text', desc: 'Input type.' },
      { prop: 'min / max / step', type: 'number', def: '—', desc: 'Numeric bounds + increment.' },
    ],
  },

  LabeledControl: {
    usage: '<LabeledControl label="Columns"><Slider min={1} max={32} value={n} onChange={setN} /></LabeledControl>',
    api: [
      { prop: 'label', type: 'string', def: '—', desc: 'Control label.' },
      { prop: 'hint', type: 'string', def: '—', desc: 'Secondary hint text.' },
      { prop: 'inline', type: 'boolean', def: 'false', desc: 'Lay out label + control on one row.' },
      { prop: 'labelWidth', type: 'number', def: '48', desc: 'Label column width (inline).' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'The wrapped control.' },
    ],
  },

  ThemeToggle: {
    usage: '<ThemeToggle variant="icon" />',
    api: [
      { prop: 'variant', type: 'icon | …', def: '—', desc: 'Rendering style. From @kolkrabbi/kol-framework.' },
    ],
  },

  Avatar: {
    usage: '<Avatar initial="TG" size="md" />',
    api: [
      { prop: 'initial', type: 'ReactNode', def: '—', desc: 'Initials/letter shown inside the circle.' },
      { prop: 'size', type: 'sm | md | lg | xl', def: 'sm', desc: 'Diameter preset (32/40/56/96px).' },
      { prop: 'className', type: 'string', def: '—', desc: 'Extra classes.' },
    ],
  },

  Section: {
    usage: '<Section label="Aspect">…</Section>',
    api: [
      { prop: 'label', type: 'string', def: '—', desc: 'Small-caps heading above the stack.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Vertically stacked content.' },
      { prop: 'className', type: 'string', def: '—', desc: 'Extra classes.' },
    ],
  },

  SectionLabel: {
    usage: '<SectionLabel text="Featured work" />',
    api: [
      { prop: 'text', type: 'string', def: '—', desc: 'Label text before the arrow icon.' },
      { prop: 'size', type: 'sm | md | lg', def: 'md', desc: 'Row height + type (16/20/32px).' },
      { prop: 'className', type: 'string', def: '—', desc: 'Extra classes.' },
    ],
  },

  QuantityInput: {
    usage: '<QuantityInput value={qty} onChange={setQty} min={1} max={20} />',
    api: [
      { prop: 'value', type: 'number', def: '1', desc: 'Current quantity (controlled).' },
      { prop: 'onChange', type: '(n) => void', def: '—', desc: 'Fires with the new value.' },
      { prop: 'min / max', type: 'number', def: '1 / 99', desc: 'Bounds; buttons disable at edges.' },
      { prop: 'size', type: 'sm | md | lg', def: 'responsive', desc: 'Overrides the viewport-based preset.' },
    ],
  },

  QuantityStepper: {
    usage: '<QuantityStepper value={qty} onChange={setQty} min={1} max={10} />',
    api: [
      { prop: 'value', type: 'number', def: '1', desc: 'Current quantity (controlled).' },
      { prop: 'onChange', type: '(n) => void', def: '—', desc: 'Fires when − / + is pressed.' },
      { prop: 'min / max', type: 'number', def: '1 / 10', desc: 'Bounds; buttons disable at edges.' },
      { prop: 'size', type: 'sm | md | lg', def: 'responsive', desc: 'Overrides the viewport-based preset.' },
    ],
  },

  CodeBlock: {
    usage: '<CodeBlock language="jsx">{code}</CodeBlock>',
    api: [
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Code content (stringified for copy).' },
      { prop: 'language', type: 'string', def: '—', desc: 'Language tag shown in the corner.' },
    ],
  },

  Accordion: {
    usage: '<Accordion><AccordionPanel title="Section">…</AccordionPanel></Accordion>',
    api: [
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'AccordionPanel elements to group.' },
      { prop: 'className', type: 'string', def: '—', desc: 'Extra classes.' },
    ],
  },

  AccordionPanel: {
    usage: '<AccordionPanel title="Section" defaultOpen>…</AccordionPanel>',
    api: [
      { prop: 'title', type: 'ReactNode', def: '—', desc: 'Trigger label.' },
      { prop: 'meta', type: 'ReactNode', def: '—', desc: 'Right-aligned meta label in the trigger.' },
      { prop: 'defaultOpen', type: 'boolean', def: 'false', desc: 'Initial open state (uncontrolled).' },
      { prop: 'open', type: 'boolean', def: '—', desc: 'Controlled open state.' },
      { prop: 'onToggle', type: '(bool) => void', def: '—', desc: 'Fires with the next state (controlled).' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Body, rendered when open.' },
    ],
  },

  AssetPlaceholder: {
    usage: '<AssetPlaceholder category="hero" name="cover" />',
    api: [
      { prop: 'category', type: 'string', def: '—', desc: 'Category shown in the label.' },
      { prop: 'name', type: 'string', def: '—', desc: 'Name shown in the label.' },
      { prop: 'aspectRatio', type: 'string', def: '16 / 9', desc: 'CSS aspect-ratio of the frame.' },
      { prop: 'note', type: 'string', def: 'missing', desc: 'Status note text.' },
    ],
  },

  Image: {
    usage: '<Image src="/img.jpg" alt="Cover" aspectRatio="16 / 9" />',
    api: [
      { prop: 'src', type: 'string', def: '—', desc: 'Image URL; falls back to a placeholder on error.' },
      { prop: 'alt', type: 'string', def: '—', desc: 'Alt text.' },
      { prop: 'category / name', type: 'string', def: '—', desc: 'Labels for the fallback placeholder.' },
      { prop: 'aspectRatio', type: 'string', def: '—', desc: 'CSS aspect-ratio.' },
      { prop: 'loading', type: 'lazy | eager', def: 'lazy', desc: 'Native loading strategy.' },
    ],
  },

  Carousel: {
    usage: '<Carousel><div>Slide 1</div><div>Slide 2</div></Carousel>',
    api: [
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Each child becomes one slide.' },
      { prop: 'options', type: 'EmblaOptionsType', def: '{ align: "start", loop: false }', desc: 'Embla carousel options.' },
      { prop: 'className', type: 'string', def: '—', desc: 'Extra classes on the root.' },
    ],
  },

  Dropdown: {
    usage: '<Dropdown options={opts} value={v} onChange={setV} />',
    api: [
      { prop: 'options', type: '{ value, label }[]', def: '[]', desc: 'Selectable entries.' },
      { prop: 'value', type: 'string', def: '—', desc: 'Selected value (defaults to first).' },
      { prop: 'onChange', type: '(value) => void', def: '—', desc: 'Fires with the chosen value.' },
      { prop: 'variant', type: 'default | minimal | subtle', def: 'default', desc: 'Chrome + width preset.' },
      { prop: 'size', type: 'sm | md | lg', def: 'auto', desc: 'Overrides the viewport-derived size.' },
    ],
  },

  DropdownTagFilter: {
    usage: '<DropdownTagFilter options={opts} selectedValues={set} onChange={toggle} />',
    api: [
      { prop: 'options', type: '{ value, label }[]', def: '[]', desc: 'Filterable entries.' },
      { prop: 'selectedValues', type: 'Set', def: 'new Set()', desc: 'Active values (all selected by default).' },
      { prop: 'onChange', type: '(value | null) => void', def: '—', desc: 'Value to toggle, or null to deselect all.' },
      { prop: 'size', type: 'sm | md | lg', def: 'auto', desc: 'Overrides the viewport-derived size.' },
    ],
  },

  Tooltip: {
    usage: '<Tooltip label="Copy"><button>copy</button></Tooltip>',
    api: [
      { prop: 'label', type: 'ReactNode', def: '—', desc: 'Tooltip content.' },
      { prop: 'shortcut', type: 'ReactNode', def: '—', desc: 'Trailing shortcut badge.' },
      { prop: 'placement', type: 'top | bottom | left | right', def: 'bottom', desc: 'Floating-UI placement.' },
      { prop: 'offset', type: 'number', def: '6', desc: 'Gap between trigger and tooltip.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'The trigger element.' },
    ],
  },

  MenuItem: {
    usage: '<MenuItem label="File"><MenuDropdownItem>New</MenuDropdownItem></MenuItem>',
    api: [
      { prop: 'label', type: 'string', def: '—', desc: 'Trigger button text.' },
      { prop: 'children', type: 'ReactNode | ({ close }) => ReactNode', def: '—', desc: 'Panel contents; render-prop gets close().' },
      { prop: 'align', type: 'start | end', def: 'start', desc: 'Panel edge alignment.' },
      { prop: 'panelClassName', type: 'string', def: '—', desc: 'Classes on the popover panel.' },
      { prop: 'buttonClassName', type: 'string', def: '—', desc: 'Classes on the trigger button.' },
    ],
  },

  MenuPopover: {
    usage: '<MenuPopover label="Actions"><MenuDropdownItem>Edit</MenuDropdownItem></MenuPopover>',
    api: [
      { prop: 'label', type: 'string', def: '—', desc: 'Trigger button text.' },
      { prop: 'children', type: 'ReactNode | ({ close }) => ReactNode', def: '—', desc: 'Menu rows; render-prop gets close().' },
      { prop: 'align', type: 'start | end', def: 'start', desc: 'Anchor to the trigger left or right edge.' },
      { prop: 'panelClassName', type: 'string', def: '—', desc: 'Sizing/spacing classes on the panel.' },
    ],
  },

  MenuDropdownItem: {
    usage: '<MenuDropdownItem onClick={fn}>Save</MenuDropdownItem>',
    api: [
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Main label (truncates).' },
      { prop: 'onClick', type: '() => void', def: '—', desc: 'Fires before the menu closes.' },
      { prop: 'iconLeft', type: 'ReactNode', def: '—', desc: 'Leading icon in a fixed column.' },
      { prop: 'shortcut', type: 'ReactNode', def: '—', desc: 'Trailing shortcut / marker.' },
      { prop: 'disabled', type: 'boolean', def: 'false', desc: 'Dims and blocks activation.' },
    ],
  },

  MenuDropdownDivider: {
    usage: '<MenuDropdownDivider />',
    api: [],
  },

  MenuDropdownNest: {
    usage: '<MenuDropdownNest label="Export"><MenuDropdownItem>PNG</MenuDropdownItem></MenuDropdownNest>',
    api: [
      { prop: 'label', type: 'string', def: '—', desc: 'Row label.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Rows revealed when expanded.' },
      { prop: 'iconLeft', type: 'ReactNode', def: '—', desc: 'Leading icon in a fixed column.' },
    ],
  },

  Table: {
    usage: '<Table columns={columns} rows={rows} />',
    api: [
      { prop: 'columns', type: 'array', def: '—', desc: 'Column configs: { accessor, header, render?, className? }.' },
      { prop: 'rows', type: 'array', def: '—', desc: 'Row objects; cell read via column.accessor unless render is given.' },
      { prop: 'variant', type: 'default | simple', def: 'default', desc: 'Bordered vs borderless/flush.' },
      { prop: 'caption', type: 'string', def: '—', desc: 'Screen-reader caption.' },
    ],
  },

  Graphic: {
    usage: '<Graphic category="patterns" name="patt-05" />',
    api: [
      { prop: 'category', type: 'string', def: '—', desc: 'abstract | diagrams | patterns | social | structure.' },
      { prop: 'name', type: 'string', def: '—', desc: 'Filename without extension, e.g. patt-05.' },
      { prop: 'title', type: 'string', def: '—', desc: 'Accessible label (adds role="img").' },
      { prop: 'aspectRatio', type: 'string', def: '1 / 1', desc: 'Placeholder aspect when the asset is missing.' },
    ],
  },

  ContentFilters: {
    usage: '<ContentFilters items={items} title="Shop" totalCount={items.length} filterGroups={groups} renderItem={renderItem} />',
    api: [
      { prop: 'items', type: 'array', def: '—', desc: 'Full item set; filtered internally.' },
      { prop: 'renderItem', type: 'function', def: '—', desc: '(filteredItems, viewMode, layout) => ReactNode.' },
      { prop: 'filterGroups', type: 'array', def: '[]', desc: '[{ label, key, values }] → toggleable tags.' },
      { prop: 'title', type: 'string', def: '—', desc: 'Section heading.' },
      { prop: 'totalCount', type: 'number', def: '—', desc: 'Total-before-filtering count.' },
      { prop: 'searchKeys', type: 'array', def: "['label','name',…]", desc: 'Fields matched by the search input.' },
      { prop: 'viewModeOptions', type: 'array', def: '—', desc: 'Optional grid/list view toggles.' },
    ],
  },

  /* ── Framework ─────────────────────────────────────────── */

  BrandHero: {
    usage: '<BrandHero label="Kolkrabbi" title="Brand portal" lede="…" />',
    api: [
      { prop: 'label', type: 'string', def: '—', desc: 'Small eyebrow above the title.' },
      { prop: 'title', type: 'ReactNode', def: '—', desc: 'Display headline.' },
      { prop: 'lede', type: 'string', def: '—', desc: 'Intro paragraph under the title.' },
      { prop: 'mark', type: 'ReactNode', def: '—', desc: 'Optional logo mark beside the title.' },
      { prop: 'id', type: 'string', def: 'hero', desc: 'Section anchor id.' },
    ],
  },

  SubPageHero: {
    usage: '<SubPageHero backTo="/" backLabel="← Back" label="Reference" title="Icons" lede="…" />',
    api: [
      { prop: 'title', type: 'ReactNode', def: '—', desc: 'Display headline.' },
      { prop: 'lede', type: 'string', def: '—', desc: 'Intro paragraph.' },
      { prop: 'label', type: 'string', def: '—', desc: 'Eyebrow above the title.' },
      { prop: 'backTo', type: 'string', def: '—', desc: 'Route for the back link (renders when set).' },
      { prop: 'backLabel', type: 'string', def: '—', desc: 'Back-link text.' },
    ],
  },

  PageSection: {
    usage: '<PageSection label="01 — Colour" title="Surfaces" body="…">…</PageSection>',
    api: [
      { prop: 'label', type: 'string', def: '—', desc: 'Numbered mono eyebrow.' },
      { prop: 'title', type: 'string', def: '—', desc: 'Section h2.' },
      { prop: 'body', type: 'string', def: '—', desc: 'Lede paragraph under the title.' },
      { prop: 'id', type: 'string', def: '—', desc: 'Anchor id for scroll-spy / TOC.' },
      { prop: 'fullbleed', type: 'boolean', def: 'false', desc: 'Edge-to-edge canvas mode — zero horizontal padding. Not for content.' },
      { prop: 'divider', type: 'boolean', def: 'false', desc: 'Rule above the section.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Section content.' },
    ],
  },

  PortalFooter: {
    usage: '<PortalFooter brand={<Wordmark />} columns={columns} socials={socials} note="© 2026 Kolkrabbi" />',
    api: [
      { prop: 'brand', type: 'ReactNode', def: '—', desc: 'Brand block slot; zero-prop default keeps the favicon mark.' },
      { prop: 'columns', type: 'array', def: '—', desc: 'Link columns: { title, links: [{ label, href }] }. Plain anchors, router-agnostic.' },
      { prop: 'socials', type: 'array', def: '—', desc: 'Bottom-bar links: { label, href, icon? }; label renders when no icon.' },
      { prop: 'note', type: 'ReactNode', def: '—', desc: 'Bottom-bar legal/credit line.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Escape hatch between columns and the bottom bar.' },
    ],
  },

  AppShell: {
    usage: '<Route element={<AppShell navTree={NAV_TREE} getActivePage={getActivePage} />}>…</Route>',
    api: [
      { prop: 'navTree', type: 'array', def: '[]', desc: 'Nav tree consumed by SideNav (groups + route/anchor leaves).' },
      { prop: 'getActivePage', type: '(pathname) => node', def: '—', desc: 'Resolves the active top-level page.' },
      { prop: 'header / footer', type: 'ReactNode', def: '—', desc: 'Optional chrome above/below the outlet in the content column; mount consumer search/topbar in header.' },
      { prop: 'defaultTocContent', type: 'ReactNode', def: '—', desc: 'Right-rail content when the active page registers none via ShellTocContext.' },
    ],
  },

  SideNav: {
    usage: '<SideNav navTree={NAV_TREE} getActivePage={getActivePage} />',
    api: [
      { prop: 'navTree', type: 'array', def: '[]', desc: 'Groups + leaves ({ to } routes, { id } anchors).' },
      { prop: 'getActivePage', type: 'function', def: '—', desc: 'Active-page resolver for highlight + scroll-spy.' },
      { prop: 'drawerOpen', type: 'boolean', def: '—', desc: 'Mobile drawer state (managed by AppShell).' },
      { prop: 'onCloseDrawer', type: 'function', def: '—', desc: 'Close callback for the mobile drawer.' },
      { prop: 'onNavigate', type: '(event) => void', def: '—', desc: 'Fired when any nav link is clicked (drawer close, analytics).' },
      { prop: 'collapsed / onToggle', type: 'boolean / function', def: '—', desc: 'Controlled rail collapse; presence switches to controlled mode.' },
      { prop: 'collapsibleSections', type: 'boolean', def: 'false', desc: 'Per-page section expand/collapse with chevron + child count; active section auto-expands.' },
      { prop: 'isActive', type: '(path) => boolean', def: '—', desc: 'Overrides router active detection for hops and route leaves.' },
    ],
  },

  Layout: {
    usage: '<Route element={<Layout />}>…</Route>',
    api: [],
  },

  ScrollToTop: {
    usage: '<ScrollToTop />',
    api: [],
  },

  EmptyState: {
    usage: '<EmptyState eyebrow="Phase 2" title="Layer inspector" body="Select a layer to edit its properties." />',
    api: [
      { prop: 'eyebrow', type: 'string', def: '—', desc: 'Kicker line above the title (rendered as authored — no auto casing).' },
      { prop: 'title', type: 'string', def: '—', desc: 'Headline.' },
      { prop: 'body', type: 'string', def: '—', desc: 'Optional supporting line.' },
      { prop: 'footer', type: 'string', def: '—', desc: 'Optional note above a top hairline.' },
    ],
  },

  OverlayGlassPanel: {
    usage: '<OverlayGlassPanel maxWidth="max-w-[420px]">…</OverlayGlassPanel>',
    api: [
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'The content stack (eyebrow/title/description/CTA).' },
      { prop: 'surfaceOpacity', type: 'number', def: '80', desc: '% of surface-primary in the color-mix — panel translucency.' },
      { prop: 'blur', type: 'string', def: "'1px'", desc: 'backdrop-filter blur radius.' },
      { prop: 'align', type: 'center | start | end', def: 'center', desc: 'Cross-axis alignment + text alignment.' },
      { prop: 'gap', type: 'string', def: "'gap-6'", desc: 'Vertical rhythm class between children.' },
      { prop: 'maxWidth', type: 'string', def: '—', desc: 'Optional max-w-* class; adds mx-auto.' },
      { prop: 'className', type: 'string', def: '—', desc: 'Extra wrapper classes / padding override.' },
    ],
  },

  Figure: {
    usage: '<Figure label="Fig. 01" caption="…" aspect="5/3"><img … /></Figure>',
    api: [
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Media inside the aspect-locked frame.' },
      { prop: 'label', type: 'string', def: '—', desc: 'Small mono label above the frame.' },
      { prop: 'caption', type: 'string', def: '—', desc: 'figcaption below the frame.' },
      { prop: 'aspect', type: 'string', def: "'5/3'", desc: "CSS aspect-ratio value; '' for natural height." },
      { prop: 'className', type: 'string', def: '—', desc: 'Extra classes on the figure.' },
    ],
  },

  MediaViewer: {
    usage: '<MediaViewer open={open} media={media} onClose={() => setOpen(false)} />',
    api: [
      { prop: 'open', type: 'boolean', def: '—', desc: 'Viewer visible.' },
      { prop: 'media', type: 'array', def: '[]', desc: "Items: { url, alt?, kind: 'image' | 'video' }." },
      { prop: 'initialIndex', type: 'number', def: '0', desc: 'Item shown on open.' },
      { prop: 'onClose', type: 'function', def: '—', desc: 'Close request (Esc, backdrop, close button).' },
      { prop: 'onIndexChange', type: 'function', def: '—', desc: 'Fires with the new index on page.' },
    ],
  },

  AssetGrid: {
    usage: '<AssetGrid cols={4} gap="gap-2">{figures}</AssetGrid>',
    api: [
      { prop: 'cols', type: '2 | 3 | 4', def: '3', desc: 'Column count at full width; unknown values fall back to 3.' },
      { prop: 'gap', type: 'string', def: "'gap-4'", desc: 'Tailwind gap utility applied to both axes.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Grid items.' },
      { prop: 'className', type: 'string', def: '—', desc: 'Extra classes.' },
    ],
  },

  CurveOverlay: {
    usage: '<CurveOverlay width={320} height={120} curve="ease" blend={0.5} />',
    api: [
      { prop: 'width / height', type: 'number', def: '—', desc: 'Frame px size — viewBox scale; y is inverted (value 0 at bottom).' },
      { prop: 'curve', type: 'string', def: "'linear'", desc: "'custom' → bezier editor; else preset: flat | linear | reverse | ease | expo-in | expo-out | log | sine." },
      { prop: 'blend', type: 'number 0..1', def: '0.5', desc: 'Curve amount / up-down bias.' },
      { prop: 'cp1 / cp2', type: '{ x, y } 0..1', def: '—', desc: 'Normalized control points (required in custom mode).' },
      { prop: 'easing', type: '(t) => v', def: '—', desc: 'Custom sampler replacing presets (48 samples, clamped).' },
    ],
  },

  DocsToc: {
    usage: "<DocsToc toc={[{ id: 'overview', label: 'Overview' }]} />",
    api: [
      { prop: 'toc', type: '{ id, label }[]', def: '—', desc: 'Headings to render and observe — a matching in-page element must exist per id.' },
      { prop: 'onNavigate', type: '(event) => void', def: '—', desc: 'Optional click handler on every link.' },
      { prop: 'rootMargin', type: 'string', def: "'-80px 0px -80% 0px'", desc: 'IntersectionObserver band passed to useScrollSpy.' },
    ],
  },

  HlsVideo: {
    usage: '<HlsVideo src="https://cdn…/master.m3u8" className="absolute inset-0 h-full w-full object-cover" />',
    api: [
      { prop: 'src', type: 'string', def: '—', desc: 'HLS manifest URL (.m3u8); attach effect re-runs on change.' },
      { prop: 'poster', type: 'string', def: '—', desc: 'Poster frame before playback.' },
      { prop: 'onEnded', type: 'function', def: '—', desc: 'End-of-playback callback; its presence disables loop.' },
      { prop: 'className / …props', type: '—', def: '—', desc: 'Layout is consumer-supplied; extra props spread onto <video>.' },
    ],
  },

  PriceDisplay: {
    usage: '<PriceDisplay amount={220} currency="EUR" secondary="(€180 + €40 shipping)" />',
    api: [
      { prop: 'amount', type: 'number', def: '—', desc: 'Primary price (whole units, maximumFractionDigits 0).' },
      { prop: 'currency', type: 'string', def: "'EUR'", desc: 'ISO 4217 code — honored (the app source ignored it).' },
      { prop: 'locale', type: 'string', def: "'de-DE'", desc: 'Intl.NumberFormat locale.' },
      { prop: 'secondary', type: 'ReactNode', def: '—', desc: 'Muted trailing note on the same baseline.' },
    ],
  },

  ProsePreview: {
    usage: "<ProsePreview h1='Page title' paragraph='…' code='const x = 1' pullout='…' />",
    api: [
      { prop: 'h1', type: 'string', def: '—', desc: 'Trailing text of the H1 line.' },
      { prop: 'paragraph', type: 'string', def: '—', desc: 'Body paragraph text.' },
      { prop: 'code', type: 'string', def: '—', desc: 'Contents of the code block.' },
      { prop: 'pullout', type: 'string', def: '—', desc: 'Trailing text of the pullout.' },
      { prop: 'quote', type: 'string', def: '—', desc: 'Blockquote text.' },
    ],
  },

  RotaryDial: {
    usage: '<RotaryDial label="Drive" value={v} onChange={setV} min={0} max={100} />',
    api: [
      { prop: 'value', type: 'number', def: '0', desc: 'Controlled value; drives rotation and readout.' },
      { prop: 'onChange', type: '(n) => void', def: '—', desc: 'RAF-throttled while dragging; immediate on arrow keys.' },
      { prop: 'min / max / step', type: 'number', def: '0 / 100 / 1', desc: 'Range and increment.' },
      { prop: 'label', type: 'string', def: '—', desc: 'Label + % readout rows; omit for a bare knob.' },
      { prop: 'size', type: 'number', def: '80', desc: 'Dial px size.' },
    ],
  },

  TypeSample: {
    usage: '<TypeSample label="Sans · 700 · 48/52" weight={700} size={48} lineHeight={52}>Hamburgefonstiv</TypeSample>',
    api: [
      { prop: 'family', type: 'string', def: '—', desc: 'Font family; unset falls back to var(--kol-font-family-sans).' },
      { prop: 'weight', type: 'number', def: '400', desc: 'font-weight.' },
      { prop: 'italic', type: 'boolean', def: 'false', desc: 'Italic sample.' },
      { prop: 'size / lineHeight', type: 'number', def: '32 / —', desc: 'px values; unitless 1.2 line-height when unset.' },
      { prop: 'label', type: 'string', def: '—', desc: 'Mono caption above the sample.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'The specimen text.' },
    ],
  },

  TypeSpecCard: {
    usage: "<TypeSpecCard label='Heading 01' meta={[['Family', 'Sans'], ['Size', '48px']]}><TypeSample … /></TypeSpecCard>",
    api: [
      { prop: 'label', type: 'string', def: '—', desc: 'Corner caption, absolute top-left.' },
      { prop: 'meta', type: '[key, value][]', def: '[]', desc: 'Key/value metric rows.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'The live sample (often a TypeSample).' },
    ],
  },

  ShapeDropdown: {
    usage: '<ShapeDropdown options={opts} value={v} onChange={setV} onAction={draw} />',
    api: [
      { prop: 'options', type: '{ id, label, icon? }[]', def: '[]', desc: 'Variants — menu rows + trigger glyph.' },
      { prop: 'value', type: 'string', def: '—', desc: 'Active variant id (controlled).' },
      { prop: 'onChange', type: '(id) => void', def: '—', desc: 'Fires with the picked variant id.' },
      { prop: 'onAction', type: '(id) => void', def: '—', desc: 'Fires with the current id on main-button click.' },
    ],
  },

  SpecList: {
    usage: "<SpecList items={[{ label: 'Edition', value: 'Limited (30)' }]} framed />",
    api: [
      { prop: 'items', type: '{ label, value }[]', def: '[]', desc: 'Rows; value may be a node — caller formats.' },
      { prop: 'framed', type: 'boolean', def: 'false', desc: 'Leading + trailing Divider frame.' },
    ],
  },

  TabsRow: {
    usage: "<TabsRow tabs={[{ id: 'overview', label: 'Overview' }]} value={v} onChange={setV} />",
    api: [
      { prop: 'tabs', type: '{ id, label }[]', def: '[]', desc: 'Tab items; labels render verbatim.' },
      { prop: 'value', type: 'string', def: '—', desc: 'Active tab id (controlled).' },
      { prop: 'onChange', type: '(id) => void', def: '—', desc: 'Fires on click or arrow-key move.' },
      { prop: 'onClose / onMinimise', type: 'function', def: '—', desc: 'Show + wire the leading close / trailing chevron.' },
    ],
  },

  ErrorBoundary: {
    usage: '<ErrorBoundary homeHref="/"><App /></ErrorBoundary>',
    api: [
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'The guarded subtree.' },
      { prop: 'homeHref', type: 'string', def: "'/'", desc: '"Go home" destination.' },
      { prop: 'fallback', type: '({ error, errorInfo, reset }) => ReactNode', def: '—', desc: 'Render-prop override for the fallback screen.' },
      { prop: 'onReset', type: 'function', def: '—', desc: 'Called after "Try again" clears the error.' },
    ],
  },

  SearchInput: {
    usage: "<SearchInput value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} shortcutHint=\"⌘K\" />",
    api: [
      { prop: 'value', type: 'string', def: "''", desc: 'Controlled value.' },
      { prop: 'onChange', type: '(event) => void', def: '—', desc: 'Input change handler.' },
      { prop: 'placeholder', type: 'string', def: "'Search…'", desc: 'Placeholder text.' },
      { prop: 'onClear', type: '() => void', def: '—', desc: 'Trailing × click; renders only while set AND value non-empty.' },
      { prop: 'shortcutHint', type: 'string', def: '—', desc: 'Caller-authored kbd chip (e.g. "⌘K") shown while empty; no key handling here.' },
      { prop: 'size', type: 'sm | md', def: 'md', desc: 'Control size + matched mono type class.' },
      { prop: 'variant', type: 'filled | ghost | outline', def: 'filled', desc: 'Same chrome as Input; ignored when bare.' },
      { prop: 'bare', type: 'boolean', def: 'false', desc: 'Borderless inline field for overlay/palette panels.' },
    ],
  },

  ShellDrawer: {
    usage: '<ShellDrawer open={open} onClose={() => setOpen(false)} side="left" width={320}>{nav}</ShellDrawer>',
    api: [
      { prop: 'open', type: 'boolean', def: '—', desc: 'Drawer visible; drives the slide in/out.' },
      { prop: 'onClose', type: 'function', def: '—', desc: 'Esc, backdrop, and close button all call it.' },
      { prop: 'side', type: 'left | right', def: 'left', desc: 'Edge the panel slides from.' },
      { prop: 'width', type: 'number | string', def: '—', desc: 'Panel width; omit for a full-width sheet.' },
      { prop: 'header', type: 'ReactNode', def: '—', desc: 'Header-row content beside the built-in close button.' },
      { prop: 'children', type: 'ReactNode', def: '—', desc: 'Scrollable panel body.' },
    ],
  },

  ShellSearchOverlay: {
    usage: '<ShellSearchOverlay open={open} onClose={close} results={results} query={q} onQueryChange={setQ} onSelect={(item) => go(item.id)} />',
    api: [
      { prop: 'open', type: 'boolean', def: '—', desc: 'Mount/unmount the overlay.' },
      { prop: 'onClose', type: '() => void', def: '—', desc: 'Backdrop, Escape, and post-select.' },
      { prop: 'results', type: '{ id, label, group?, hint? }[]', def: '[]', desc: 'Pre-filtered rows — the consumer owns matching.' },
      { prop: 'query', type: 'string', def: "''", desc: 'Controlled query; drives match highlighting.' },
      { prop: 'onQueryChange', type: '(string) => void', def: '—', desc: 'Input change (value, not event).' },
      { prop: 'onSelect', type: '(item) => void', def: '—', desc: 'Row click / Enter on active row; fires then closes.' },
    ],
  },

  FeatureSplit: {
    usage: '<FeatureSplit kicker="THE FLEET" title={<>Built to hold <em>course</em></>} body="…" media={<img … />} />',
    api: [
      { prop: 'kicker / title / body', type: 'ReactNode', def: '—', desc: 'Eyebrow, display pull (<em> = italic accent), lede.' },
      { prop: 'meta', type: '{ num, label }[]', def: '—', desc: 'Stats strip (mutually exclusive with ctas).' },
      { prop: 'ctas', type: 'ReactNode', def: '—', desc: 'Button row (mutually exclusive with meta).' },
      { prop: 'media / caption', type: 'ReactNode', def: '—', desc: 'Visual column + mono caption with gradient veil.' },
      { prop: 'bgImage', type: 'string', def: '—', desc: 'Inline cover background URL.' },
      { prop: 'fullBleed', type: 'boolean', def: 'false', desc: '100vw breakout.' },
    ],
  },
}

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
      { prop: 'label', type: 'string', def: '—', desc: 'Field label.' },
      { prop: 'variant', type: 'default | minimal', def: 'default', desc: 'Visual style.' },
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
}

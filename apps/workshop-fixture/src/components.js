/* The fixture's component roster — invented, but shaped like the showcase's: a tier (category), a
 * function, the package it ships from, a description, tags and a few props. */
const c = (name, category, fn, description, tags = [], props = []) => ({
  name,
  slug: name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
  category,
  fn,
  pkg: category === 'Utilities' ? '@fixture/component' : `@fixture/${category === 'Organisms' ? 'app' : 'component'}`,
  description,
  tags,
  props,
})

const size = { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'One height per size' }

export const COMPONENTS = [
  c('Button', 'Atoms', 'action', 'The one button: primary, outline, ghost.', ['pattern/action'], [size, { name: 'variant', type: "'primary' | 'outline' | 'ghost'", default: "'primary'", description: 'Fill' }]),
  c('IconButton', 'Atoms', 'action', 'A button that is only a glyph — always carries a tooltip.', ['pattern/action', 'domain/icons'], [size, { name: 'label', type: 'string', default: '—', description: 'The tooltip and the aria-label' }]),
  c('Input', 'Atoms', 'input', 'Single-line text input on the control shell.', ['pattern/input'], [size, { name: 'placeholder', type: 'string', default: "''", description: 'Hint text' }]),
  c('Textarea', 'Atoms', 'input', 'Multi-line input that grows with its content.', ['pattern/input']),
  c('Label', 'Atoms', 'input', 'The name above a field.', ['pattern/input']),
  c('Badge', 'Atoms', 'display', 'A short status word in a pill.', ['pattern/display']),
  c('Tag', 'Atoms', 'display', 'A removable chip for a tag or filter.', ['pattern/display', 'domain/tags']),
  c('Icon', 'Atoms', 'display', 'Renders a glyph from the one set by name.', ['domain/icons']),
  c('Avatar', 'Atoms', 'display', 'A person as an image or initials.', ['pattern/display']),
  c('Toggle', 'Atoms', 'input', 'An on/off switch.', ['pattern/input']),
  c('Tooltip', 'Molecules', 'overlay', 'The design-system tooltip — never the browser title.', ['pattern/overlay']),
  c('SearchInput', 'Molecules', 'input', 'Input with a search glyph and a clear button.', ['pattern/input', 'domain/search']),
  c('LabeledField', 'Molecules', 'input', 'A label, a control and a hint, aligned.', ['pattern/input']),
  c('SegmentedToggle', 'Molecules', 'input', 'Two to five exclusive options in one strip.', ['pattern/input']),
  c('Dropdown', 'Molecules', 'input', 'A button that opens a list of options.', ['pattern/input', 'pattern/overlay']),
  c('Popover', 'Molecules', 'overlay', 'Floating panel anchored to a trigger.', ['pattern/overlay']),
  c('Table', 'Organisms', 'display', 'Rows and columns with opaque seams.', ['pattern/display', 'domain/layout']),
  c('MediaLibrary', 'Organisms', 'media', 'Browse, filter and preview files in a bucket.', ['domain/media', 'domain/search']),
  c('SettingsForm', 'Organisms', 'structure', 'Grouped settings rows with a save bar.', ['pattern/structure']),
  c('ShortcutsSheet', 'Organisms', 'overlay', 'Every keyboard shortcut on one sheet, opened with S.', ['pattern/overlay', 'domain/workflow']),
  c('CommandPalette', 'Organisms', 'navigation', 'Jump anywhere from the keyboard.', ['domain/search', 'pattern/wayfinding']),
  c('Divider', 'Utilities', 'structure', 'A hairline between regions.', ['pattern/structure']),
  c('Figure', 'Utilities', 'display', 'A framed image with a caption.', ['pattern/display', 'domain/media']),
  c('VisuallyHidden', 'Utilities', 'utility', 'Text for screen readers only.', ['domain/a11y']),
]

export const BLOCKS = [
  { key: 'inspector', title: 'Inspector panel', description: 'Transform, appearance and type panes over one selection.', uses: ['SegmentedToggle', 'Input', 'Divider'] },
  { key: 'filter-bar', title: 'Filter bar', description: 'Search, tag chips and a view toggle above a collection.', uses: ['SearchInput', 'Tag', 'SegmentedToggle'] },
  { key: 'settings', title: 'Settings form', description: 'Labelled rows, a toggle and a save bar.', uses: ['LabeledField', 'Toggle', 'Button'] },
]

export const SETS = [
  { key: 'controls', title: 'Controls', description: 'Every input at every size.', members: ['Button', 'Input', 'Textarea', 'Toggle', 'Dropdown', 'SegmentedToggle'] },
  { key: 'overlays', title: 'Overlays', description: 'Everything that floats.', members: ['Tooltip', 'Popover', 'Dropdown', 'ShortcutsSheet', 'CommandPalette'] },
]

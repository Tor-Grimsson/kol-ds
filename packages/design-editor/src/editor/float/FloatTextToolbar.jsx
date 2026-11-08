import { Menu } from '@kolkrabbi/kol-component'
import { IconLoader } from '@kolkrabbi/kol-icons'
import { useLayerEdit } from '../compose/useLayerEdit'
import { familyPatch, SIZE_PRESETS } from '../compose/inspectors/TextPanel'
import { FAMILY_OPTIONS, layerFamily, stylesFor, styleValueFor, ensureFamilyLoaded } from '../modes/type/families'

/**
 * FloatTextToolbar — the text tool's options over the canvas (plan-2026-11-05-float-editor W2.4; his Context toolbar
 * 19:10406, frame 03 19:6699): a float sheet with the lit TEXT tab, then the family, the style and the size, each a
 * float Menu over the selected text layer — the same writes the Typography card makes (`familyPatch`, the style's patch,
 * `size`), coalesced into one undo step per quiet period.
 *
 * @param {Object} layer  the selected text layer
 */
const TRIGGER = 'inline-flex items-center gap-2 h-[26px] bg-transparent border-0 p-0 uppercase whitespace-nowrap cursor-pointer kol-float-label text-fg-48 hover:text-fg-80 aria-expanded:text-fg-96 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]'

function Pick({ label, items, ariaLabel, search }) {
  return (
    <Menu variant="float" items={items} minWidth={search ? 240 : 160} search={search ? { empty: 'No match' } : undefined}
      panelClassName="max-h-[360px] overflow-y-auto"
      trigger={({ open, props }) => (
        <button {...props} type="button" aria-label={ariaLabel} aria-expanded={open} className={TRIGGER}>
          {label}
          <IconLoader name="chevron-down" size={16} className="text-oq-64" />
        </button>
      )} />
  )
}

export default function FloatTextToolbar({ layer, className = '' }) {
  const edit = useLayerEdit(layer.locked ? null : layer.id, { history: 'coalesce' })
  const family = layerFamily(layer)
  const styles = stylesFor(family)
  const style = styleValueFor(layer)
  const size = typeof layer.size === 'number' ? Math.round(layer.size) : null
  const famLabel = FAMILY_OPTIONS.find((f) => f.value === family)?.label ?? family

  return (
    <div role="toolbar" aria-label="Text options" className={`kol-float-text-toolbar kol-float-chrome inline-flex items-start gap-5 min-w-[420px] h-[68px] px-5 pt-5 bg-surface-secondary rounded-[var(--kol-float-window-r)] ${className}`.trim()}>
      <span className="relative inline-flex items-start h-[26px] uppercase kol-float-panel text-fg-96">
        Text
        <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-fg-96" aria-hidden="true" />
      </span>
      <Pick label={famLabel} ariaLabel="Font family" search
        items={FAMILY_OPTIONS.map((f) => ({ key: f.value, label: f.label, checked: f.value === family, onClick: () => { ensureFamilyLoaded(f.value); edit.patch(familyPatch(layer, f.value)) } }))} />
      <Pick label={styles.find((s) => s.value === style)?.label ?? 'Style'} ariaLabel="Font style"
        items={styles.map((s) => ({ key: s.value, label: s.label, checked: s.value === style, onClick: () => edit.patch(s.patch) }))} />
      <Pick label={size != null ? `${size} px` : 'Size'} ariaLabel="Font size"
        items={SIZE_PRESETS.map((v) => ({ key: v, label: `${v} px`, checked: v === size, onClick: () => edit.setProp('size', v) }))} />
    </div>
  )
}

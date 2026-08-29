import { useState } from 'react'
import {
  Button, SettingsPanel, LabeledControlSection, SettingsRow, SettingsSwitch, SettingsChoice, SettingsMulti, SettingsFooter,
} from '@kolkrabbi/kol-component'

/* THE APPROVED DRAWER (kol-r2b2, user: "LOCK THIS", 2026-08-27): title only, a
 * divider, eyebrow sections of LabeledControl rows — switches at the far
 * right, one-of-N as full-width Dropdowns, the kinds as ONE toggling Dropdown —
 * and a divider + reset icon at the foot. No edge, no shadow. */
export const variants = ['drawer', 'overlay']

const DEFAULTS = { kinds: ['image', 'video', 'markdown'], columns: false, flat: false, groupVariants: true, pageSize: 200, video: 'poster', layout: 'grid', sortBy: 'date', sortDir: 'desc' }
const KINDS = ['audio', 'video', 'image', 'markdown', 'json', 'yaml', 'text', 'code', 'playlist', 'font', 'archive', 'other'].map((k) => ({ value: k, label: k }))

export default function SettingsPanelDemo({ variant = 'drawer' }) {
  const [open, setOpen] = useState(false)
  const [s, setS] = useState(DEFAULTS)
  const set = (patch) => setS((prev) => ({ ...prev, ...patch }))
  const toggleKind = (k) => set({ kinds: s.kinds.includes(k) ? s.kinds.filter((x) => x !== k) : [...s.kinds, k] })
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>Display settings</Button>
      <SettingsPanel open={open} variant={variant} title="Display settings" onClose={() => setOpen(false)} footer={<SettingsFooter onReset={() => setS(DEFAULTS)} />}>
        <LabeledControlSection label="Structure" divided rowGap={1}>
          <SettingsRow label="Columns" hint="Finder-style columns instead of folder rows"><SettingsSwitch label="Columns" on={s.columns} onChange={(v) => set({ columns: v })} /></SettingsRow>
          <SettingsRow label="Flat" hint="ignore folders, show the whole subtree"><SettingsSwitch label="Flat" on={s.flat} onChange={(v) => set({ flat: v })} /></SettingsRow>
          <SettingsRow label="Group resolutions" hint="197 sets — previews the smallest file"><SettingsSwitch label="Group resolutions" on={s.groupVariants} onChange={(v) => set({ groupVariants: v })} /></SettingsRow>
          <SettingsRow label="Fold HLS segments" hint="no segments in this bucket"><SettingsSwitch label="Fold HLS segments" on={false} disabled disabledHint="nothing to fold here" /></SettingsRow>
        </LabeledControlSection>
        <LabeledControlSection label="Loading" divided>
          <SettingsRow label="Kinds" align="fill"><SettingsMulti options={KINDS} selected={s.kinds} onToggle={toggleKind} /></SettingsRow>
          <SettingsRow label="Page size" hint="entries mounted at once" align="fill"><SettingsChoice options={[100, 200, 500, { value: 0, label: 'All' }]} value={s.pageSize} onChange={(v) => set({ pageSize: v })} ariaLabel="Page size" /></SettingsRow>
          <SettingsRow label="Video preview" hint="poster uses the sibling image; autoload fetches the file" align="fill"><SettingsChoice options={[{ value: 'poster', label: 'Poster' }, { value: 'none', label: 'None' }, { value: 'autoload', label: 'Autoload' }]} value={s.video} onChange={(v) => set({ video: v })} ariaLabel="Video preview" /></SettingsRow>
        </LabeledControlSection>
        <LabeledControlSection label="Layout" divided>
          <SettingsRow label="View" align="fill"><SettingsChoice options={[{ value: 'off', label: 'Off' }, { value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]} value={s.layout} onChange={(v) => set({ layout: v })} ariaLabel="View" /></SettingsRow>
          <SettingsRow label="Sort" align="fill"><SettingsChoice options={[{ value: 'name', label: 'Name' }, { value: 'date', label: 'Date' }, { value: 'size', label: 'Size' }, { value: 'kind', label: 'Kind' }]} value={s.sortBy} onChange={(v) => set({ sortBy: v })} ariaLabel="Sort" /></SettingsRow>
          <SettingsRow label="Direction" align="fill"><SettingsChoice options={[{ value: 'asc', label: '↓ Asc' }, { value: 'desc', label: '↑ Desc' }]} value={s.sortDir} onChange={(v) => set({ sortDir: v })} ariaLabel="Direction" /></SettingsRow>
        </LabeledControlSection>
      </SettingsPanel>
    </>
  )
}

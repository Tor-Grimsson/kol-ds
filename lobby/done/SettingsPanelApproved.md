---
component: SettingsPanel
source: kol-r2b2/src/SettingsPanel.jsx — the APPROVED composition (user: "LOCK THIS", 2026-08-27)
staged: 2026-08-27
status: draft
deps: [SettingsPanel, ShellDrawer, LabeledControl, Dropdown, ToggleSwitch, InspectorSection, Divider, IconFrame, FullscreenOverlay, KindPreview, ColumnBrowser]
---

# SettingsPanel — the approved drawer (reference), and four defects around it

The user built the drawer locally on top of the shipped organism, ruled every step, and locked it: `_assets/2026-08-27-settings-and-preview/settings-drawer-APPROVED.png`. **This is the reference. The pixels, not the code.** 0.102.0's reading (arrow `SectionLabel`, `SettingsChoice` strips, `allChip`) is superseded by it.

## The rulings the source encodes
- Header: title only (`DISPLAY SETTINGS`, helper-14 uppercase), no subtitle, no intro sentence. A `Divider` under it.
- Section label = **the eyebrow**: `.kol-eyebrow` (mono 12 · 500 · 0.06em · uppercase) at `text-fg-80`. Not `SectionLabel`, not the `Section`'s own label. The eyebrow stands apart from the rows: `Section` gap `3` between eyebrow and the rows' stack.
- **Every row is a `LabeledControl inline`** — uppercase label (`kol-helper-10` tracked, `text-meta`), label column 160, control fills the rest. Switches (`ToggleSwitch` sm) sit at the far right; one-of-N rows are `Dropdown` sm primary, full width. No hint sentences on the page — they ride the control's `title`.
- Row stacks: Structure `gap-1` (switch rows are 24 tall already); Loading / Layout / Write `gap-2`.
- Kinds: ONE `Dropdown` listing every kind (14) individually — trigger reads `N of M kinds`, each entry toggles, `✓` marks the on ones. No grouping.
- Footer: a `Divider`, then a single `IconFrame` `refresh` (primary · sm) right-aligned = reset to defaults. No status word, no text button.
- Drawer chrome: **no left border, no shadow** (`!border-l-0 !shadow-none` on the sheet — the organism ships `border-l` + `shadow-2xl`).

## The molecule to ship: `LabeledControlList`
User: "I'm wondering if eyebrow + children section warrants a LabeledControlList or something, because I keep making the same changes." Yes — ship it:

```jsx
<LabeledControlList label="Structure" gap={1}>      // eyebrow (.kol-eyebrow text-fg-80) · gap-3 · the rows' stack
  <LabeledControl inline label="COLUMNS" labelWidth={160}>…</LabeledControl>
  …
</LabeledControlList>
```
- `label` renders the eyebrow; `gap` is the rows' stack gap (default 2; switch rows use 1); `labelWidth` can be set once on the list and inherited by its rows; `divided` between sibling lists as `Section` does today.
- The drawer above is four of them + a header + a footer. Every settings-shaped surface in the estate is the same thing.

## Defects found on the way (all DS)
1. **`Dropdown` panels open BEHIND the drawer** — `.kol-popover-float` is z 110, the `ShellDrawer` sheet is `z-[200]`. Consumer override: `.kol-popover-float { z-index: 210 }`.
2. **`.kol-overlay` scrim regressed in theme 0.70.0** — measured `color(srgb .055 .055 .067 / .88)` (the ink at 88 %), which reads as a light wash in dark mode. Ruled scrim: flat `var(--kol-surface-primary)` (0.96 shipped that; 0.70.0 undid it). Consumer override in place.
3. **Markdown in `KindPreview` is unbounded** — in the 320px column preview it renders at full size and clips; in the overlay it runs full-bleed over the page. Consumer overrides: `.kol-column-browser-preview .kol-prose { zoom: .5 }` (a document scaled to the frame) and `.kol-overlay .kol-prose { max-width: var(--kol-content-measure); margin-inline: auto; padding: 24px }` (a readable sheet). The organism should own both.
4. **`ColumnBrowser`: picking a file must close the open sibling folder without losing the cursor** — the consumer collapses via `onPrefix` and then re-seeds the cursor with a programmatic click on the file row; Finder does this natively (one highlight, cursor on the file).
5. **`SettingsSwitch` drops `title`** unless disabled — the consumer wraps it in a `<span title>` to keep the hover hint.

## Source, verbatim
```jsx
import SettingsPanelShell, {
  SettingsSwitch,
} from '@kolkrabbi/kol-component/organisms/SettingsPanel';
import Section from '@kolkrabbi/kol-component/molecules/InspectorSection';
import Dropdown from '@kolkrabbi/kol-component/molecules/Dropdown';
import Divider from '@kolkrabbi/kol-component/atoms/Divider';
import IconFrame from '@kolkrabbi/kol-component/atoms/IconFrame';
import LabeledControl from '@kolkrabbi/kol-component/molecules/LabeledControl';
import { ALL_KINDS } from './lib/settings';
import { KIND_LABEL } from './lib/media';

/* Display settings for the ACTIVE bucket. The panel is the DS organism
 * (kol-component 0.69.0, filed from here as SettingsPanel 2026-08-26); this
 * file is only the bucket/profile wiring — consumer state the DS doesn't own.
 *
 * Every control here sets a default, not a gate: unticking a kind hides it from
 * the list, it never makes those objects unreachable. */

export default function SettingsPanel({ bucket, settings, onChange, onReset, onClose, profile }) {
  const set = (patch) => onChange({ ...settings, ...patch });
  const toggleKind = (k) =>
    set({
      kinds: settings.kinds.includes(k)
        ? settings.kinds.filter((x) => x !== k)
        : [...settings.kinds, k],
    });

  // A toggle that can't do anything in this bucket says so rather than
  // pretending — profile counts come from the objects actually loaded.
  const noVariants = profile.variantSets === 0;
  const noSegments = profile.segments === 0;

  return (
    <SettingsPanelShell
      variant="drawer"
      className="!border-l-0 !shadow-none"
      title="Display settings"
      onClose={onClose}
      footer={<div className="flex flex-col gap-4"><Divider /><div className="flex justify-end"><IconFrame name="refresh" variant="primary" size="sm" onClick={onReset} title="Reset to defaults" aria-label="Reset to defaults" /></div></div>}
    >
      <Divider />

      {/* Every row is a LabeledControl — uppercase label, one gap — the eyebrow stands apart. */}
      <Section divided className="gap-3">
        <p className="kol-eyebrow text-fg-80">Structure</p>
        <div className="flex flex-col gap-1">
          <LabeledControl inline label="COLUMNS" labelWidth={160}>
            <span title="Finder-style columns instead of folder rows" className="inline-flex w-full justify-end">
              <SettingsSwitch label="Columns" on={(settings.folderView ?? 'rows') === 'columns'} onChange={(v) => set({ folderView: v ? 'columns' : 'rows' })} />
            </span>
          </LabeledControl>
          <LabeledControl inline label="FLAT" labelWidth={160}>
            <span title="ignore folders, show the whole subtree" className="inline-flex w-full justify-end">
              <SettingsSwitch label="Flat" on={settings.flat} onChange={(v) => set({ flat: v })} />
            </span>
          </LabeledControl>
          <LabeledControl inline label="GROUP RESOLUTIONS" labelWidth={160}>
            <span title={noVariants ? 'no resolution sets in this bucket' : `${profile.variantSets} sets — previews the smallest file`} className="inline-flex w-full justify-end">
              <SettingsSwitch label="Group resolutions" on={settings.groupVariants} onChange={(v) => set({ groupVariants: v })} disabled={noVariants} disabledHint="nothing to group here" />
            </span>
          </LabeledControl>
          <LabeledControl inline label="FOLD HLS SEGMENTS" labelWidth={160}>
            <span title={noSegments ? 'no segments in this bucket' : `${profile.segments} segments into stream rows`} className="inline-flex w-full justify-end">
              <SettingsSwitch label="Fold HLS segments" on={settings.foldSegments} onChange={(v) => set({ foldSegments: v })} disabled={noSegments} disabledHint="nothing to fold here" />
            </span>
          </LabeledControl>
        </div>
      </Section>

      <Section divided className="gap-3">
        <p className="kol-eyebrow text-fg-80">Loading</p>
        <div className="flex flex-col gap-2">
          <LabeledControl inline label="KINDS" labelWidth={160}>
            <Dropdown
              className="w-full"
              value="__summary"
              options={[
                { value: '__summary', label: `${settings.kinds.length} of ${ALL_KINDS.length} kinds` },
                ...ALL_KINDS.map((k) => ({ value: k, label: `${settings.kinds.includes(k) ? '✓ ' : ''}${KIND_LABEL[k] || k}` })),
              ]}
              onChange={(v) => (v === '__summary' ? null : toggleKind(v))}
            />
          </LabeledControl>
          <LabeledControl inline label="PAGE SIZE" labelWidth={160}>
            <Dropdown
              className="w-full"
              title="entries mounted at once"
              options={[{ value: 100, label: '100' }, { value: 200, label: '200' }, { value: 500, label: '500' }, { value: 0, label: 'All' }]}
              value={settings.pageSize}
              onChange={(v) => set({ pageSize: v })}
            />
          </LabeledControl>
          <LabeledControl inline label="VIDEO PREVIEW" labelWidth={160}>
            <Dropdown
              className="w-full"
              title="poster uses the sibling image; autoload fetches the file"
              options={[{ value: 'poster', label: 'Poster' }, { value: 'none', label: 'None' }, { value: 'autoload', label: 'Autoload' }]}
              value={settings.videoPreview}
              onChange={(v) => set({ videoPreview: v })}
            />
          </LabeledControl>
        </div>
      </Section>

      <Section divided className="gap-3">
        <p className="kol-eyebrow text-fg-80">Layout</p>
        <div className="flex flex-col gap-2">
          <LabeledControl inline label="VIEW" labelWidth={160}>
            <Dropdown className="w-full" options={[{ value: 'off', label: 'Off' }, { value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]} value={settings.layout} onChange={(v) => set({ layout: v })} />
          </LabeledControl>
          <LabeledControl inline label="SORT" labelWidth={160}>
            <Dropdown className="w-full" options={[{ value: 'name', label: 'Name' }, { value: 'date', label: 'Date' }, { value: 'size', label: 'Size' }, { value: 'kind', label: 'Kind' }]} value={settings.sortBy} onChange={(v) => set({ sortBy: v })} />
          </LabeledControl>
          <LabeledControl inline label="DIRECTION" labelWidth={160}>
            <Dropdown className="w-full" options={[{ value: 'asc', label: '↓ Asc' }, { value: 'desc', label: '↑ Desc' }]} value={settings.sortDir} onChange={(v) => set({ sortDir: v })} />
          </LabeledControl>
        </div>
      </Section>

      {bucket.writable && (
        <Section divided className="gap-3">
          <p className="kol-eyebrow text-fg-80">Write</p>
          <div className="flex flex-col gap-2">
            <LabeledControl inline label="DROP POOL OPEN" labelWidth={160}>
              <span title="off by default — uploading is the rare visit" className="inline-flex w-full justify-end">
                <SettingsSwitch label="Drop pool open" on={settings.uploadOpen} onChange={(v) => set({ uploadOpen: v })} />
              </span>
            </LabeledControl>
          </div>
        </Section>
      )}
    </SettingsPanelShell>
  );
}
```
```css
/* Lightbox scrim: the flat page surface (user-approved 2026-08-26). Theme 0.70.0
   paints it with the INK at 88%, which reads as a light wash in dark mode. */
.kol-overlay { background: var(--kol-surface-primary); }

/* Markdown in the overlay: a readable sheet, not full-bleed over the page. */
.kol-overlay .kol-prose { max-width: var(--kol-content-measure); margin-inline: auto; padding: 24px; }

/* Markdown in the column preview: a document scaled to the 320px frame. */
.kol-column-browser-preview .kol-prose { zoom: 0.5; }

/* Dropdown panels must clear the settings drawer (sheet z-200; the popover shipped at 110). */
.kol-popover-float { z-index: 210; }
```

## Recreation notes
`SettingsPanel` default composition = this; `SettingsSection` = eyebrow + gap-3 + a `LabeledControl` stack; `SettingsChoice` = `Dropdown`; the kinds row a `Dropdown` with toggling entries; footer = divider + reset icon. Consumer deletes `SettingsPanel.jsx`'s composition and the three CSS overrides on publish.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.104.0 · kol-theme 0.71.0

The organism is the approved drawer: title only + a Divider under it; SettingsSection = kol-eyebrow text-fg-80 standing apart (gap-3) from a row stack (rowGap 1 / 2); SettingsRow = LabeledControl inline (uppercase helper-10 label at 160, hint on the control's title, switches at the far right, dropdowns fill via align="fill"); SettingsChoice a full-width Dropdown sm primary; SettingsMulti = one Dropdown of toggling entries (N of M kinds, ✓ on the on ones); SettingsFooter = Divider + refresh IconFrame; SettingsSwitch keeps title; ShellDrawer takes edge / shadow and the drawer passes neither. Defects: (1) .kol-popover-float z 210. (2) the lightbox scrim: the theme's .kol-overlay has been flat --kol-surface-primary since 0.65.0 and 0.70.0 did not touch it — there is no 88% ink rule on it in the theme; the wash you measured is not the DS's rule (the ShellDrawer backdrop .kol-overlay-scrim is #000 60%, a different element) — drop the override and re-measure on the bump; if it persists, it's a consumer stylesheet. (3) .kol-column-browser-preview .kol-prose zoom .5 and .kol-overlay .kol-prose on the content measure + 24px padding. (4) ColumnBrowser: picking a file in a column with an open folder collapses that folder and keeps the cursor on the file. (5) SettingsSwitch title. Verified in source only (no server run, by your rule); all 21 gates clean.

**Remainder here:** none — kol-r2b2 bump kol-component 0.104.0 + kol-theme 0.71.0; delete src/SettingsPanel.jsx's composition for the organism (SettingsSection / SettingsRow / SettingsSwitch / SettingsChoice / SettingsMulti / SettingsFooter), the three CSS overrides and the cursor re-seed click.


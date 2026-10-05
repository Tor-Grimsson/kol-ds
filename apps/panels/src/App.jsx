import { useEffect, useMemo, useRef, useState } from 'react'
import { AppShell } from '@kolkrabbi/kol-shell'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'
/* the editor's OWN panels, state and stylesheets, from its source (see vite.config.js) */
import 'design-editor-src/index.lib.css'
import 'design-editor-src/editor/styles/kol-editor.css'
import 'design-editor-src/editor/styles/kol-labs.css'
import 'design-editor-src/packs'
import { EditorProviders } from 'design-editor-src/editor/Editor'
import { useComposeState } from 'design-editor-src/editor/compose/state'
import LabsNav from 'design-editor-src/editor/labs/LabsNav'
import LabsParams from 'design-editor-src/editor/labs/LabsParams'
import { useLabsLayer } from 'design-editor-src/editor/labs/useLabsLayer'
import { sheetLabels } from 'design-editor-src/editor/labs/sheetLabels'
import { PanelHeader, PanelPills } from 'design-editor-src/editor/components/PanelHeader'
import EditorFooter from 'design-editor-src/editor/shell/panels/EditorFooter'
import SelectionPalettePanel from 'design-editor-src/editor/shell/panels/SelectionPalettePanel'
import { ControlSizeContext } from 'design-editor-src/editor/params/controlSize'
import { isMobileDevice, wantsDesktop } from 'design-editor-src/editor/mobile/device'
import { useRailExtras, RAIL_EXTRA_PREFIX } from 'design-editor-src/railExtras'

/* PARAMETER PANELS, ALONE (rebuilt 2026-10-03 — the user: "apps/panels also fails … they just look
 * wrong"). The first build drew `AutoControls` in two invented columns under a page header; no
 * panel anywhere looks like that. This is labs with the stage taken out: the SAME catalog on the
 * rail (`LabsNav` → the package's railExtras), the SAME one layer (`useLabsLayer`), and beside each
 * other the two surfaces that edit it —
 *
 *   Labs rail          `LabsParams` over `EditorFooter`, in the rail's own markup — what fxr labs
 *                      and the randomiser's sheet are built from
 *   Editor inspector   `SelectionPalettePanel` — the compositor's right rail: Inspector ·
 *                      Parameters · Effects
 *
 * On a phone the labs rail is its touch sheet — the `md` rung, along the bottom, half the display
 * at most, under the header that collapses it — and the inspector is not drawn (the compositor has
 * no phone layout). Nothing here is a copy: a panel bug shows without an image in the way and is
 * fixed in design-editor's source.
 *
 * The pick is the hash — `#gen:Scanline`, `#fx:halftone`, `#kin:Type` … — the catalog's own ids. */

const FIRST = 'gen:Scanline'

export default function App() {
  const extras = useRailExtras()
  /* ONE element: labs republishes its rail rows on every render, and those rows re-render this
   * component — a fresh page each time is a loop (apps/editor carries the same note) */
  const page = useMemo(() => <EditorProviders persistDraft={false}><Panels /></EditorProviders>, [])

  /* open on a panel: the hash's pick, or the first generator */
  const seeded = useRef(false)
  useEffect(() => {
    if (seeded.current || !extras.dispatch) return
    seeded.current = true
    const id = decodeURIComponent(location.hash.slice(1))
    if (!extras.dispatch(RAIL_EXTRA_PREFIX + id)) extras.dispatch(RAIL_EXTRA_PREFIX + FIRST)
  }, [extras])

  return (
    <AppShell
      items={extras.items}
      logomark={{ svgUrl: logomark, title: 'KOL panels' }}
      currentPath=""
      onNavigate={(p) => {
        if (!p?.startsWith(RAIL_EXTRA_PREFIX)) return
        /* a pick closes the phone drawer — its own scrim, as kol-fxr's layout presses it */
        if (extras.dispatch?.(p)) {
          history.replaceState(null, '', '#' + p.slice(RAIL_EXTRA_PREFIX.length))
          document.querySelector('.kol-shell-drawer-scrim')?.click()
        }
      }}
      railToggleKey={'\\'}
      touch="drawer"
      pageWash="var(--kol-fg-02)"
    >
      {page}
    </AppShell>
  )
}

function Panels() {
  const { layer } = useLabsLayer()
  const { selectedId, select } = useComposeState()
  const touch = isMobileDevice() && !wantsDesktop()

  /* the one layer stays selected — every inspector resolves its subject from `selectedId`
   * (LabsView's rule) */
  useEffect(() => {
    if (layer && selectedId !== layer.id) select(layer.id)
  }, [layer, selectedId, select])

  /* the phone form: labs' sheet, where labs puts it — the page's bottom edge, its header on top,
   * a pill in its place when collapsed (LabsView's touch chrome, minus the stage above) */
  const [open, setOpen] = useState(true)
  if (touch) {
    return (
      <div className="kol-design-editor kol-editor-shell justify-end" data-editor-keep-selection>
        <LabsNav />
        <div className="kol-editor-labs contents" data-touch data-params={open ? 'open' : undefined}>
          <ControlSizeContext.Provider value="md">
            <aside className="kol-editor-right">
              <div className="kol-editor-rail-header">
                <PanelHeader title={sheetLabels(layer).title} onCollapse={() => setOpen(false)} className="px-4" />
              </div>
              <div className="kol-editor-rail-body">
                <div className="kol-compose-rail kol-compose-rail--inspector">
                  <div className="kol-compose-inspector-body">
                    <LabsParams />
                  </div>
                </div>
              </div>
              <div className="kol-editor-rail-footer">
                <EditorFooter />
              </div>
            </aside>
          </ControlSizeContext.Provider>
          {!open && <PanelPills tone="grey" label={sheetLabels(layer).pill} onOpen={() => setOpen(true)} />}
        </div>
      </div>
    )
  }

  return (
    <div className="kol-design-editor flex h-dvh items-stretch gap-6 overflow-x-auto" data-editor-keep-selection>
      {/* draws nothing — hands labs' categories to the shell rail */}
      <LabsNav />
      <div className="kol-editor-labs contents">
        <Column label="Labs rail" width="var(--kol-rail-w)">
          <aside className="kol-editor-right flex-1">
            <div className="kol-editor-rail-body">
              <div className="kol-compose-rail kol-compose-rail--inspector">
                <div className="kol-compose-inspector-body">
                  <LabsParams />
                </div>
              </div>
            </div>
            <div className="kol-editor-rail-footer">
              <EditorFooter />
            </div>
          </aside>
        </Column>
      </div>
      <Column label="Editor inspector" width={320}>
        <aside className="kol-editor-right flex-1">
          <div className="kol-editor-rail-body">
            <SelectionPalettePanel />
          </div>
        </aside>
      </Column>
    </div>
  )
}

/* one rail, standing alone: the editor shell's own column (flex, full height, its ground) under a
 * line that names it */
function Column({ label, width, children }) {
  return (
    /* box-content: the rule on the right is OUTSIDE the width, so the rail inside is exactly as
       wide as it is in its chrome */
    <div className="kol-editor-shell box-content shrink-0 border-r border-oq-08" style={{ width }}>
      <p className="kol-eyebrow text-meta shrink-0 border-b border-l border-oq-08 px-4 py-3">{label}</p>
      {children}
    </div>
  )
}

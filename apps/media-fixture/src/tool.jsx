import { useEffect, useRef, useState } from 'react'
import { IconFrame, Tooltip } from '@kolkrabbi/kol-component'
import { useTheme } from '@kolkrabbi/kol-framework/src/theme.js'
import FileFormats from './FileFormats.jsx'

/* THE MEDIA TOOL, ONCE (2026-09-26 — user: "media in shell is just media in shell.. so there
 * shouldnt really be a reason to diff"). apps/media's App.jsx carried the tool's extras — the drawer
 * footer, the file-formats overview, clear changes on ⇧R — so apps/media-shell rendered the same
 * MediaLibrary without them. Both apps take them from here now:
 *
 *   const tool = useMediaTool({ client, media })
 *   <MediaLibrary variant="explorer" {...media.props} {...tool.props} … />
 *   {tool.overlay}
 *
 * `tool.props` switches on the DS explorer's own keys and phone tabs (B F R C G N, K → the
 * overview) and hands it the footer. Not a UI component — the parts are the DS's; this is the
 * fixture's arrangement of them, the way `useFixtureMedia` is its wiring. */

/* THE THEME TOGGLE — in the settings drawer's footer, beside the reset icon, in the SAME chip
 * (user 2026-08-28). `SettingsFooter` renders it in reset's own row, before the reset button. Same
 * `IconFrame variant="primary" size="sm"` as reset, driven by the framework's own `useTheme`. */
function ThemeChip() {
  const { theme, cycle } = useTheme()
  const dark = theme === 'dark'
  return (
    <Tooltip label={dark ? 'Switch to light' : 'Switch to dark'}>
      <IconFrame name="mode-toggle-01" variant="primary" size="sm" onClick={cycle} aria-label={dark ? 'Switch to light' : 'Switch to dark'} />
    </Tooltip>
  )
}

export function useMediaTool({ client, media }) {
  const [formatsOpen, setFormatsOpen] = useState(false)

  /* ⇧R — clear changes, the fixture's own key (the tier rules: destructive verbs must be repeatable) */
  const clear = useRef(media.clearChanges)
  clear.current = media.clearChanges
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'R' || e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target
      if (el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? '')) return
      e.preventDefault()
      clear.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* THE SETTINGS FOOTER, kol-olina's arrangement (2026-09-21): the kind overview is a reference, not
   * a daily control, so it sits in the drawer beside theme and reset instead of the header. TWO
   * RESETS, TWO JOBS (user 2026-09-23): clear changes puts the FIXTURE back and wears a folder; the
   * DS's own reset beside it (refresh glyph) puts the PREFERENCES back. */
  const settingsFooter = (
    <>
      <ThemeChip />
      <Tooltip label="Clear changes — the fixture's files back to the seed">
        <IconFrame name="folder" variant="primary" size="sm" onClick={media.clearChanges} aria-label="Clear changes" />
      </Tooltip>
      <Tooltip label="File formats">
        <IconFrame name="grid" variant="primary" size="sm" onClick={() => setFormatsOpen(true)} aria-label="File formats" />
      </Tooltip>
    </>
  )

  return {
    props: { keys: true, phoneTabs: true, onKinds: () => setFormatsOpen((v) => !v), settingsFooter },
    overlay: <FileFormats open={formatsOpen} onClose={() => setFormatsOpen(false)} client={client} buckets={media.buckets} />,
    themeChip: <ThemeChip />,
  }
}

export { SHORTCUTS as TOOL_SHORTCUTS } from './shortcuts.js'

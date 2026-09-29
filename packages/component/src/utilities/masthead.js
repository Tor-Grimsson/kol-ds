import { createContext, useContext } from 'react'

/**
 * masthead — ONE APP, ONE MASTHEAD (apps review 2026-09-29, ruling D3). media-hub wore MEDIA in the
 * display voice on Browse and a mono title + description on its Hub pages: two headers in one app,
 * because each page picked its own. The voice is now the app's, set ONCE on the Shell
 * (`AppShell masthead`) and read by every page inside it — `PageHeader` (and so `CatalogPage`,
 * `HubHome`, `SettingsScaffold`) and the media tool's own title.
 *
 *   display   the default — "uppercase sans like media" (the user, 2026-09-29): the display voice,
 *             UPPERCASE as a role (03-typography § Casing — case rides the call site, not the class),
 *             no description line
 *   mono      the Hub's older look — a mono title with its description under it
 *
 * Outside a Shell there is no context and every header renders exactly as its props say, so a
 * site page is untouched. A page may still pass `masthead` itself (a Catalog with no Shell).
 */
export const MASTHEADS = {
  display: { voice: 'sans', size: 'md', subtitle: false, upper: true },
  mono: { voice: 'mono', size: 'sm', subtitle: true, upper: false },
}

/* the title role per voice and size — PageHeader's ladder, here so a tool's own title reads it too */
export const TITLE_ROLES = {
  sans: { sm: 'kol-sans-heading-03', md: 'kol-sans-display-03', lg: 'kol-sans-display-02' },
  mono: { sm: 'kol-mono-heading-03', md: 'kol-mono-display-03', lg: 'kol-mono-display-02' },
}

export const MastheadContext = createContext(null)

/** the masthead in effect — the page's own `masthead` prop, else the Shell's, else null */
export function useMasthead(own) {
  const shell = useContext(MastheadContext)
  const name = own ?? shell
  return name && MASTHEADS[name] ? { name, ...MASTHEADS[name] } : null
}

/** the title class a masthead gives — for a tool that draws its own title (media's LibraryHeader) */
export const mastheadTitleClass = (m, fallback) => (m ? `${TITLE_ROLES[m.voice][m.size]}${m.upper ? ' uppercase' : ''}` : fallback)

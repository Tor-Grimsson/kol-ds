import { createElement, useContext, useLayoutEffect } from 'react'
import { ShellTocContext } from '../shell/ShellLayout.jsx'
import ExhibitSidebar from './ExhibitSidebar.jsx'

/**
 * useExhibitToc — registers an ExhibitSidebar into the shell's TOC slot for as
 * long as the page is mounted, and clears it on the way out.
 *
 * This is the six-line `useContext` + `useLayoutEffect` block that every exhibit
 * page in kol-website copied verbatim. It takes DATA, not a node, on purpose:
 * a caller passing `<Sidebar links={LINKS} />` hands over a fresh element every
 * render, and an effect keyed on that identity would set shell state in a loop.
 * Keying on the CONTENT of the props closes that, so a page can pass an inline
 * array literal — which is what every one of them does.
 *
 * @param {object} props — ExhibitSidebar props: { sections, links, basePath, docHref, actions }
 */
export default function useExhibitToc(props = {}) {
  const setTocContent = useContext(ShellTocContext)

  /* Content, not identity — see the note above. */
  const key = JSON.stringify([props.sections ?? [], props.links ?? [], props.basePath, props.actions])

  useLayoutEffect(() => {
    /* Outside a ShellLayout the context defaults to null; a page rendered
     * standalone (a test, a preview route) must not throw over its rail. */
    if (!setTocContent) return undefined
    setTocContent(createElement(ExhibitSidebar, props))
    return () => setTocContent(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTocContent, key])
}

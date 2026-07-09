/**
 * @kolkrabbi/kol-workshop — the KOL workshop / docs system.
 *
 * Aggregates everything the package now owns: the shell composition
 * (ShellLayout + ShellSidebar + their contexts), the docs viewer, the tag
 * system, the example compositions, and the pure React-free engine. Duplicated
 * chrome (ShellHeader, ShellDrawer, SearchInput, ShellSearchOverlay, DocsToc)
 * ships from @kolkrabbi/kol-framework + @kolkrabbi/kol-component — consume it
 * from there, not from here.
 */
export * from './shell/index.js'
export * from './docs/index.js'
export * from './tags/index.js'
export * from './compositions/index.js'
export * from './engine/index.js'

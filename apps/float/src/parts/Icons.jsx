import { Button, floatSurfaceClass } from '@kolkrabbi/kol-component'
import { IconLoader } from '@kolkrabbi/kol-icons'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* Icons (24-float-system.md § The parts, by family, row 13): the 104 glyphs the float exploration draws, walked in W13
 * (gap map board W2.13, kol-float--style 51:2365) — each by its exploration name, drawn by the kol-icons glyph that
 * plays it. Two follow the set since the walk: `overlap` is `transparency`, `fold todos` is `chevron-up`. */

/* [exploration name, kol-icons name] — same name, one entry */
const GLYPHS = [
  'alert-triangle', 'align-vertical-center', 'arrow-left', 'bookmark', ['brand', 'ball'], ['bucket', 'bin-lid'], 'calendar', 'cap-round',
  'check', 'chevron-down', 'circle', 'clock', 'clr-mono', 'copy', 'download', 'drag-handle', 'expand', 'eye-on', 'file', 'folder', 'grid',
  'image', 'layers', 'layout', 'link', 'lock', 'maximize', 'minus', 'more', 'nav-create', ['overlap', 'transparency'], ['pause', 'pause-solid'], 'pen',
  ['play', 'play-solid'], 'plus', 'pointer', 'radial-star', ['record', 'ring'], 'repeat', 'rotate-right', 'search', 'skip-back', 'skip-end',
  'space-evenly-horizontal', 'square', 'type', 'undo', 'unlock', 'user', 'video', 'x',
  ['add', 'plus'], ['add task', 'plus'], ['chev', 'chevron-right'], ['down', 'chevron-down'], ['hide', 'hamburger'],
  ['iconright', 'chevron-right'], ['layer', 'layers'], ['left', 'chevron-left'], ['links', 'link'], ['media', 'film-strip'],
  ['metrics', 'bars-baseline'], ['profile', 'user'], ['projects', 'folder'], ['right', 'chevron-right'], ['slides', 'presentation'],
  ['up', 'chevron-up'], ['about', 'info'], ['assets', 'bento-grid'], ['book', 'book-open'], ['briefs options', 'more'],
  ['capture', 'inbox'], ['collapse', 'sidebar-collapse'], ['collapsed branch disclosure', 'chevron-right'], ['color', 'color-palette'],
  ['contents', 'list-bullet'], ['expand panel', 'chevron-down'], ['expand sidebar', 'sidebar-expand'], ['expand task index', 'chevron-up'],
  ['fold briefs', 'chevron-up'], ['fold inspector', 'chevron-up'], ['fold panel', 'chevron-up'], ['fold todos', 'chevron-up'],
  ['founder', 'bars-descending'], ['guide', 'bookmark'], ['highlight marker', 'highlighter'], ['home', 'home-01'],
  ['index', 'panels-top-left'], ['inspector options', 'more'], 'lockup', ['logo', 'letter-a'], ['look', 'eye-almond'],
  ['mark', 'bookmark'], ['menu', 'hamburger'], ['note', 'pencil'], ['notes', 'notebook-pen'], ['pattern', 'dot-matrix-3x3'],
  ['props', 'sliders-rows'], ['task', 'list-bullet'], ['tasks', 'list-checks'], ['todo options', 'more'], ['toggle', 'toggle-right'],
  ['tone', 'speaker'], ['unread', 'page-two-lines'],
].map((g) => (Array.isArray(g) ? g : [g, g]))
/* diamond-plus was retired after the walk (kol-icons CHANGELOG: the brand glyph is `ball`) — shown under its successor */
const PROMOTED = [['inbox', 'inbox'], ['highlighter', 'highlighter'], ['diamond-plus', 'ball'], ['lockup', 'lockup']]

const Tile = ({ name, glyph, surface, size = 24 }) => (
  <div data-glyph={name} className={`flex flex-col items-center gap-2 rounded-[var(--kol-float-list-r)] p-3 text-center ${floatSurfaceClass(surface)}`}>
    <IconLoader name={glyph} size={size} className="text-oq-96" />
    <span className="kol-float-label text-fg-88">{name}</span>
    {glyph !== name && <span className="kol-float-ruler text-fg-64">{glyph}</span>}
  </div>
)

export default function Icons() {
  return (
    <FamilyPage title="Icons" body={`${GLYPHS.length} glyphs walked from the float exploration — each by its name there, drawn by the kol-icons glyph that plays it; four promoted to the set.`}>
      {(surface) => (
        <>
          <Part name="104 glyphs walked">
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2">
              {GLYPHS.map(([name, glyph]) => <Tile key={name} name={name} glyph={glyph} surface={surface} />)}
            </div>
            <Button variant="float" tone="ghost" size="sm" iconRight="arrow-upright" href="/icons">Icons page</Button>
          </Part>

          <Part name="4 promoted">
            {PROMOTED.map(([name, glyph]) => <Tile key={name} name={name} glyph={glyph} surface={surface} size={48} />)}
            <Button variant="float" tone="ghost" size="sm" iconRight="arrow-upright" href="/components/icon">Component page</Button>
          </Part>
        </>
      )}
    </FamilyPage>
  )
}

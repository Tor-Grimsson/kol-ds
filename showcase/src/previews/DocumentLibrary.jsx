import { documentLibrary } from '@kolkrabbi/kol-framework'
import { DocumentLibrary } from '@kolkrabbi/kol-styleguide'
import { LIBRARY_MODULES, LIBRARY_FILES, LIBRARY_ROOT } from 'voyager-fixture/library'

export const stage = 'full'

/* VOYAGER's library — press, letters, a poster beside their originals — read by kol-framework's documentLibrary: a table
 * per folder, the originals opening in Quick Look (PDF IS · PDF EN told apart), the markdown downloading. The titles are
 * hashes here so the preview stays on its page; apps/document's /library opens them. */
const LIB = documentLibrary(LIBRARY_MODULES, { base: 'library', root: LIBRARY_ROOT, files: LIBRARY_FILES })
const HERE = { ...LIB, rows: LIB.rows.map((r) => ({ ...r, to: `#${r.id}` })) }

/* `langMark="flags"` (DocumentLangMark): kol-icons' flags in the Language column and under the twin PDFs; the poster
 * is given `fr` here, a code with no flag, so the text fallback shows beside them. */
const FLAGGED = { ...HERE, rows: HERE.rows.map((r) => (r.files?.some((f) => f.key.endsWith('.svg')) ? { ...r, lang: 'fr' } : r)) }

export default function DocumentLibraryPreview() {
  return (
    <div className="flex w-full flex-col gap-12">
      <DocumentLibrary library={HERE} />
      <DocumentLibrary library={FLAGGED} assetsView="icon" langMark="flags" />
    </div>
  )
}

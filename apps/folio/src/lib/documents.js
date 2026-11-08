/* THE LIBRARY — every folder of markdown in data/ read by kol-framework's `documentLibrary`, the same parser brand uses
 * (DocumentLibraryAndBoardParts, 2026-10-29): a section's index is its folders, each row a document with its kind, title,
 * date, language and the originals in kol-private (the bucket manifest). Was record's own `library()` — in
 * `_tmp/2026-10-29-record-library/`. */
import { documentLibrary } from '@kolkrabbi/kol-framework'
import { client } from '../folio/client'
import { glob } from './files'

const BUCKET = client().read('bucket')
const FILES = BUCKET.folders.flatMap((d) => d.files)

export const DOCUMENTS = documentLibrary(glob(/^data\/documents\/.+\.md$/), { base: 'documents', root: 'data/documents/', files: FILES })
export const FOUNDER = documentLibrary(glob(/^data\/founder\/.+\.md$/), { base: 'founder', root: 'data/founder/', files: FILES })

/* TWINS — one text in Icelandic and English, read as one document (plan 2026-11-05-library-connections W4.1). The first
 * key is the version that opens; the second hides under it, and the reader's flags switch between them in place. Only the
 * pairs the audit was sure of (same file name, language token only) — add a pair here when another is ruled. */
import { client } from '../folio/client'

/* the pairs are the corpus's own, so they come from the client (record: the tsh-bio IS/EN pair) */
export const TWINS = client().read('twins') ?? []

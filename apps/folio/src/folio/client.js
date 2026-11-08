/* THE DATA SEAM (plan-2026-11-05-folio 1.2) — everything Folio reads or writes goes through one client the app passes
   in (`<Folio client={…} />`); nothing in src/folio or src/lib fetches, globs or names a bucket.
     list()            → { [path]: source } every text file of the library (record: its data/ globs)
     list(bucket)      → Promise<[{ key, name, url }]> the images in a bucket (the editor's Image picker)
     read(name)        → an index by name: 'bucket' · 'originals' · 'vault-books' · 'duplicates' · 'timeline' · 'buckets' · 'signin'
     save({ file, source }) · create({ name, ext, title, shelf, source }) · convert({ file, ext, source }) → Promise
     meta()            → his edits (overrides) · meta({ key, ...fields }) → Promise, writes one
     upload({ bucket, name, source, type }) → Promise<{ url }>
     assetUrl(key)     → the URL of an original by its bucket key
     check({ ext, source }) → Promise<{ problems }> (optional — the code editor's lint)
   ponytail: one client per page, set once by <Folio> before its routes load; a second client needs a context. */
let current = null
export const setClient = (c) => { current = c }
export const client = () => current

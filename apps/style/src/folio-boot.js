/* Folio's modules read the library as they load (lib/books.js calls client() at import), so the fixture client is set
 * before any Folio part is imported. Imported first by rows.jsx; ES modules evaluate in import order. */
import { setClient } from '@folio/folio/client.js'
import { fixtureClient } from '@folio/fixture/client.js'

setClient(fixtureClient)

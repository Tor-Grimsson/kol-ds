/* VOYAGER — the fake client the brand apps render (apps review §6c-6, 2026-09-29): the files
 * (`assets.js`), the manifest in kol-brand's shape (`brand.js`) and the business data in the
 * client sites' shape (`business.js`). Import what you need; `VOYAGER` is all of it at once. */
import * as business from './business.js'
import * as assets from './assets.js'
import { VOYAGER_BRAND, VOYAGER_LOGO_SOURCES } from './brand.js'

export { VOYAGER_BRAND, VOYAGER_LOGO_SOURCES }
export * from './business.js'
export * from './assets.js'

export const VOYAGER = { brand: VOYAGER_BRAND, logoSources: VOYAGER_LOGO_SOURCES, business, assets }

/* apps/folio's root: takes the client, then loads the routes (their modules read the library as they load) */
import { lazy, Suspense } from 'react'
import { setClient } from './client'

const Routes = lazy(() => import('./FolioRoutes'))

export default function Folio({ client }) {
  setClient(client)
  return <Suspense fallback={null}><Routes /></Suspense>
}

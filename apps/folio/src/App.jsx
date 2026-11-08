/* apps/folio — Folio (kol-website record's src/folio, copied verbatim) on the fixture corpus, through one client */
import Folio from './folio/Folio'
import { fixtureClient } from './fixture/client'

export default function App() {
  return <Folio client={fixtureClient} />
}

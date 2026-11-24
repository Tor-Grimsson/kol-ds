import { useEffect, useState } from 'react'
import Board from './Board.jsx'
import Pair from './Pair.jsx'
import Kolbox from './Kolbox.jsx'

/* Three pages on the hash (the app is served at / in dev and /apps/style/ built, so a path route would need a fallback):
 * `#/` the styles board, `#/pair` the earlier default-beside-float page, kept as it was so he can compare rounds,
 * `#/kolbox` the kolbox stylesheet. */
const PAGES = { '/pair': Pair, '/kolbox': Kolbox }
const read = () => window.location.hash.replace(/^#/, '')

export default function App() {
  const [page, setPage] = useState(read)
  useEffect(() => {
    const on = () => { setPage(read()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const Page = PAGES[page] ?? Board
  return <Page />
}

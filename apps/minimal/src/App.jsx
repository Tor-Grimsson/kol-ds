import { lazy, Suspense, useEffect, useState } from 'react'

/* each screen carries the whole engine, so each loads only when opened */
const Labs = lazy(() => import('./labs/Labs.jsx'))
const Editor = lazy(() => import('./editor/Editor.jsx'))

/* Three places on the hash (#/ the start page, #/labs, #/editor), the way apps/style routes: no server fallback needed.
   The real Labs and the editor are separate apps, so neither screen carries a switch to the other; the start page
   holds the two links. */
const read = () => window.location.hash.replace(/^#/, '') || '/'

function Start() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-6 bg-ground font-sans text-fg">
      <h1 className="text-nav font-medium">Labs minimal</h1>
      <nav className="flex gap-4 text-nav">
        <a href="#/labs" className="text-muted underline-offset-4 hover:text-fg hover:underline">Labs</a>
        <a href="#/editor" className="text-muted underline-offset-4 hover:text-fg hover:underline">Editor</a>
      </nav>
    </main>
  )
}

export default function App() {
  const [path, setPath] = useState(read)
  useEffect(() => {
    const on = () => setPath(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  if (path === '/labs') return <Suspense fallback={null}><Labs /></Suspense>
  if (path === '/editor') return <Suspense fallback={null}><Editor /></Suspense>
  return <Start />
}

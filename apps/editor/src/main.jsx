import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App, { KOLBOX_SHEET } from './App.jsx'

/* one sheet per style (R1): the default's (index.css), or the kolbox style's alone (kolbox.css), as apps/kolbox loads it */
;(KOLBOX_SHEET ? import('./kolbox.css') : import('./index.css')).then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

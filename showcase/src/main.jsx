import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { GroupingProvider } from './lib/grouping.jsx'
import { FrontmatterProvider } from './lib/frontmatter.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GroupingProvider>
      <FrontmatterProvider>
        <App />
      </FrontmatterProvider>
      </GroupingProvider>
    </BrowserRouter>
  </StrictMode>,
)

/* The boot curtain (index.html) leaves once React has painted: two frames after the first commit,
   a 240ms fade (none under reduced motion — the CSS drops the transition), then out of the DOM. */
const boot = document.getElementById('kds-boot')
if (boot) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    boot.classList.add('is-done')
    setTimeout(() => boot.remove(), 300)
  }))
}

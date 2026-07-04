import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { GroupingProvider } from './lib/grouping.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GroupingProvider>
        <App />
      </GroupingProvider>
    </BrowserRouter>
  </StrictMode>,
)

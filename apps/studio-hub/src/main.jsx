import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { hideLoaderApp } from '@kolkrabbi/kol-framework'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/* the app loader leaves after the first commit — on Home the signed-out stage's intro takes it over instead */
hideLoaderApp()

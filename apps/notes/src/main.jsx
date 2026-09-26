import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ModalProvider } from '@kolkrabbi/kol-component/molecules/Modal'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* the DS dialogs for New / Delete — without it they fall back to native */}
    <ModalProvider>
      <App />
    </ModalProvider>
  </StrictMode>,
)

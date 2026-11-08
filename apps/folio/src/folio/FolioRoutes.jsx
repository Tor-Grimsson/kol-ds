/* record's /demo-4 routes at the root, /demo-3's mockups under /mockups (kol-website apps/record/src/App.jsx) */
import { Routes, Route } from 'react-router-dom'
import FolioLibrary from './FolioLibrary'
import FolioReader from './FolioReader'
import FolioArticle from './FolioArticle'
import FolioIdentity from './FolioIdentity'
import FolioShelf from './FolioShelf'
import FolioDocument from './FolioDocument'
import FolioWrite from './FolioWrite'

export default function FolioRoutes() {
  return (
    <Routes>
      <Route path="/mockups" element={<FolioLibrary />} />
      <Route path="/mockups/reader" element={<FolioReader />} />
      <Route path="/mockups/article" element={<FolioArticle />} />
      <Route path="/mockups/identity" element={<FolioIdentity />} />
      <Route path="/" element={<FolioShelf />} />
      <Route path="/new" element={<FolioWrite />} />
      <Route path="/edit/:collection/*" element={<FolioWrite />} />
      <Route path="/:collection/*" element={<FolioDocument />} />
    </Routes>
  )
}

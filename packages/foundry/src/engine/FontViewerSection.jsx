import React from 'react'
import FontViewer from './FontViewerComponent.jsx'

const FontViewerSection = ({ fontUrl, ...viewerProps }) => (
  <section className="fontviewer-section">
    <FontViewer fontUrl={fontUrl} {...viewerProps} />
  </section>
)

export default FontViewerSection

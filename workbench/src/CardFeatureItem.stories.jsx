import { CardFeatureItem } from '@kolkrabbi/kol-component'

const Glyph = (
  <svg
    viewBox="0 0 48 48"
    className="h-full w-full text-emphasis"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <rect x="8" y="8" width="32" height="32" rx="4" />
    <path d="M8 20h32M20 20v20" />
  </svg>
)

const gradient =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#6C5CE7"/><stop offset="1" stop-color="#00B894"/>' +
      '</linearGradient></defs><rect width="320" height="200" fill="url(#g)"/></svg>'
  )

const Frame = ({ children }) => (
  <div style={{ width: 280, height: 288 }} className="flex">
    {children}
  </div>
)

export const NodeVisual = () => (
  <Frame>
    <CardFeatureItem
      title="Design tokens"
      icon="grid-02"
      visual={Glyph}
      description="Themeable primitives, one source of truth."
    />
  </Frame>
)

export const ImageLink = () => (
  <Frame>
    <CardFeatureItem
      title="Documentation"
      icon="book-open"
      visual={gradient}
      imageAspectRatio="10/6"
      description="Guides, API tables, and live demos."
      href="https://example.com"
      backgroundColor="bg-surface-secondary"
    />
  </Frame>
)

export const IconFallback = () => (
  <Frame>
    <CardFeatureItem
      title="Iconography"
      icon="library"
      description="One loader, every glyph on demand."
    />
  </Frame>
)

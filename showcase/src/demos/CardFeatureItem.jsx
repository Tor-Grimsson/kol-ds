import { CardFeatureItem } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* ReactNode visual path — inline line-art that inherits the theme foreground
 * via currentColor (the same effect the `.svg` mask branch gives a URL). */
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

/* String visual path — a self-contained data-URI (renders through <img>
 * object-cover; not `.svg`-suffixed so it is NOT the mask branch). */
const gradient =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#6C5CE7"/><stop offset="1" stop-color="#00B894"/>' +
      '</linearGradient></defs><rect width="320" height="200" fill="url(#g)"/></svg>'
  )

export default function CardFeatureItemDemo() {
  return (
    <div className="flex w-full flex-col gap-6 md:h-72 md:flex-row">
      {/* Node visual + header icon, static (no href) */}
      <CardFeatureItem
        title="Design tokens"
        icon="grid"
        visual={Glyph}
        description="Themeable primitives, one source of truth."
      />

      {/* Image visual + external link (opens new tab, brighter hover border) */}
      <CardFeatureItem
        title="Documentation"
        icon="book-open"
        visual={gradient}
        imageAspectRatio="10/6"
        description="Guides, API tables, and live demos."
        href="https://example.com"
        backgroundColor="bg-surface-secondary"
      />

      {/* No visual → the 96px header-icon fallback fills the middle */}
      <CardFeatureItem
        title="Iconography"
        icon="scribble"
        description="One loader, every glyph on demand."
      />
    </div>
  )
}

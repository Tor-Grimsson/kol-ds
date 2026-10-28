/**
 * ProseImage — web's SanityImage (kol-website `components/ui/SanityImage.jsx`), the image source made a prop
 * (ArticleRendererHomeHeroSelection, kol-website 2026-10-28: *"make the image source a prop (`imageUrl(asset, opts)`) so no
 * Sanity client lives in the package"*). `imageUrl(image, { width, height })` returns the src — the consumer passes its own
 * Sanity builder (`(img, o) => builder.image(img).width(o.width)…auto('format').url()`). Without one, the asset's own
 * `url` (a query that expands `asset->`) is used as is.
 */
export default function ProseImage({ image, alt = '', width, height, className = '', loading = 'eager', imageUrl }) {
  if (!image || !image.asset) {
    return null
  }

  const src = imageUrl ? imageUrl(image, { width, height }) : image.asset.url

  if (!src) return null

  return (
    <img
      src={src}
      alt={alt || image.alt || ''}
      className={className}
      loading={loading}
    />
  )
}

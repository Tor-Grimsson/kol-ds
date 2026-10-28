/**
 * ImageBlock - Render images with optional labels and captions
 *
 * Handles Sanity image blocks; the caption'd shell (label eyebrow, bordered
 * aspect frame, figcaption) is the DS Figure atom.
 *
 * Carried from kol-website `components/prose/blocks/ImageBlock.jsx` (2026-10-28); the one change is `imageUrl`, handed
 * through to ProseImage so the package holds no Sanity client.
 *
 * @param {Object} value - Sanity image block data
 * @param {Object} value.asset - Image asset with URL
 * @param {string} value.alt - Alt text for accessibility
 * @param {string} value.label - Optional label (e.g., "Figure 1")
 * @param {string} value.caption - Optional caption text
 * @param {Function} [imageUrl] - `(image, { width, height }) => src`
 */
import { Figure } from '@kolkrabbi/kol-component'
import ProseImage from './ProseImage.jsx'

export default function ImageBlock({ value, imageUrl }) {
  const { asset, alt, label, caption } = value

  if (!asset) return null

  return (
    <Figure label={label} caption={caption}>
      <ProseImage
        image={value}
        alt={alt || ''}
        imageUrl={imageUrl}
        className="w-full h-full object-cover"
      />
    </Figure>
  )
}

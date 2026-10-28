/**
 * ImageBlock - Render images with optional labels and captions
 *
 * Handles Sanity image blocks; the caption'd shell (label eyebrow, bordered
 * aspect frame, figcaption) is the DS Figure atom.
 *
 * @param {Object} value - Sanity image block data
 * @param {Object} value.asset - Image asset with URL
 * @param {string} value.alt - Alt text for accessibility
 * @param {string} value.label - Optional label (e.g., "Figure 1")
 * @param {string} value.caption - Optional caption text
 */
import { Figure } from '@kolkrabbi/kol-component'
import SanityImage from '../../ui/SanityImage'

export default function ImageBlock({ value }) {
  const { asset, alt, label, caption } = value

  if (!asset) return null

  return (
    <Figure label={label} caption={caption}>
      <SanityImage
        image={value}
        alt={alt || ''}
        className="w-full h-full object-cover"
      />
    </Figure>
  )
}

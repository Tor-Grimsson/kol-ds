import Figure from '../atoms/Figure.jsx'
import Image from './Image.jsx'

/**
 * ImageBlock — a captioned prose image: the DS Figure shell (optional label,
 * aspect-locked bordered frame, optional figcaption) wrapping a cover-fit DS
 * Image. The long-form counterpart to VideoBlock — both compose the same
 * Figure atom, so the frame chrome lives in one place.
 *
 * De-Sanitized: takes a resolved `src` string (no CMS `value` object, no
 * SanityImage URL builder). Missing `src` degrades to Image's own
 * AssetPlaceholder rather than rendering an empty frame.
 *
 * Label and caption render exactly as authored — no casing transforms.
 *
 * @param {string} src      resolved image URL
 * @param {string} alt      alt text
 * @param {string} label    small mono label above the frame
 * @param {string} caption  figcaption below the frame
 * @param {string} aspect   CSS aspect-ratio for the frame (default '5/3')
 * @param {string} className extra classes on the <figure>
 */
export default function ImageBlock({ src, alt = '', label, caption, aspect = '5/3', className = '' }) {
  return (
    <Figure label={label} caption={caption} aspect={aspect} className={className}>
      <Image
        src={src}
        alt={alt}
        className="object-cover"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </Figure>
  )
}

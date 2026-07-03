import Image from './Image'

/**
 * FramedMediaBand — full-width media breather band: a centered, aspect-locked
 * frame (bordered surface-secondary panel, rounded) holding one object-cover
 * image. Extracted from the foundry TypefacePage, where it sat inlined 5x
 * verbatim between content sections. The double radius (`rounded` panel,
 * `rounded-[4px]` image) is intentional — the image nests inside the border.
 *
 * Presentational — the caller passes finished `src`/`srcSet` strings; any
 * CDN size-ladder generation stays at the call site. `media` swaps an
 * arbitrary node into the frame in place of the Image (video, canvas); it
 * should self-size with `w-full h-full`.
 *
 * @param {string}    src         image src (a finished URL, no ladder logic here)
 * @param {string}    srcSet      responsive srcSet, precomputed by the caller
 * @param {string}    sizes       img sizes attr
 * @param {string}    alt         alt text, authored at the call site
 * @param {ReactNode} media       replaces the Image inside the frame
 * @param {ReactNode} caption     optional caption line under the frame
 * @param {string}    aspectRatio frame aspect ratio, CSS value (e.g. '2/1')
 * @param {string}    maxWidth    frame max-width class
 * @param {string}    className   section-level extras (e.g. 'mt-12')
 */
export default function FramedMediaBand({
  src,
  srcSet,
  sizes = '(max-width: 1400px) 100vw, 1400px',
  alt = '',
  media,
  caption,
  aspectRatio = '2/1',
  maxWidth = 'max-w-[1400px]',
  className = '',
}) {
  return (
    <section className={`w-full overflow-hidden py-16 ${className}`.trim()}>
      <div className={`${maxWidth} mx-auto`}>
        <div style={{ aspectRatio }}>
          <div className="w-full h-full bg-surface-secondary rounded border border-fg-08">
            {media ?? (
              <Image
                src={src}
                srcSet={srcSet}
                sizes={sizes}
                alt={alt}
                className="w-full h-full object-cover rounded-[4px]"
              />
            )}
          </div>
        </div>
        {caption && <p className="kol-mono-12 text-fg-48 mt-3">{caption}</p>}
      </div>
    </section>
  )
}

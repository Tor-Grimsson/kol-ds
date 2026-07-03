import Figure from '../atoms/Figure.jsx'

/**
 * getEmbedUrl — turn a YouTube/Vimeo share URL into its embeddable player URL.
 * Kept verbatim from the source; it is the only real logic in this block.
 * Returns null for anything it can't parse (→ the file player is used).
 */
export function getEmbedUrl(url) {
  if (!url) return null
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return null
}

/**
 * VideoBlock — a captioned prose video: the DS Figure shell (optional label,
 * aspect-locked bordered frame, optional figcaption) wrapping either an
 * <iframe> embed (YouTube/Vimeo, auto-parsed from `url`) or a native <video>
 * file player. Embed wins when `url` parses; otherwise the `file` player runs.
 * The long-form sibling of ImageBlock — both compose the same Figure atom.
 *
 * De-Sanitized: flat props, no CMS `value` object. Renders nothing when
 * neither an embed nor a file source resolves. Label/caption authored as-is.
 *
 * @param {string}  url      YouTube/Vimeo share URL → iframe embed
 * @param {string}  file     direct video file URL → native <video>
 * @param {string}  poster   poster image for the file player
 * @param {string}  label    small mono label above the frame
 * @param {string}  caption  figcaption below the frame
 * @param {string}  aspect   CSS aspect-ratio for the frame (default '5/3')
 * @param {boolean} autoplay autoplay the file player (forces muted)
 * @param {boolean} muted    mute the file player (forced true when autoplay)
 * @param {boolean} controls show file-player controls (default true)
 * @param {boolean} loop     loop file playback
 * @param {string}  className extra classes on the <figure>
 */
export default function VideoBlock({
  url,
  file,
  poster,
  label,
  caption,
  aspect = '5/3',
  autoplay = false,
  muted = false,
  controls = true,
  loop = false,
  className = '',
}) {
  const embedSrc = getEmbedUrl(url)
  if (!embedSrc && !file) return null

  const isMuted = autoplay ? true : muted

  return (
    <Figure label={label} caption={caption} aspect={aspect} className={className}>
      {embedSrc ? (
        <iframe
          src={embedSrc}
          title={label || caption || 'Embedded video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          style={{ border: 0 }}
        />
      ) : (
        <video
          src={file}
          poster={poster}
          controls={controls}
          controlsList="nodownload noplaybackrate noremoteplayback"
          autoPlay={autoplay}
          loop={loop}
          muted={isMuted}
          disablePictureInPicture
          disableRemotePlayback
          playsInline
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </Figure>
  )
}

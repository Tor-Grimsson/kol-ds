import { Figure } from '@kolkrabbi/kol-component'

function getEmbedUrl(url) {
  if (!url) return null
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return null
}

const VideoBlock = ({ value }) => {
  const embedSrc = getEmbedUrl(value?.embedUrl)
  const videoUrl = value?.file?.asset?.url || value?.file?.url

  if (!embedSrc && !videoUrl) return null

  const posterUrl = value?.poster?.asset?.url || value?.poster?.url
  const autoplay = Boolean(value?.autoplay)
  const muted = autoplay ? true : Boolean(value?.muted)
  const controls = value?.controls !== false
  const loop = Boolean(value?.loop)

  return (
    // File videos take their natural ratio (aspect="") so the frame hugs the
    // media; embeds have no intrinsic size, so the player-standard 16/9.
    <Figure label={value?.label} caption={value?.caption} aspect={embedSrc ? '16/9' : ''}>
      {embedSrc ? (
        <iframe
          src={embedSrc}
          title={value?.label || value?.caption || 'Embedded video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        <video
          src={videoUrl}
          poster={posterUrl}
          aria-label={value?.label || value?.caption || 'Embedded video'}
          controls={controls}
          controlsList="nodownload noplaybackrate noremoteplayback"
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          disablePictureInPicture
          disableRemotePlayback
          playsInline
          className="block w-full h-auto"
        />
      )}
    </Figure>
  )
}

export default VideoBlock

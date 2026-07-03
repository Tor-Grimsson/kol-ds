import { VideoBlock } from '@kolkrabbi/kol-component'

export const stage = 'md'

// Poster-only: a data-URI poster over an empty inline source — nothing is
// fetched, the native player shows the poster frame with its controls.
const poster = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 450"><rect width="750" height="450" fill="#1d1d21"/><line x1="0" y1="150" x2="750" y2="150" stroke="#3a3a41" stroke-width="1.5"/><line x1="0" y1="300" x2="750" y2="300" stroke="#3a3a41" stroke-width="1.5"/><circle cx="375" cy="225" r="52" fill="none" stroke="#8a8a94" stroke-width="2"/><path d="M362 200 L362 250 L402 225 Z" fill="#8a8a94"/></svg>',
)}`

export default function VideoBlockDemo() {
  return (
    <VideoBlock
      file="data:,"
      poster={poster}
      label="Reel 02"
      caption="Studio walkthrough — the press in motion, cut to a single continuous take."
      controls
      aspect="5/3"
    />
  )
}

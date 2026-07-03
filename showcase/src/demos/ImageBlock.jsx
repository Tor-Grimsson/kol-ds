import { ImageBlock } from '@kolkrabbi/kol-component'

export const stage = 'md'

const src = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 450"><rect width="750" height="450" fill="#1d1d21"/><rect x="90" y="70" width="570" height="310" fill="none" stroke="#8a8a94" stroke-width="2"/><circle cx="375" cy="225" r="110" fill="none" stroke="#5a5a63" stroke-width="2"/><line x1="90" y1="225" x2="660" y2="225" stroke="#3a3a41" stroke-width="1.5"/><line x1="375" y1="70" x2="375" y2="380" stroke="#3a3a41" stroke-width="1.5"/></svg>',
)}`

export default function ImageBlockDemo() {
  return (
    <ImageBlock
      src={src}
      alt="Concentric registration marks over a centered crosshair"
      label="Fig. 3"
      caption="Registration marks align the plates before the press run — a full pass takes four passes of ink."
      aspect="5/3"
    />
  )
}

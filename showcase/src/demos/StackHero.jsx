import { StackHero } from '@kolkrabbi/kol-content'

export const stage = 'full'

const cover = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200"><rect width="1600" height="1200" fill="#1d1d21"/><circle cx="800" cy="480" r="420" fill="none" stroke="#8a8a94" stroke-width="2"/><circle cx="800" cy="480" r="260" fill="none" stroke="#5a5a63" stroke-width="2"/><circle cx="800" cy="480" r="100" fill="none" stroke="#8a8a94" stroke-width="2"/><line x1="0" y1="480" x2="1600" y2="480" stroke="#3a3a41" stroke-width="2"/><line x1="800" y1="0" x2="800" y2="1200" stroke="#3a3a41" stroke-width="2"/></svg>',
)}`

export default function StackHeroDemo() {
  return (
    <StackHero
      title="Notes from the print room"
      description="A running journal on typography, tooling, and the small craft decisions behind a design system."
      src={cover}
      alt=""
    />
  )
}

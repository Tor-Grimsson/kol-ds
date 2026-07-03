import { Figure } from '@kolkrabbi/kol-component'

export const stage = 'md'

const art = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300"><rect width="500" height="300" fill="#1d1d21"/><circle cx="250" cy="150" r="90" fill="none" stroke="#8a8a94" stroke-width="1.5"/><line x1="0" y1="150" x2="500" y2="150" stroke="#3a3a41" stroke-width="1"/></svg>',
)}`

export default function FigureDemo() {
  return (
    <Figure label="Fig. 01" caption="An aspect-locked frame with label and caption." aspect="5/3">
      <img src={art} alt="Placeholder artwork" className="h-full w-full object-cover" />
    </Figure>
  )
}

import { Carousel } from '@kolkrabbi/kol-component'

const Slide = ({ n }) => (
  <div
    style={{
      width: 200,
      height: 260,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      background: 'var(--kol-fg-04)',
      border: '1px solid var(--kol-fg-16)',
      fontFamily: 'monospace',
      fontSize: 32,
    }}
  >
    {n}
  </div>
)

export const Default = () => (
  <Carousel>
    {[1, 2, 3, 4, 5, 6].map((n) => <Slide key={n} n={n} />)}
  </Carousel>
)

export const Looping = () => (
  <Carousel options={{ align: 'start', loop: true, dragFree: false, containScroll: 'trimSnaps' }}>
    {['A', 'B', 'C', 'D'].map((n) => <Slide key={n} n={n} />)}
  </Carousel>
)

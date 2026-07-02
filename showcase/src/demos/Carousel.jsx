import { Carousel } from '@kolkrabbi/kol-component'

const SLIDES = [
  { label: 'Slide 01', tint: 'var(--kol-fg-04)' },
  { label: 'Slide 02', tint: 'var(--kol-fg-08)' },
  { label: 'Slide 03', tint: 'var(--kol-fg-12)' },
  { label: 'Slide 04', tint: 'var(--kol-fg-16)' },
  { label: 'Slide 05', tint: 'var(--kol-fg-20)' },
]

export const stage = 'full'

export default function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xl">
      {SLIDES.map((slide) => (
        <div
          key={slide.label}
          className="flex items-center justify-center rounded-[4px] border border-fg-12 font-mono text-emphasis"
          style={{ aspectRatio: '16 / 9', background: slide.tint }}
        >
          {slide.label}
        </div>
      ))}
    </Carousel>
  )
}

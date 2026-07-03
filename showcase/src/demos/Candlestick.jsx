import { Candlestick } from '../workshop/dashboards/index.js'

export const stage = 'md'

// Inline fixture — OHLC bars; variant 'accent' (up) vs 'neutral' (down).
const data = [
  { open: 42, high: 58, low: 38, close: 55, variant: 'accent' },
  { open: 55, high: 62, low: 51, close: 49, variant: 'neutral' },
  { open: 49, high: 60, low: 46, close: 57, variant: 'accent' },
  { open: 57, high: 68, low: 54, close: 64, variant: 'accent' },
  { open: 64, high: 66, low: 52, close: 55, variant: 'neutral' },
  { open: 55, high: 72, low: 53, close: 70, variant: 'accent' },
  { open: 70, high: 78, low: 66, close: 68, variant: 'neutral' },
  { open: 68, high: 84, low: 64, close: 81, variant: 'accent' },
  { open: 81, high: 88, low: 74, close: 76, variant: 'neutral' },
  { open: 76, high: 92, low: 73, close: 90, variant: 'accent' },
]

export default function CandlestickDemo() {
  return <Candlestick data={data} height={240} />
}

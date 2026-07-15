import { AssetTable } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

/* Preview cell node — a framed swatch/mark specimen. Consumer-supplied. */
const Preview = ({ children, bg }) => (
  <span
    className="inline-flex h-10 w-16 items-center justify-center rounded-[3px] border border-fg-08 text-emphasis"
    style={{ background: bg }}
  >
    {children}
  </span>
)

const MiniWordmark = (
  <svg viewBox="0 0 120 40" width="48" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="KOL">
    <text x="60" y="30" textAnchor="middle" fontFamily="'Right Grotesk', sans-serif" fontWeight="700" fontSize="30" fill="currentColor">
      KOL
    </text>
  </svg>
)

const ROWS = [
  {
    id: 'wordmark-svg',
    name: 'KOL wordmark',
    preview: <Preview>{MiniWordmark}</Preview>,
    format: 'SVG',
    dimensions: '120 × 40',
    href: '/kol-images/tt-01.jpg',
    filename: 'kol-wordmark.svg',
  },
  {
    id: 'logomark-svg',
    name: 'KOL logomark',
    preview: <Preview bg="#222D3D"><span className="kol-helper-12">K</span></Preview>,
    format: 'SVG',
    dimensions: '40 × 40',
    href: '/kol-images/tt-02.jpg',
    filename: 'kol-logomark.svg',
  },
  {
    id: 'wordmark-png',
    name: 'KOL wordmark',
    preview: <Preview bg="#FFCF33"><span className="kol-helper-12" style={{ color: '#222D3D' }}>KOL</span></Preview>,
    format: 'PNG @2x',
    dimensions: '240 × 80',
    onDownload: (row) => console.log('download', row.name),
  },
  {
    id: 'swatch-yellow',
    name: 'Yellow 300 chip',
    preview: <Preview bg="#FFCF33" />,
    format: 'SVG',
    dimensions: '48 × 48',
    href: '/kol-images/tt-03.jpg',
    filename: 'kol-yellow-300.svg',
  },
]

export default function AssetTableDemo() {
  return <AssetTable rows={ROWS} caption="KOL brand asset manifest" />
}

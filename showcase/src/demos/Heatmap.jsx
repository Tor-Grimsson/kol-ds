import { Heatmap } from '../workshop/dashboards/index.js'

export const stage = 'md'

// Inline fixture — deploy activity as a day × 2-hour-bucket grid (7 rows × 12 cols).
const data = [
  [0, 0, 1, 0, 2, 3, 4, 2, 1, 0, 0, 0],
  [1, 0, 0, 2, 5, 6, 4, 3, 2, 1, 0, 0],
  [0, 1, 0, 3, 6, 8, 5, 4, 2, 1, 1, 0],
  [0, 0, 2, 4, 7, 9, 6, 5, 3, 2, 0, 0],
  [1, 0, 1, 3, 5, 7, 6, 4, 3, 1, 0, 1],
  [0, 0, 0, 1, 2, 3, 2, 2, 1, 0, 0, 0],
  [0, 1, 0, 0, 1, 2, 3, 1, 1, 0, 0, 0],
]

const rows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const cols = ['0h', '', '4h', '', '8h', '', '12h', '', '16h', '', '20h', '']

export default function HeatmapDemo() {
  return <Heatmap data={data} rows={rows} cols={cols} />
}

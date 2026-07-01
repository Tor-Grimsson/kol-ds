import { TransparentX } from '@kolkrabbi/kol-component'

const Box = ({ children }) => (
  <div
    style={{
      position: 'relative',
      width: 48,
      height: 48,
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: 4,
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
)

export const Default = () => (
  <Box>
    <TransparentX />
  </Box>
)

export const Tones = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    {['warning', 'error', 'info', 'success'].map((t) => (
      <Box key={t}>
        <TransparentX tone={t} />
      </Box>
    ))}
  </div>
)

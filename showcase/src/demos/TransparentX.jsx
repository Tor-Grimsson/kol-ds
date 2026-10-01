import { TransparentX } from '@kolkrabbi/kol-component'

export const tones = ['warning', 'error', 'info', 'success']

export default function TransparentXDemo({ tone = 'warning' }) {
  return (
    <>
      <span className="relative inline-flex border border-fg-08 rounded overflow-hidden" style={{ width: 24, height: 24 }}>
        <TransparentX tone={tone} />
      </span>
      <span className="relative inline-flex border border-fg-08 rounded overflow-hidden" style={{ width: 32, height: 32 }}>
        <TransparentX tone={tone} />
      </span>
    </>
  )
}

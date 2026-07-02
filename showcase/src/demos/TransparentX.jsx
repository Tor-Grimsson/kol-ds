import { TransparentX } from '@kolkrabbi/kol-component'

export default function TransparentXDemo() {
  return (
    <>
      <span className="relative inline-flex border border-fg-08 rounded overflow-hidden" style={{ width: 24, height: 24 }}>
        <TransparentX />
      </span>
      <span className="relative inline-flex border border-fg-08 rounded overflow-hidden" style={{ width: 32, height: 32 }}>
        <TransparentX />
      </span>
    </>
  )
}

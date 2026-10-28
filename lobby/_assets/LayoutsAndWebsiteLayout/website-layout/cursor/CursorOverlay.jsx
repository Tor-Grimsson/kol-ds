import React from 'react'
import { useCursor } from './CursorContext'

export default function CursorOverlay() {
  const { position, visible } = useCursor()

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 60,
      }}
    >
      <div
        className="bg-fg-08 border-auto"
        style={{
          position: 'absolute',
          transform: `translate(${position.x - 16}px, ${position.y - 16}px)`,
          width: 32,
          height: 32,
          borderRadius: '999px',
          border: '1px solid',
          opacity: visible ? 1 : 0,
          transition: 'opacity 150ms ease',
        }}
      />
    </div>
  )
}

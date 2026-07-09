import { useEffect, useRef } from 'react'
import { Button } from '@kolkrabbi/kol-component'

const NotationPanel = ({ notationPairs = [], activePly = 0, onSelectPly = () => {}, isLoading = false }) => {
  const activeRef = useRef(null)

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activePly])
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 text-fg-48">
        <div className="h-3 bg-oq-04 rounded animate-pulse" />
        <div className="h-3 bg-oq-04 rounded animate-pulse" />
        <div className="h-3 bg-oq-04 rounded animate-pulse" />
      </div>
    )
  }

  if (!notationPairs.length) {
    return <p className="kol-mono-12 text-fg-64">No notation available for this game.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {notationPairs.map((pair) => {
        const isWhiteActive = pair.white?.ply === activePly
        const isBlackActive = pair.black?.ply === activePly

        return (
          <div key={pair.moveNumber} className="flex items-start gap-4" ref={isWhiteActive || isBlackActive ? activeRef : null}>
            <span className="kol-mono-12 text-fg-64 w-6 text-right">{pair.moveNumber}.</span>
            <div className="flex flex-1 gap-8">
              <Button
                variant="primary"
                size="sm"
                disabled={!pair.white}
                selected={isWhiteActive}
                onClick={() => pair.white && onSelectPly(pair.white.ply)}
              >
                {pair.white?.san ?? '—'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!pair.black}
                selected={isBlackActive}
                onClick={() => pair.black && onSelectPly(pair.black.ply)}
              >
                {pair.black?.san ?? '—'}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NotationPanel

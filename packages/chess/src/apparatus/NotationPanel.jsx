import React from 'react'
import { Button } from '@kolkrabbi/kol-component'

/* no autoscroll on playback (2026-07-15 user ruling): the list plays without
 * stealing scroll — the user brings the active move into view if they want */
const NotationPanel = ({ notationPairs = [], activePly = 0, onSelectPly = () => {}, isLoading = false }) => {
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

  /* one grid, three columns (number · white · black) — every move lands on
   * the same column edge regardless of SAN length; tight y rhythm */
  return (
    <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-3 gap-y-1">
      {notationPairs.map((pair) => {
        const isWhiteActive = pair.white?.ply === activePly
        const isBlackActive = pair.black?.ply === activePly

        return (
          <React.Fragment key={pair.moveNumber}>
            <span className="kol-mono-12 text-fg-64 text-right">
              {pair.moveNumber}.
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              disabled={!pair.white}
              selected={isWhiteActive}
              onClick={() => pair.white && onSelectPly(pair.white.ply)}
            >
              {pair.white?.san ?? '—'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              disabled={!pair.black}
              selected={isBlackActive}
              onClick={() => pair.black && onSelectPly(pair.black.ply)}
            >
              {pair.black?.san ?? '—'}
            </Button>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default NotationPanel

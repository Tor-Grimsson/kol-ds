import React from 'react'
import { Button } from '@kolkrabbi/kol-component'

/* no autoscroll on playback (2026-07-15 user ruling): the list plays without
 * stealing scroll — the user brings the active move into view if they want */

/* Sideline move label: `3.Nc3` / `3...Nf6` on the first move of each color,
 * bare SAN after — mirrors PGN variation numbering. */
const sidelineMoveLabel = (line, index) => {
  const ply = line.parentPly + 1 + index
  const moveNumber = Math.ceil(ply / 2)
  if (ply % 2 === 1) return `${moveNumber}.${line.moves[index].san}`
  if (index === 0) return `${moveNumber}...${line.moves[index].san}`
  return line.moves[index].san
}

const SidelineRow = ({ line, activeSideline, onSelectSidelineMove }) => (
  <div className="col-span-3 ml-2 flex flex-wrap items-center gap-x-1 border-l border-oq-08 pl-3">
    <span className="kol-mono-12 text-fg-48">(</span>
    {line.moves.map((move, index) => (
      <Button
        key={`${line.id}-${index}`}
        variant="ghost"
        size="sm"
        selected={activeSideline?.id === line.id && activeSideline?.index === index}
        onClick={() => onSelectSidelineMove(line.id, index)}
      >
        {sidelineMoveLabel(line, index)}
      </Button>
    ))}
    <span className="kol-mono-12 text-fg-48">)</span>
  </div>
)

/* Inline sidelines (brief 3.0): each sideline renders as an indented row
 * right under the move pair it branches from — the chess.com shape. */
const NotationPanel = ({
  notationPairs = [],
  activePly = 0,
  onSelectPly = () => {},
  isLoading = false,
  sidelines = [],
  activeSideline = null,
  onSelectSidelineMove = () => {}
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 text-fg-48">
        <div className="h-3 bg-oq-04 rounded animate-pulse" />
        <div className="h-3 bg-oq-04 rounded animate-pulse" />
        <div className="h-3 bg-oq-04 rounded animate-pulse" />
      </div>
    )
  }

  if (!notationPairs.length && !sidelines.length) {
    return <p className="kol-mono-12 text-fg-64">No notation available for this game.</p>
  }

  /* a sideline anchors to the pair holding the move it replaces (its first
   * move is the alternative to mainline ply parentPly + 1) */
  const sidelinesForPair = (moveNumber) =>
    sidelines.filter((line) => Math.ceil((line.parentPly + 1) / 2) === moveNumber)
  const lastMoveNumber = notationPairs.length
  const trailingSidelines = sidelines.filter(
    (line) => Math.ceil((line.parentPly + 1) / 2) > lastMoveNumber
  )

  /* one grid, three columns (number · white · black) — every move lands on
   * the same column edge regardless of SAN length; tight y rhythm */
  return (
    <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-3 gap-y-1">
      {notationPairs.map((pair) => {
        const isWhiteActive = pair.white?.ply === activePly && !activeSideline
        const isBlackActive = pair.black?.ply === activePly && !activeSideline

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
            {sidelinesForPair(pair.moveNumber).map((line) => (
              <SidelineRow
                key={line.id}
                line={line}
                activeSideline={activeSideline}
                onSelectSidelineMove={onSelectSidelineMove}
              />
            ))}
          </React.Fragment>
        )
      })}
      {trailingSidelines.map((line) => (
        <SidelineRow
          key={line.id}
          line={line}
          activeSideline={activeSideline}
          onSelectSidelineMove={onSelectSidelineMove}
        />
      ))}
    </div>
  )
}

export default NotationPanel

import React, { useState } from 'react'
import { useChessControls } from '../context/ChessControlsContext'

const VariationTree = () => {
  const { moveTree, userVariations, moveIndex, setMoveIndex, isLoading, removeUserVariation } =
    useChessControls()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-3 bg-oq-04 rounded animate-pulse" />
        <div className="h-3 bg-oq-04 rounded animate-pulse" />
        <div className="h-3 bg-oq-04 rounded animate-pulse" />
      </div>
    )
  }

  if (!moveTree?.length) {
    return <p className="kol-mono-xs text-fg-64">No variation data.</p>
  }

  return (
    <div className="flex flex-col gap-2 max-h-[300px] overflow-auto pr-1">
      <VariationBranch
        moves={moveTree}
        depth={0}
        moveIndex={moveIndex}
        onSelectPly={setMoveIndex}
      />
      {userVariations?.length ? (
        <div className="mt-3 border-t border-oq-08 pt-3">
          <div className="kol-mono-xxs uppercase tracking-[0.2em] text-fg-50 mb-2">
            Custom Variations
          </div>
          {userVariations.map((variation) => (
            <div key={variation.id} className="flex flex-col gap-1 mb-2">
              <div className="flex items-center justify-between text-fg-80">
                <span className="kol-mono-xs">{variation.label}</span>
                <button
                  type="button"
                  className="kol-mono-xxs text-status-danger hover:text-status-danger-foreground"
                  onClick={() => removeUserVariation(variation.id)}
                >
                  remove
                </button>
              </div>
              <div className="flex flex-wrap gap-2 text-fg-70">
                {variation.moves.map((move, idx) => (
                  <button
                    type="button"
                    key={`${variation.id}-${idx}`}
                    className={`kol-mono-xxs px-2 py-1 rounded border border-oq-12 ${
                      move.ply === moveIndex ? 'text-accent-primary border-accent-primary' : ''
                    }`}
                    onClick={() => setMoveIndex(move.ply)}
                  >
                    {move.san}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

const VariationBranch = ({ moves, depth, moveIndex, onSelectPly, label }) => {
  if (!moves?.length) return null

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <div className="kol-mono-xxs uppercase tracking-[0.2em] text-fg-50">{label}</div>
      ) : null}
      {moves.map((node, idx) => (
        <VariationNode
          key={`${node.id}-${idx}`}
          node={node}
          depth={depth}
          moveIndex={moveIndex}
          onSelectPly={onSelectPly}
        />
      ))}
    </div>
  )
}

const VariationNode = ({ node, depth, moveIndex, onSelectPly }) => {
  const [expanded, setExpanded] = useState(depth === 0)
  const isActive = node.ply === moveIndex

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => onSelectPly(node.ply)}
        className={`flex items-center justify-between rounded px-2 py-1 text-left transition-colors ${
          isActive ? 'bg-oq-08 text-accent-primary' : 'text-fg-80 hover:text-fg-90'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <span className="kol-mono-xs">
          {node.moveNumber}
          {node.color === 'black' ? '...' : '.'} {node.san}
        </span>
        {node.variations?.length ? (
          <span
            className="text-fg-50 text-xs ml-3"
            onClick={(event) => {
              event.stopPropagation()
              setExpanded((value) => !value)
            }}
          >
            {expanded ? '−' : '+'} {node.variations.length}
          </span>
        ) : null}
      </button>

      {expanded &&
        node.variations?.map((variation, idx) => (
          <div key={`${node.id}-variation-${idx}`} className="border-l border-oq-08 ml-2 pl-2">
            <VariationBranch
              moves={variation}
              depth={depth + 1}
              moveIndex={moveIndex}
              onSelectPly={onSelectPly}
              label={idx === 0 ? 'Variation' : undefined}
            />
          </div>
        ))}
    </div>
  )
}

export default VariationTree

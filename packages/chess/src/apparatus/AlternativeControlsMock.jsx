import React, { useState } from 'react'
import { Button, Divider } from '@kolkrabbi/kol-component'
import { useChessControls } from '../context/ChessControlsContext'
import NotationPanel from './NotationPanel'
import PlaybackControls from './PlaybackControls'
import SetupPanel from './SetupPanel.jsx'
import PiecePalette from './PiecePalette.jsx'
import GamePicker from './GamePicker.jsx'
import MaterialSummary from './MaterialSummary.jsx'
import useChessKeyboardShortcuts from './useChessKeyboardShortcuts.js'

/**
 * AlternativeControlsMock — the reference rail composition: SetupPanel,
 * PiecePalette, GamePicker, MaterialSummary, notation and playback stacked
 * in one column. Since 0.5.2 every block is its own exported component and
 * this is just the default arrangement — consumers composing their own rail
 * should use the blocks directly.
 */
const AlternativeControlsMock = () => {
  const {
    notationPairs,
    moveIndex,
    selectPly,
    sidelines,
    activeSideline,
    goToSidelineMove,
    isLoading
  } = useChessControls()

  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false)

  useChessKeyboardShortcuts()

  return (
    <div className="w-full min-h-full lg:h-full bg-oq-02 flex flex-col text-fg-88">
      <SetupPanel className={`p-3 ${mobileSettingsOpen ? '' : 'max-lg:hidden'}`} />

      <PiecePalette className="hidden p-3 border-t border-oq-08 bg-fg-02 lg:block" />

      <div className="flex flex-col gap-4 flex-1 p-3 min-h-0">
        <GamePicker
          className="flex-shrink-0"
          actions={
            <Button
              variant="ghost"
              size="sm"
              iconOnly="settings-01"
              className="lg:hidden"
              selected={mobileSettingsOpen}
              onClick={() => setMobileSettingsOpen((v) => !v)}
              title="Board settings"
              aria-label="Board settings"
            />
          }
        />

        <Divider />

        <MaterialSummary className="flex-shrink-0" />

        {/* notation is the rail's primary content — always visible, fills the
          * remaining married height with internal scroll (disclosure removed
          * 2026-07-15: it only existed because the pre-marriage rail could
          * grow unbounded) */}
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <div className="flex items-center pt-4 border-t border-oq-08 flex-shrink-0">
            <span className="kol-helper-12 text-fg-80">NOTATION</span>
          </div>
          <div className="rounded bg-oq-04 p-3 overflow-auto flex-1 min-h-0">
            <NotationPanel
              notationPairs={notationPairs}
              activePly={moveIndex}
              onSelectPly={selectPly}
              isLoading={isLoading}
              sidelines={sidelines}
              activeSideline={activeSideline}
              onSelectSidelineMove={goToSidelineMove}
            />
          </div>
        </div>

        <div className="order-first flex-shrink-0 lg:order-none">
          {/* the ONE playback unit; mobile floats it to the top, above the picker */}
          <PlaybackControls />
        </div>
      </div>
    </div>
  )
}

export default AlternativeControlsMock

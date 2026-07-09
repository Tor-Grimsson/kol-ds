import { Icon } from '@kolkrabbi/kol-icons'
import { ChessPiece } from '../index.js'
import { Button, Dropdown } from '@kolkrabbi/kol-component'

const getPieceSize = (size) => {
  const sizeMap = {
    sm: '28px',
    md: '40px',
    lg: '52px'
  }
  return sizeMap[size] || sizeMap.lg
}

const ChessSidebar = ({
  selectedGame = null,
  selectedGameId = null,
  sampleGames = [],
  moveIndex = 0,
  onSelectGame = () => {},
  onGoToStart = () => {},
  onStepBackward = () => {},
  onStepForward = () => {},
  onGoToEnd = () => {},
  onTogglePlayback = () => {},
  size = 'desktop',
  className = '',
  variant = 'default',
  onToggleFullscreen = null,
  isFullscreen = false
}) => {
  const piecePixelSize = getPieceSize(size)
  const getSidebarClass = (variant) => {
    switch (variant) {
      case 'minimal':
        return 'board-playback__sidebar--minimal'
      case 'plain':
        return 'board-playback__sidebar--plain'
      default:
        return 'board-playback__sidebar'
    }
  }
  const sidebarClass = getSidebarClass(variant)
  const showFullscreenToggle = typeof onToggleFullscreen === 'function'
  const fullscreenLabel = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'
  const toolbarButton = (iconName, onClick, ariaLabel) => (
    <Button variant="primary" size="sm" iconOnly={iconName} onClick={onClick} aria-label={ariaLabel} />
  )

  return (
    <aside className={`${sidebarClass} ${className}`}>
      <header className="board-playback__sidebar-header">
        <div className="flex items-center justify-between gap-3">
          <span className="board-playback__badge">{'{}'} Setup Position</span>
          {showFullscreenToggle ? (
            <Button variant="outline" size="sm" onClick={onToggleFullscreen}>
              {fullscreenLabel}
            </Button>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="board-playback__title">
            {selectedGame?.player?.username ?? 'Player'} vs{' '}
            {selectedGame?.opponent?.username ?? 'Opponent'}
          </h3>
          <p className="board-playback__meta">
            {selectedGame?.timeClass ?? 'blitz'} · {selectedGame?.timeControl ?? '180'} · move{' '}
            {moveIndex}
          </p>
        </div>

        <Dropdown
          value={selectedGameId ?? ''}
          onChange={(value) => onSelectGame(value || null)}
          options={(sampleGames || []).map((game) => ({
            value: game.id,
            label: `${game.player?.username} vs ${game.opponent?.username}`
          }))}
          className="board-playback__select"
        />
      </header>

      <div className="board-playback__palette">
        <div className="board-playback__palette-row">
          {['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'].map(
            (piece, index) => (
              <ChessPiece key={`white-${piece}-${index}`} piece={piece} color="white" size={piecePixelSize} />
            )
          )}
        </div>
        <div className="board-playback__palette-row">
          {['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'].map(
            (piece, index) => (
              <ChessPiece key={`black-${piece}-${index}`} piece={piece} color="black" size={piecePixelSize} />
            )
          )}
        </div>
      </div>

      <div className="board-playback__controls">
        {toolbarButton('play-arrow-start', onGoToStart, 'Jump to start')}
        {toolbarButton('play-arrow-back', onStepBackward, 'Step backward')}
        {toolbarButton('play-Play', onTogglePlayback, 'Toggle playback')}
        {toolbarButton('play-arrow-forward', onStepForward, 'Step forward')}
        {toolbarButton('play-arrow-end', onGoToEnd, 'Jump to end')}
      </div>

      <div className="board-playback__footer">
        <Icon name="settings-01" size={16} />
        <span>♜</span>
        <span>♘</span>
        <span>♞</span>
        <div className="board-playback__avatar">
          <div className="board-playback__avatar-img" />
          <div>
            <div className="board-playback__avatar-name">Tór Grimsson</div>
            <div className="board-playback__avatar-meta">Oct 11, 2025</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default ChessSidebar

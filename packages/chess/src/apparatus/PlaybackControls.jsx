import { Button } from '@kolkrabbi/kol-component'
import { useChessControls } from '../context/ChessControlsContext'

const PlaybackControls = () => {
  const {
    goToStart,
    goToEnd,
    stepBackward,
    stepForward,
    togglePlayback,
    isPlaying,
    moveIndex,
    notationPairs
  } = useChessControls()

  const playbackButtons = [
    { icon: 'skip-start', label: 'Jump to start', action: goToStart },
    { icon: 'skip-back', label: 'Step backward', action: stepBackward },
    {
      icon: isPlaying ? 'pause' : 'play',
      label: isPlaying ? 'Pause playback' : 'Play moves',
      action: togglePlayback
    },
    { icon: 'skip-forward', label: 'Step forward', action: stepForward },
    { icon: 'skip-end', label: 'Jump to end', action: goToEnd }
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center">
        <span className="kol-helper-12 text-fg-64">
          MOVE {moveIndex}/{notationPairs.length || 0}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {playbackButtons.map(({ icon, label, action }) => (
          <Button
            key={icon}
            variant="grey"
            size="sm"
            iconOnly={icon}
            aria-label={label}
            onClick={action}
          />
        ))}
      </div>
    </div>
  )
}

export default PlaybackControls

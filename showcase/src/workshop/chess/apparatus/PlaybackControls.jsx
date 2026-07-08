import { Icon } from '@kolkrabbi/kol-icons'
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
    { icon: 'play-arrow-start', label: 'Jump to start', action: goToStart },
    { icon: 'play-arrow-back', label: 'Step backward', action: stepBackward },
    {
      icon: isPlaying ? 'play-pause' : 'play-Play',
      label: isPlaying ? 'Pause playback' : 'Play moves',
      action: togglePlayback
    },
    { icon: 'play-arrow-forward', label: 'Step forward', action: stepForward },
    { icon: 'play-arrow-end', label: 'Jump to end', action: goToEnd }
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center">
        <span className="kol-mono-xs text-fg-64 uppercase tracking-[0.2em]">
          Move {moveIndex}/{notationPairs.length || 0}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {playbackButtons.map(({ icon, label, action }) => (
          <button
            key={icon}
            type="button"
            aria-label={label}
            className="h-12 rounded bg-oq-02 border border-fg-08 text-fg-80 flex items-center justify-center hover:bg-oq-04 transition-colors"
            onClick={action}
          >
            <Icon name={icon} size={18} className="text-fg-80" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default PlaybackControls

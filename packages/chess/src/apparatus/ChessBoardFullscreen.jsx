import ChessBoard from './ChessBoard'
import ChessSidebar from './ChessSidebar'

const ChessBoardFullscreen = ({
  boardProps = {},
  sidebarProps = {},
  wrapperClassName = '',
  sidebarWidth = '400px'
}) => {
  const {
    className: boardContainerClassName = '',
    size: boardSize = 'desktop',
    ...restBoardProps
  } = boardProps

  const {
    className: sidebarClassName = 'w-full h-full bg-fg-04 text-auto',
    size: sidebarSize = 'desktop',
    variant: sidebarVariant = 'minimal',
    ...restSidebarProps
  } = sidebarProps

  const rootClassName = ['relative w-full', wrapperClassName].filter(Boolean).join(' ')

  return (
    <div className={rootClassName} style={{ minHeight: '100dvh' }}>
      <div
        className={`flex h-full w-full items-center justify-center ${boardContainerClassName}`}
        style={{ paddingRight: sidebarWidth, paddingLeft: 0, minHeight: '100dvh' }}
      >
        <ChessBoard size={boardSize} {...restBoardProps} />
      </div>

      <div
        className="absolute inset-y-0 right-0 flex"
        style={{ width: sidebarWidth }}
      >
        <ChessSidebar
          size={sidebarSize}
          variant={sidebarVariant}
          className={`h-full w-full ${sidebarClassName}`}
          {...restSidebarProps}
        />
      </div>
    </div>
  )
}

export default ChessBoardFullscreen

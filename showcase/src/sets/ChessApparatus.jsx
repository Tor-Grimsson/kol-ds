import ChessAnalysisLayout from '../workshop/chess/apparatus/ChessAnalysisLayout.jsx'

export const meta = {
  title: 'Chess apparatus',
  description: 'The full chess analysis apparatus — game archive, board, playback, notation, variations',
  category: 'game',
  featured: true,
}
export const stage = 'full'

/* The complete apparatus from the monorepo chess program (ported verbatim):
 * GameArchiveTable (sample-game archive with search/filters) feeding
 * ChessBoardWithControls — fluid board + piece-set/theme controls, playback,
 * notation panel, and the variation tree. Self-providing (ChessControlsProvider
 * lives inside), sample games ship in workshop/chess/data/. */
export default function ChessApparatusSet() {
  return (
    <div className="p-6">
      <ChessAnalysisLayout />
    </div>
  )
}

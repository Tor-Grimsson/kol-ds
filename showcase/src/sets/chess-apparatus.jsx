import { ChessAnalysisLayout, useChessControls } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'

export const meta = {
  title: 'Chess apparatus',
  description: 'The full chess analysis apparatus — game archive, board, playback, notation, variations',
  category: 'game',
  featured: true,
}
export const stage = 'full'

/* Renders the SHIPPED package (@kolkrabbi/kol-chess) — the same code the monorepo
 * installs — so the gallery can't drift from what's published. Styling comes from
 * @kolkrabbi/kol-theme (kol-components-chess.css). Game data comes from the package's
 * own adapter (@kolkrabbi/kol-chess/data — getSampleGames / getManifest /
 * getMonthlySummary / getRandomMonth / loadMonthGames / getGamePgnByIdAsync; demo set
 * bundled, full archive fetched from the B2 CDN). */
/* The brief-2.0 `panel` seam, exercised: a compact strip INSIDE the provider
 * reading live state via useChessControls() — the stand-in for the consumer's
 * EnginePanel/OpeningStrip (which stay app-side per kol-chess ARCHITECTURE §2). */
function PanelStrip() {
  const { moveIndex, notationPairs, selectedGame } = useChessControls()
  const white = selectedGame?.player?.username ?? 'White'
  const black = selectedGame?.opponent?.username ?? 'Black'
  return (
    <div className="flex items-center justify-between gap-4 rounded border border-fg-12 bg-fg-02 px-3 py-2">
      <span className="kol-helper-12 text-meta">PANEL · {white} — {black}</span>
      <span className="kol-mono-12 text-emphasis">move {moveIndex}/{notationPairs?.length ?? 0}</span>
    </div>
  )
}

export default function ChessApparatusSet() {
  return (
    /* The consumer's exact shell wrapper (kol-chess src/App.jsx, mirrored by
     * /demo) — the stage owns vertical, the wrapper owns max-width + gutters. */
    <div className="min-h-screen bg-surface-primary">
      <div className="mx-auto max-w-[1232px] px-4 md:px-6">
        <ChessAnalysisLayout chessData={chessData} panel={<PanelStrip />} />
      </div>
    </div>
  )
}

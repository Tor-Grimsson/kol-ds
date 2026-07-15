import { ChessAnalysisLayout } from '@kolkrabbi/kol-chess'
import * as chessData from '@kolkrabbi/kol-chess/data'
import { ThemeToggle } from '@kolkrabbi/kol-framework'

/**
 * /demo — the chess-consumer mirror (dev-only route).
 *
 * A 1:1 stand-in for the kol-chess app's src/App.jsx: the same two imports,
 * no showcase chrome, so DS edits to packages/{chess,theme,component} HMR
 * straight into the exact view the consumer ships while the 2026-07-15
 * DESIGN-SYSTEM-AUDIT fixes land. Replaces the dated 2026-07-08 chrome-law
 * review page (audit IA verdict: delete).
 *
 * The floating ThemeToggle is the one deliberate extra — the audit's fix for
 * "no theme toggle" is mounting the framework one, so it's exercised here too.
 */
export default function Demo() {
  return (
    <div className="min-h-screen bg-surface-primary">
      {/* the consumer's exact shell wrapper (kol-chess src/App.jsx) */}
      <div className="mx-auto max-w-[1232px] px-4 md:px-6">
        <ChessAnalysisLayout chessData={chessData} overlayActions={<ThemeToggle variant="icon" />} />
      </div>
    </div>
  )
}

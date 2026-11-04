import { GlobalActions } from '@kolkrabbi/kol-shell'

/* undo · redo · Export · the account (the gap map's row 72) — the user glyph, then a picture */
export default function GlobalActionsPreview() {
  return (
    <div className="flex flex-col items-start gap-6">
      <GlobalActions onUndo={() => {}} onRedo={() => {}} onAction={() => {}} onAccount={() => {}} />
      <GlobalActions onUndo={() => {}} onRedo={() => {}} onAction={() => {}} account={{ initial: 'K', label: 'Kolkrabbi' }} onAccount={() => {}} />
    </div>
  )
}

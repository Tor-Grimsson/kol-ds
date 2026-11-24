import { transport, useComposeState, useTransport } from './engine.js'
import { labsAction } from '../ui/MenuMain.jsx'
import { AppFloatNav, ToolRailSlot } from '@kolkrabbi/kol-shell'

/* The engine's clock as kolbox's parts read it: the position in the loop in seconds, the loop's length and the loop
   switch (the DS clock's own `looping`). It re-renders on every tick, so only the leaf that draws the time calls it. */
export function useClock() {
  const tr = useTransport()
  return {
    ...tr,
    time: tr.t * tr.loopSeconds,
    loop: !!transport.clock.state.looping,
    setLoop: (on) => transport.clock.set({ looping: on }),
  }
}

/* The transport toolbar on the engine's transport: play and pause, rewind, stop, the time, loop and its length. Then,
   in the same well (round 4, 6.1, 6.2, 7.3), what the real Labs keeps round its params rail: Undo and Redo (the real
   rail's top right; his ruling took them out of the left rail), Output and File (the real dock's two other tabs, opened
   as the editor's windows) and the rails' Collapse navigation and Expand navigation (`\`), which stays on the stage when
   the rails are gone, as the real floating Play button does. */
export default function LabsTransport({ railsHidden = false, onRails }) {
  const c = useClock()
  const { canUndo, canRedo } = useComposeState()
  return (
    <AppFloatNav variant="kolbox" transport
      playing={c.playing}
      time={c.time}
      loop={c.loop}
      loopLength={Math.round(c.loopSeconds * 100) / 100}
      onPlay={(on) => (on ? c.play() : c.pause())}
      onRewind={c.rewind}
      onStop={c.stop}
      onLoop={c.setLoop}
      onLoopLength={c.setLoopSeconds}
      more={(
        <>
          <ToolRailSlot icon="undo" label="Undo" kbd="⌘Z" disabled={!canUndo} className="disabled:opacity-50" onClick={labsAction('undo')} />
          <ToolRailSlot icon="redo" label="Redo" kbd="⇧⌘Z" disabled={!canRedo} className="disabled:opacity-50" onClick={labsAction('redo')} />
          <ToolRailSlot icon="download" label="Output" onClick={labsAction('output')} />
          <ToolRailSlot icon="file" label="File" onClick={labsAction('file')} />
          <ToolRailSlot icon={railsHidden ? 'sidebar-expand' : 'sidebar-collapse'} label={railsHidden ? 'Expand navigation' : 'Collapse navigation'} kbd="⇧\" onClick={onRails} />
        </>
      )}
    />
  )
}

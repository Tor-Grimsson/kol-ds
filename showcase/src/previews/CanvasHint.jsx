import { CanvasHint } from '@kolkrabbi/kol-shell'

/* the pointer and the gestures (the gap map's row 75) */
export default function CanvasHintPreview() {
  return <CanvasHint hint={['Drag to move', 'Shift to constrain', 'Double-click to edit']} />
}

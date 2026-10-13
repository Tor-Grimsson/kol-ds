import { useState } from 'react'
import { Button, SplitToolButton } from '@kolkrabbi/kol-component'

export const stage = 'hug'

const SHAPES = [
  { id: 'rectangle', label: 'Rectangle', icon: 'rectangle', shortcut: 'R' },
  { id: 'circle', label: 'Circle', icon: 'circle', shortcut: 'O' },
  { id: 'triangle', label: 'Triangle', icon: 'triangle' },
]

/* Tool-palette row: the base quiet/pressed toggles are plain DS Buttons —
 * only the split variant-menu trigger needs the molecule. Every box in the row
 * is `size="md"` (32), and no call site names a glyph size: the pinned-square
 * ladder and the SOLO ladder decide both. This preview used to inline
 * `style={{ width: 28, height: 28, padding: 6 }}` + `iconSize={14}` on the
 * Buttons and let SplitToolButton default to its own 28 — three transcriptions
 * of an off-ladder box, in the reference a consumer copies. */
export const sizes = ['md', 'xs', 'sm', 'lg']

/* An ACTION fold with nothing selected: `disabled` disarms the trigger, the caret still opens it,
 * and the rows that do not apply are greyed, never hidden (SplitToolButtonFoldAlwaysOpens, 2026-10-13). */
const ROTATE = [
  { id: 'rotate-left', label: 'Rotate 90° left', icon: 'rotate-left', shortcut: '⇧L', disabled: true },
  { id: 'rotate-right', label: 'Rotate 90° right', icon: 'rotate-right', shortcut: '⇧V', disabled: true },
  { id: 'flip-h', label: 'Flip horizontal', icon: 'flip-horizontal', disabled: true },
  { id: 'flip-v', label: 'Flip vertical', icon: 'flip-vertical', disabled: true },
]

export default function SplitToolButtonPreview({ size = 'md' }) {
  const [tool, setTool] = useState('select')
  const [shape, setShape] = useState('rectangle')
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="inline-flex items-center gap-1">
        <Button
          tone="ghost"
          quiet
          size={size}
          iconOnly="pointer"
          pressed={tool === 'select'}
          onClick={() => setTool('select')}
          aria-label="Select"
          title="Select (V)"
        />
        <Button
          tone="ghost"
          quiet
          size={size}
          iconOnly="type"
          pressed={tool === 'text'}
          onClick={() => setTool('text')}
          aria-label="Text"
          title="Text (T)"
        />
        <SplitToolButton
          size={size}
          variants={SHAPES}
          value={shape}
          lastPicked={shape}
          active={tool === 'shape'}
          onChange={(id) => {
            setShape(id)
            setTool('shape')
          }}
        />
        <SplitToolButton size={size} variants={ROTATE} onTrigger={() => {}} disabled aria-label="Rotate" />
      </div>
      <span className="kol-helper-10 text-meta">
        tool: {tool} · shape: {shape}
      </span>
    </div>
  )
}

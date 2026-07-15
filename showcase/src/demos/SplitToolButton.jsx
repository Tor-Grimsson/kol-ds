import { useState } from 'react'
import { Button, SplitToolButton } from '@kolkrabbi/kol-component'

export const stage = 'hug'

const SHAPES = [
  { id: 'rectangle', label: 'Rectangle', icon: 'rectangle', shortcut: 'R' },
  { id: 'circle', label: 'Circle', icon: 'circle', shortcut: 'O' },
  { id: 'triangle', label: 'Triangle', icon: 'triangle' },
]

/* Tool-palette row: the base 28×28 quiet/pressed toggles are plain DS
 * Buttons — only the split variant-menu trigger needs the molecule. */
export default function SplitToolButtonDemo() {
  const [tool, setTool] = useState('select')
  const [shape, setShape] = useState('rectangle')
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="inline-flex items-center gap-1">
        <Button
          variant="ghost"
          quiet
          iconOnly="pointer"
          iconSize={14}
          pressed={tool === 'select'}
          onClick={() => setTool('select')}
          aria-label="Select"
          title="Select (V)"
          style={{ width: 28, height: 28, padding: 6 }}
        />
        <Button
          variant="ghost"
          quiet
          iconOnly="type"
          iconSize={14}
          pressed={tool === 'text'}
          onClick={() => setTool('text')}
          aria-label="Text"
          title="Text (T)"
          style={{ width: 28, height: 28, padding: 6 }}
        />
        <SplitToolButton
          variants={SHAPES}
          value={shape}
          lastPicked={shape}
          active={tool === 'shape'}
          onChange={(id) => {
            setShape(id)
            setTool('shape')
          }}
        />
      </div>
      <span className="kol-helper-10 text-meta">
        tool: {tool} · shape: {shape}
      </span>
    </div>
  )
}

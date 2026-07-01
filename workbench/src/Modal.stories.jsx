import { useState } from 'react'
import { ModalProvider, useModal, Button } from '@kolkrabbi/kol-component'

function Demo() {
  const { prompt, confirm } = useModal()
  const [result, setResult] = useState('—')

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button onClick={async () => setResult(String(await prompt('Name this frame:', 'Untitled')))}>
        Prompt
      </Button>
      <Button
        variant="outline"
        onClick={async () => setResult(String(await confirm('Discard unsaved changes?')))}
      >
        Confirm
      </Button>
      <span className="kol-mono-12">result: {result}</span>
    </div>
  )
}

export const PromptAndConfirm = () => (
  <ModalProvider>
    <Demo />
  </ModalProvider>
)

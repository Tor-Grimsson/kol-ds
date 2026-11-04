import { useEffect } from 'react'
import { ModalProvider, useModal, Button } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* The modal system is imperative — a provider + hook, not a mounted element.
 * The preview mounts its own ModalProvider so the dialogs render even though the
 * showcase shell doesn't carry one. */

function Triggers() {
  const { confirm, prompt } = useModal()
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => confirm('Discard unsaved changes?')}
      >
        Confirm
      </Button>
      <Button
        size="sm"
        onClick={() =>
          confirm('Restore your last canvas?', { okLabel: 'Restore', cancelLabel: 'New file' })
        }
      >
        Custom labels
      </Button>
      <Button
        size="sm"
        onClick={() => prompt('Name this frame:', 'Untitled')}
      >
        Prompt
      </Button>
      {/* `type: 'password'` — the sign-in prompt masks the field */}
      <Button
        size="sm"
        onClick={() => prompt('Password:', '', { type: 'password', okLabel: 'Sign in' })}
      >
        Password
      </Button>
      {/* `options` — toggle rows between the title and the buttons; resolves { ok, values } */}
      <Button
        size="sm"
        onClick={() =>
          confirm('Web-optimise raster images?', {
            okLabel: 'Upload',
            options: [
              { id: 'optimise', label: 'Optimise', hint: '≤2560 px, ≤500 KB', defaultValue: true },
              { id: 'keepOriginals', label: 'Keep originals', hint: 'original/<name>', defaultValue: true },
            ],
          })
        }
      >
        Toggles
      </Button>
    </div>
  )
}

/* float (W6 rows 84 · 85): the float window — the destructive confirm opens at once so the preview shows it */
function FloatConfirm() {
  const { confirm, prompt } = useModal()
  const destructive = () => confirm('Delete “Orbit field”?', {
    variant: 'float', header: 'Delete layer', icon: 'alert-triangle', tone: 'danger',
    body: 'This removes the layer and its 4 keyframes from Scene 01. You can undo this after closing the dialog.',
    okLabel: 'Delete layer', cancelLabel: 'Keep layer',
  })
  useEffect(() => { destructive() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex gap-2">
      <Button variant="float" tone="danger" size="md" onClick={destructive}>Delete layer</Button>
      <Button variant="float" tone="secondary" size="md" onClick={() => prompt('Name this frame', 'Untitled', { variant: 'float', header: 'Frame', icon: 'layers' })}>Prompt</Button>
    </div>
  )
}

export const variants = ['default', 'float']

export default function UseModalPreview({ variant = 'default' }) {
  if (variant === 'float') return <ModalProvider><FloatConfirm /></ModalProvider>
  return (
    <ModalProvider>
      <Triggers />
    </ModalProvider>
  )
}

/* Index card: one canonical trigger. */
export function Card() {
  return (
    <ModalProvider>
      <Triggers />
    </ModalProvider>
  )
}

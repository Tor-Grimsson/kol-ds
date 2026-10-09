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

export default function UseModalPreview() {
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

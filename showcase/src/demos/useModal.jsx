import { ModalProvider, useModal, Button } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* The modal system is imperative — a provider + hook, not a mounted element.
 * The demo mounts its own ModalProvider so the dialogs render even though the
 * showcase shell doesn't carry one. */

function Triggers() {
  const { confirm, prompt } = useModal()
  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => confirm('Discard unsaved changes?')}
      >
        Confirm
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          confirm('Restore your last canvas?', { okLabel: 'Restore', cancelLabel: 'New file' })
        }
      >
        Custom labels
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => prompt('Name this frame:', 'Untitled')}
      >
        Prompt
      </Button>
    </div>
  )
}

export default function UseModalDemo() {
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

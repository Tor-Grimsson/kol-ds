import { useState } from 'react'
import { Accordion, AccordionPanel } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function AccordionPanelDemo() {
  const [open, setOpen] = useState(true)
  return (
    <Accordion className="w-full max-w-md">
      <AccordionPanel
        title="Controlled panel"
        meta={open ? 'open' : 'closed'}
        open={open}
        onToggle={setOpen}
      >
        <p className="text-fg-72">
          A single panel driven from the parent via the controlled
          <code className="text-emphasis"> open</code> +
          <code className="text-emphasis"> onToggle</code> props.
        </p>
      </AccordionPanel>
    </Accordion>
  )
}

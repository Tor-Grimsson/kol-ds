import { Accordion, AccordionPanel } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function AccordionDemo() {
  return (
    <Accordion className="w-full max-w-md">
      <AccordionPanel title="OVERVIEW" meta="01" defaultOpen>
        <p className="text-fg-72">
          A collapsible panel group. Each panel owns its open state, so several
          can be expanded at once.
        </p>
      </AccordionPanel>
      <AccordionPanel title="MATERIALS" meta="02">
        <p className="text-fg-72">
          Brushed aluminium body, anodised finish, recycled-cotton strap.
        </p>
      </AccordionPanel>
      <AccordionPanel title="SHIPPING" meta="03">
        <p className="text-fg-72">
          Dispatched within two business days. Tracked delivery worldwide.
        </p>
      </AccordionPanel>
    </Accordion>
  )
}

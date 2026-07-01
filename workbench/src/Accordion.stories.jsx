import { useState } from 'react'
import { Accordion, AccordionPanel } from '@kolkrabbi/kol-component'

export const Default = () => (
  <Accordion>
    <AccordionPanel title="Brand" meta="3 tokens" defaultOpen>
      <p className="kol-prose">Burgundy, ink and paper — the core brand triad.</p>
    </AccordionPanel>
    <AccordionPanel title="Neutrals" meta="8 tokens">
      <p className="kol-prose">Cool grey scale, slate-leaning to contrast warm burgundy.</p>
    </AccordionPanel>
    <AccordionPanel title="Accent" meta="2 tokens">
      <p className="kol-prose">Links, focus rings and selection states.</p>
    </AccordionPanel>
  </Accordion>
)

export const SingleOpen = () => {
  const [openId, setOpenId] = useState('display')
  const panels = [
    { id: 'display', title: 'Display', meta: '4 specimens', body: 'Oversized headline type.' },
    { id: 'body', title: 'Body', meta: '3 specimens', body: 'Reading sizes for prose.' },
    { id: 'mono', title: 'Mono', meta: '2 specimens', body: 'Tabular and code contexts.' },
  ]
  return (
    <Accordion>
      {panels.map((p) => (
        <AccordionPanel
          key={p.id}
          title={p.title}
          meta={p.meta}
          open={openId === p.id}
          onToggle={() => setOpenId(openId === p.id ? null : p.id)}
        >
          <p className="kol-prose">{p.body}</p>
        </AccordionPanel>
      ))}
    </Accordion>
  )
}

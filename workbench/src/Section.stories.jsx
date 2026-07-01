import { Section } from '@kolkrabbi/kol-component'

export const Default = () => (
  <Section label="Aspect">
    <p className="kol-mono-12 text-body">Square · 1:1</p>
    <p className="kol-mono-12 text-body">Portrait · 4:5</p>
  </Section>
)

export const NoLabel = () => (
  <Section>
    <p className="kol-mono-12 text-body">Unlabeled content stack</p>
  </Section>
)

export const Stacked = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 240 }}>
    <Section label="Source">
      <p className="kol-mono-12 text-body">raven.svg</p>
    </Section>
    <Section label="Logo">
      <p className="kol-mono-12 text-body">On</p>
    </Section>
  </div>
)

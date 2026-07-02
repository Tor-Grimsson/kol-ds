import { PageSection } from '@kolkrabbi/kol-framework'

export const stage = 'full'

export default function PageSectionDemo() {
  // .kol-page carries 64px section padding — tighten it for the preview.
  return (
    <div className="w-full [&_.kol-page]:py-6">
      <PageSection
        label="01 — Colour"
        title="Surface tiers"
        body="The section chrome every chapter is built from: numbered label, title, lede, then content."
      >
        <div className="h-16 rounded-[var(--kol-radius-sm)] border border-dashed border-fg-16" />
      </PageSection>
    </div>
  )
}

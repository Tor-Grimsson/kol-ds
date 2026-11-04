import { LinkCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — a project's links.
export default function LinkCardPreview() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-[400px]">
      <LinkCard title="kolkrabbi.io" meta="Studio site" href="https://kolkrabbi.io" />
      <LinkCard title="ui.kolkrabbi.io" meta="Design system" href="https://ui.kolkrabbi.io" />
      <LinkCard title="Open in Figma" meta="library--kol-ds-ui" onClick={() => {}} />
    </div>
  )
}

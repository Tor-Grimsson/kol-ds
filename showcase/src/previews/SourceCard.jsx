import { SourceCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — a source that failed to load, and a healthy one.
export default function SourceCardPreview() {
  return (
    <div className="flex flex-wrap gap-4 items-start">
      <SourceCard className="w-[312px]" code="#KOL-OB" title="Obsidian" status="Needs attention" message="Unable to load captures." detail="The source returned an unexpected response (JSON parse error)." action="Retry" onAction={() => {}} />
      <SourceCard className="w-[312px]" code="#KOL-GH" title="GitHub" status="Synced 4 min ago" />
    </div>
  )
}

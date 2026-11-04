import { NoteCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

export default function NoteCardPreview() {
  return (
    <div className="w-full max-w-[400px]">
      <NoteCard eyebrow="Reading note / Page 125" onClick={() => {}}>
        The intervals matter as much as the arrivals. A thought to take into the next chapter.
      </NoteCard>
    </div>
  )
}

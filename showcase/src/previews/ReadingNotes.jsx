import { useState } from 'react'
import { ReadingNotes } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* the selected highlight and its note — the Notes side of ReadingPanel */
export default function ReadingNotesPreview() {
  const [note, setNote] = useState('The intervals matter as much as the arrivals. A thought to take into the next chapter.')
  return (
    <div className="w-[280px]">
      <ReadingNotes quote="Attention is not always a matter of looking harder. Sometimes it is simply a willingness to remain."
        location="Third interlude · Page 125" note={note} onNoteChange={setNote} status="All changes saved"
        onView={() => {}} onRemove={() => {}} footer="Note 1 / Page 125" />
    </div>
  )
}

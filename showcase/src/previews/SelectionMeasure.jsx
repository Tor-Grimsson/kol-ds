import { SelectionMeasure } from '@kolkrabbi/kol-shell'

/* the handles, the label and the 754 × 771 cap around a selected thing (the gap map's row 76) */
export default function SelectionMeasurePreview() {
  return (
    <div className="p-10">
      <SelectionMeasure width={754} height={771} label="Orbit field">
        <div className="w-[240px] h-[160px] rounded-[var(--kol-float-list-r)] bg-oq-08" />
      </SelectionMeasure>
    </div>
  )
}

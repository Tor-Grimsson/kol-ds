import { PeriodNav } from '@kolkrabbi/kol-shell'

/* ‹ › Today (the gap map's row 142), one per surface */
export default function PeriodNavPreview() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <PeriodNav onPrev={() => {}} onNext={() => {}} onToday={() => {}} />
      <PeriodNav onPrev={() => {}} onNext={() => {}} onToday={() => {}} surface="glass-dark" />
      <PeriodNav onPrev={() => {}} onNext={() => {}} onToday={() => {}} surface="glass-light" />
    </div>
  )
}

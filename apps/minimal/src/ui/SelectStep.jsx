import Button from './Button.jsx'
import Select from './Select.jsx'

/* A select with previous and next around it; `children` trail the row (the info button). A side with no handler is
   not drawn. */
export default function SelectStep({ value, onChange, options, onPrev, onNext, prevLabel = 'Previous', nextLabel = 'Next', children }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1">
      {onPrev && <Button icon="chevron-left" aria-label={prevLabel} onClick={onPrev} />}
      <Select value={value} onChange={onChange} options={options} />
      {onNext && <Button icon="chevron-right" aria-label={nextLabel} onClick={onNext} />}
      {children}
    </div>
  )
}

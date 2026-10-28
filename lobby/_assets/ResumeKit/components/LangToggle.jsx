import { useSearchParams } from 'react-router-dom'
import { SegmentedToggle } from '@kolkrabbi/kol-component'
import { readLang } from '../lib/i18n'

/** EN / IS, written to `?lang` — the one value every resume surface (source,
 * library, treatment preview, headless export) reads. English clears the param. */
export default function LangToggle({ className = '' }) {
  const [params, setParams] = useSearchParams()
  const set = (v) => {
    const p = new URLSearchParams(params)
    v === 'is' ? p.set('lang', 'is') : p.delete('lang')
    setParams(p, { replace: true })
  }
  return (
    <SegmentedToggle
      value={readLang(params)}
      onChange={set}
      size="sm"
      ariaLabel="Language"
      options={[
        { value: 'en', label: 'EN' },
        { value: 'is', label: 'IS' },
      ]}
      className={className}
    />
  )
}

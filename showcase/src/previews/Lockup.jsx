import { Lockup } from '@kolkrabbi/kol-styleguide'

export const stage = 'md'

export default function Preview() {
  return (
    <div className="flex flex-col items-start text-emphasis">
      <Lockup parent="Atlas" product="Hosting" scale="md" />
      <Lockup parent="Atlas" product="Hosting" descriptor="IS" variant="wordmark" scale="md" />
    </div>
  )
}

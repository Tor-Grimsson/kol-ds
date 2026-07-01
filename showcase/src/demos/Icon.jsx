import { Icon } from '@kolkrabbi/kol-loader'

export default function IconDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {['arrow-right', 'check', 'search', 'settings-01', 'star', 'heart-1', 'rabbit'].map((name) => (
        <Icon key={name} name={name} size={18} />
      ))}
    </div>
  )
}

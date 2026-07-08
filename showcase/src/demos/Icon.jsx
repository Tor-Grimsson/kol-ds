import { Icon } from '@kolkrabbi/kol-icons'

export default function IconDemo() {
  return (
    <>
      {['arrow-right', 'check', 'search', 'settings-01', 'star', 'heart-1', 'rabbit'].map((name) => (
        <Icon key={name} name={name} size={18} />
      ))}
    </>
  )
}

import { Icon } from '@kolkrabbi/kol-icons'

export default function IconPreview() {
  return (
    <>
      {['arrow-right', 'check', 'search', 'settings-01', 'star', 'heart', 'bolt'].map((name) => (
        <Icon key={name} name={name} size={18} />
      ))}
    </>
  )
}

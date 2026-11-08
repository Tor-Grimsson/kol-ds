import { IconLoader } from '@kolkrabbi/kol-icons'

export default function IconPreview() {
  return (
    <>
      {['arrow-right', 'check', 'search', 'settings-01', 'star', 'heart', 'bolt'].map((name) => (
        <IconLoader key={name} name={name} size={18} />
      ))}
    </>
  )
}

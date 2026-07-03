import { useState } from 'react'
import { Input, Textarea, ToggleSwitch, Button, LabeledControl, Divider } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Settings form',
  description: 'A settings form with labeled fields and toggles',
  category: 'form',
}
export const stage = 'md'

export default function SettingsForm() {
  const [name, setName] = useState('Kolkrabbi Vinnustofa')
  const [bio, setBio] = useState('')
  const [publicProfile, setPublicProfile] = useState(true)
  const [newsletter, setNewsletter] = useState(false)

  return (
    <div className="flex flex-col gap-5 rounded-[var(--kol-radius-md)] border border-fg-12 bg-surface-primary p-5">
      <LabeledControl label="Studio name">
        <Input value={name} onChange={(e) => setName(e?.target?.value ?? e)} />
      </LabeledControl>
      <LabeledControl label="Bio" hint="shown on the public page">
        <Textarea variant="filled" rows={3} placeholder="A short introduction…" value={bio} onChange={(e) => setBio(e?.target?.value ?? e)} />
      </LabeledControl>
      <Divider />
      <ToggleSwitch label="Public profile" checked={publicProfile} onChange={setPublicProfile} />
      <ToggleSwitch label="Newsletter" checked={newsletter} onChange={setNewsletter} />
      <Divider />
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Save changes</Button>
      </div>
    </div>
  )
}

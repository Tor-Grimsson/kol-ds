import { Avatar } from '@kolkrabbi/kol-component'

export default function AvatarDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Avatar initial="A" size="sm" />
      <Avatar initial="TG" size="md" />
      <Avatar initial="K" size="lg" />
      <Avatar initial="ZO" size="xl" />
    </div>
  )
}

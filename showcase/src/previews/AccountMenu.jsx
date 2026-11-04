import { AccountMenu } from '@kolkrabbi/kol-component'

export const stage = 'hug'

const ITEMS = [
  { label: 'Profile', icon: 'user', onClick: () => {} },
  { label: 'Settings', icon: 'nav-settings', kbd: '⌘,', onClick: () => {} },
  { divider: true },
  { label: 'Sign out', tone: 'danger', onClick: () => {} },
]

/* the account's circle — the user glyph with no initial, the Avatar with one */
export default function AccountMenuPreview() {
  return (
    <div className="flex min-h-[200px] w-full items-start justify-center gap-6">
      <AccountMenu items={ITEMS} />
      <AccountMenu initial="A" name="Alex" items={ITEMS} />
    </div>
  )
}

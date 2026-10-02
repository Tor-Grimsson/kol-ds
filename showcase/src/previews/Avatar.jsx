import { Avatar } from '@kolkrabbi/kol-component'

export const sizes = ['md', 'sm', 'lg', 'xl']

export default function AvatarPreview({ size = 'md' }) {
  return (
    <>
      <Avatar initial="A" size={size} />
      <Avatar initial="TG" size={size} />
      <Avatar initial="ZO" size={size} />
    </>
  )
}

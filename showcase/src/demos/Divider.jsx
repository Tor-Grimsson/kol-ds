import { Divider } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['horizontal', 'vertical']

export default function DividerDemo({ variant = 'horizontal' }) {
  return variant === 'vertical' ? (
    <div className="flex h-10 items-stretch gap-6">
      <Divider variant="vertical" />
      <Divider variant="vertical" opacity="24" />
    </div>
  ) : (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <Divider />
      <Divider opacity="24" />
    </div>
  )
}

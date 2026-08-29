import { PageHeader } from '@kolkrabbi/kol-shell'

export const variants = ['sans', 'mono']
export const stage = 'full'

/* `voice="mono"` = the app tier's masthead (kol-monitor's JetBrains Mono 32 / 500) */
export default function PageHeaderDemo({ variant = 'sans' }) {
  return (
    <div className="flex w-full flex-col">
      <PageHeader size="sm" voice={variant} eyebrow="Library" title="Monitor" subtitle="433 files · 1.29 GB" />
      <PageHeader size="md" voice={variant} title="Use cases" subtitle="the default page masthead" />
    </div>
  )
}

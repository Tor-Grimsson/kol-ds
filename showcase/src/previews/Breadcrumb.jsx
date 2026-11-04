import { Breadcrumb } from '@kolkrabbi/kol-shell'

/* Workspace / Analytics / Overview (the gap map's row 136) */
export default function BreadcrumbPreview() {
  return <Breadcrumb items={[{ label: 'Workspace', onPress: () => {} }, { label: 'Analytics', onPress: () => {} }, 'Overview']} />
}

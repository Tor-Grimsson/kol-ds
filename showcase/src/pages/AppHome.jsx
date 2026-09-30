import { useParams } from 'react-router-dom'
import { DocHeader, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Table } from '@kolkrabbi/kol-component'
import { APPS, LAYERS } from './Apps.jsx'

/**
 * AppHome — one app's spec, at `/app/<name>` (apps review 2026-09-29 — the user: *"give each app a
 * home? listing the specs? like the opt ins, if it has search engine, if it has a shell etc. also to
 * give the non visual apps like fixture some referencial home"*). The rows come from APPS in
 * pages/Apps.jsx — one list feeds the index, the rail and this page.
 */
export default function AppHome() {
  const { name } = useParams()
  const app = APPS.find((a) => a.name === name)
  /* an app page carries tags like any page (2026-09-30 — /apps read Tags (0)): its layer, the
   * packages it takes */
  usePageMeta({ tags: app ? [`pattern/${app.layer}-layer`, ...app.packages.map((p) => `domain/${p.split(' ')[0]}`)] : [], related: [] })
  if (!app) return <DocHeader eyebrow="Apps tier" title="No such app" lede={`There is no app called “${name}”.`} />
  const layer = LAYERS.find((l) => l.id === app.layer)
  const rows = [
    { id: 'layer', key: 'Layer', value: layer?.label },
    { id: 'layers', key: 'Built from', value: app.layers.join(' + ') },
    { id: 'packages', key: 'Packages', value: app.packages.join(' · ') },
    { id: 'optins', key: 'Opt-ins', value: app.optIns.length ? app.optIns.join(' · ') : '—' },
    { id: 'run', key: 'Local', value: app.port ? `pnpm ${app.run ?? app.name} — port ${app.port}` : 'no page — imported by the apps' },
    { id: 'consumer', key: 'A repo sets', value: app.consumer },
  ]
  return (
    <>
      <DocHeader eyebrow={`Apps tier · ${layer?.label ?? ''}`} title={app.name} lede={app.what} />
      {app.port && (
        <p className="mt-6 kol-doc-body">
          <a href={`/apps/${app.name}/`} className="kol-link underline">Open {app.name}</a>
        </p>
      )}
      <Table
        width="column"
        className="mt-8"
        caption={`${app.name} — spec`}
        columns={[
          { accessor: 'key', header: 'Spec' },
          { accessor: 'value', header: 'Value', className: 'kol-table-cell-meta-strong' },
        ]}
        rows={rows}
      />
      {app.routes && (
        <Table
          width="column"
          className="mt-8"
          caption={`${app.name} — screens`}
          columns={[
            { accessor: 'path', header: 'Route' },
            { accessor: 'what', header: 'Screen', className: 'kol-table-cell-meta-strong' },
          ]}
          rows={app.routes.map((r) => ({ id: r.path, ...r }))}
        />
      )}
    </>
  )
}

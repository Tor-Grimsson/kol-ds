import { CHROMES } from './files.js'
import { Button } from '@kolkrabbi/kol-component'

/* A file's own page (the real Library's StudioDetail at /library/<chrome>/<id>): Back, the name, "<Chrome> — <Group> ›
   <Category>", then Description, Specifications, Steps (a morph), Tags with Open and Duplicate at their foot, and the
   preview beside them. The strings are the hub's. A file not in the list: "File not found" with the address' id. */
const Section = ({ title, children }) => (
  <section className="flex flex-col gap-2">
    <h2 className="text-section text-text">{title}</h2>
    {children}
  </section>
)

export default function LibraryFile({ file, slug, onBack, onOpen, onDuplicate }) {
  const head = (title, subtitle) => (
    <>
      <Button variant="kolbox" tone="ghost" iconLeft="chevron-left" onClick={onBack} className="-ml-3 self-start">Back</Button>
      <h1 className="mt-2 text-[22px]/[28px] font-normal text-text">{title}</h1>
      <p className="mt-1 text-value text-muted">{subtitle}</p>
    </>
  )
  if (!file) return <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-8 pt-3 pb-8" data-library-file>{head('File not found', slug)}</div>
  const chrome = CHROMES[file.chrome].label
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-8 pt-3 pb-8" data-library-file={file.id}>
      {head(file.name, `${chrome}${file.group ? ` — ${file.group}` : ''}${file.sub ? ` › ${file.sub}` : ''}`)}
      <div className="mt-6 h-px shrink-0 bg-border" />
      <div className="mt-6 grid min-h-0 flex-1 grid-cols-2 gap-12">
        <div className="flex flex-col gap-6">
          <Section title="Description"><p className="text-help text-muted">{`A shipped ${chrome} file. Open loads it in its chrome; Duplicate makes it yours.`}</p></Section>
          <Section title="Specifications">
            {file.details.map((d) => <p key={d.label} className="font-mono text-value text-muted">{`${d.label}: ${d.value}`}</p>)}
          </Section>
          {file.steps && (
            <Section title="Steps">
              {file.steps.map((s, i) => <p key={i} className="flex gap-3 font-mono text-value text-muted"><span>{i + 1}</span>{s}</p>)}
            </Section>
          )}
          {file.tags.length > 0 && <Section title="Tags"><p className="font-mono text-value text-muted">{file.tags.join(', ')}</p></Section>}
          <div className="mt-auto flex flex-col gap-4 pt-6">
            <div className="h-px bg-border" />
            <div className="flex gap-2">
              <Button variant="kolbox" tone="primary" onClick={onOpen}>Open</Button>
              <Button variant="kolbox" onClick={onDuplicate}>Duplicate</Button>
            </div>
          </div>
        </div>
        <div className="flex items-start">
          <div className="w-full rounded-well bg-canvas p-6" data-library-preview>
            {file.cover && <img src={file.cover} alt={file.name} className="aspect-square w-full object-contain" />}
          </div>
        </div>
      </div>
    </div>
  )
}

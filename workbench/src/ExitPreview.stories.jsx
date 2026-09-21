import { ExitPreview } from '@kolkrabbi/kol-component'

// Router-agnostic since kol-component 0.181.0 — the default renders a plain
// <a href>, so the story no longer needs a Router around it. Inside one, a
// consumer passes `linkComponent={Link}`.
export const Default = () => <ExitPreview />

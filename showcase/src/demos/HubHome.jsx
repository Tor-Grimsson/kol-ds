import { Button } from '@kolkrabbi/kol-component'
import { HubHome } from '@kolkrabbi/kol-shell'

export const stage = 'full'

const RECENT = [{ name: 'empty', title: 'Empty tool', detail: 'Start from nothing' }]
const SAVED = ['Alpha', 'Bravo', 'Charlie'].map((t, i) => ({ name: t, title: t, detail: `Saved ${i + 1} d ago` }))

/* the Hub's Home: the app's masthead over a Catalog, RECENT · SAVED, and a walkthrough
 * that opens only from its button — the X inside the card closes it */
export default function HubHomeDemo() {
  return (
    <HubHome
      app={{ name: 'Shell', subtitle: 'The Hub around a placeholder tool' }}
      items={(view) => (view === 'recent' ? RECENT : SAVED)}
      filtersTitle="All Items"
      toCard={(item) => ({ key: item.name, title: item.title, detail: item.detail })}
      actions={<Button variant="grey" size="md">New</Button>}
      walkthrough={[
        { title: '1. Home', text: ['What you opened last and what you saved.'] },
        { title: 'Get started', actions: (close) => <Button variant="grey" size="md" onClick={close}>Start</Button> },
      ]}
    />
  )
}

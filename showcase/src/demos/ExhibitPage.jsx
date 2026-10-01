import { ExhibitPage } from '@kolkrabbi/kol-workshop'
import { Badge } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* An exhibit's inner page, declared as content: a prose section and a specimen section. No `toc` —
 * the demo leaves the shell's rail alone. */
export default function ExhibitPageDemo() {
  return (
    <ExhibitPage
      sections={[
        { id: 'intro', label: 'Badges', title: 'Status badges', body: 'A label and a tone.' },
        { id: 'specimens', label: 'Specimens', title: 'Badge', body: 'Each variant, live.',
          specimens: [
            { name: 'Success', description: 'A finished state.', details: 'variant: success', code: 'variant="success"', demo: <Badge variant="success">Done</Badge> },
            { name: 'Warning', description: 'Needs a look.', details: 'variant: warning', code: 'variant="warning"', demo: <Badge variant="warning">Check</Badge> },
          ] },
      ]}
    />
  )
}

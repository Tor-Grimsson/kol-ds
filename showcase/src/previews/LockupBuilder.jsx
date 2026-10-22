import { LockupBuilder } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

/* a brand's naming levels, run through the same Lockup */
const PRESETS = {
  Products: ['Readable backups', 'Disaster recovery', 'Hosting'],
  Programs: ['Partners', 'Resellers', 'Integrators'],
}

export default function Preview() {
  return <LockupBuilder parent="Atlas" presets={PRESETS} />
}

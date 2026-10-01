import { DocTable } from '@kolkrabbi/kol-workshop'

export const stage = 'full'

const ROWS = [
  { prop: 'variant', type: "'primary' | 'ghost'", def: "'primary'", desc: 'The look.' },
  { prop: 'size', type: "'sm' | 'md' | 'lg'", def: "'md'", desc: 'One height per size.' },
  { prop: 'disabled', type: 'boolean', def: 'false', desc: 'Blocks `onClick` and dims the control.' },
]

/* The props table: Prop · Type · Default · Description. */
export default function DocTableDemo() {
  return <DocTable rows={ROWS} />
}

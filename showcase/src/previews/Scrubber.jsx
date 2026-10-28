import { Scrubber } from '@kolkrabbi/kol-hardware'
import { createTransport } from '@kolkrabbi/kol-hardware/signal'

export const stage = 'sm'

/* the Transport panel's strip, `|-->----------|`, IN to OUT: grab it to move the head */
const transport = createTransport({ loopIn: 0, loopOut: 4, looping: true })

export default function ScrubberPreview() {
  return <Scrubber transport={transport} width={232} />
}

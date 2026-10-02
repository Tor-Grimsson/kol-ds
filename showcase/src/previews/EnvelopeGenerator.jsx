import { EnvelopeGenerator } from '@kolkrabbi/kol-hardware'

export const stage = 'full'

export default function EnvelopeGeneratorPreview() {
  // it fills its parent's height — a tool frame's body in an app, a fixed box here
  return <div className="h-[720px] w-full"><EnvelopeGenerator /></div>
}

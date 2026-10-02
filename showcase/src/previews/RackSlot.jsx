import { RackCase, RackRow, RackSlot, ModuleFrame } from '@kolkrabbi/kol-hardware'

export const stage = 'full'

/* Slots of 4, 8 and 12hp in a 1U row — a slot is a width and the row's height, nothing drawn. */
export default function RackSlotPreview() {
  return (
    <div className="overflow-x-auto">
      <RackCase hp={40}>
        <RackRow height="1u">
          <div style={{ display: 'flex', width: '100%', height: '100%', gap: 2, alignItems: 'flex-start' }}>
            {[4, 8, 12].map((hp) => (
              <RackSlot key={hp} hp={hp} u={1}><ModuleFrame label={`${hp}hp`} u={1} /></RackSlot>
            ))}
          </div>
        </RackRow>
      </RackCase>
    </div>
  )
}

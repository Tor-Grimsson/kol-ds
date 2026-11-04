import { FlyoutRow } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* a destination in a hover flyout — the lit one is where you are */
export default function FlyoutRowPreview() {
  return (
    <div className="flex w-[284px] flex-col gap-1">
      <FlyoutRow icon="checklist" label="Tasks" count={5} active onClick={() => {}} />
      <FlyoutRow icon="inbox" label="Capture" count={3} onClick={() => {}} />
      <FlyoutRow icon="folder" label="Projects" onClick={() => {}} />
    </div>
  )
}

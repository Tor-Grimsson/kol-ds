import { Icon } from '@kolkrabbi/kol-component'
import { RailRow } from '@kolkrabbi/kol-workshop'

export default function RailRowPreview() {
  return (
    <nav className="shell-nav-items w-56">
      <RailRow active onClick={() => {}}>Button</RailRow>
      <RailRow onClick={() => {}} icon={<Icon name="hash-02" size={14} />}>components</RailRow>
      <RailRow onClick={() => {}} trailing="12">Atoms</RailRow>
    </nav>
  )
}

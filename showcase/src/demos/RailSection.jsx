import { RailRow, RailSection } from '@kolkrabbi/kol-workshop'

export default function RailSectionDemo() {
  return (
    <div className="w-56">
      <RailSection level={1} label="Library">
        <RailSection level={2} label="Atoms" count={2}>
          <nav className="shell-nav-items">
            <RailRow onClick={() => {}}>Badge</RailRow>
            <RailRow active onClick={() => {}}>Button</RailRow>
          </nav>
        </RailSection>
      </RailSection>
    </div>
  )
}

import { MemoryRouter } from 'react-router-dom'
import { SubPageHero } from '@kolkrabbi/kol-framework'

/* backTo renders a react-router <Link>, so wrap in MemoryRouter. */
export const Default = () => (
  <MemoryRouter initialEntries={['/canalix/marks']}>
    <SubPageHero
      backTo="/canalix"
      backLabel="← back to canalix"
      label="canalix · marks"
      title="Marks"
      lede="Product icon family — 15 accented + 21 monochrome. Every fill that was white / near-white is now currentColor, so the marks inherit the theme."
    />
  </MemoryRouter>
)

/* No backTo — the back link is omitted. */
export const NoBackLink = () => (
  <MemoryRouter initialEntries={['/casedoc/websites']}>
    <SubPageHero
      label="casedoc · websites"
      title="casedoc.io"
      lede="Home family + Product detail + loose screens. Click a comp to open fullscreen."
    />
  </MemoryRouter>
)

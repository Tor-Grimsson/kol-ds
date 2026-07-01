import { MemoryRouter } from 'react-router-dom'
import { ExitPreview } from '@kolkrabbi/kol-component'

// ExitPreview renders a react-router <Link>, so it must sit inside a Router.
export const Default = () => (
  <MemoryRouter>
    <ExitPreview />
  </MemoryRouter>
)

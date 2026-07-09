import { Outlet } from 'react-router-dom'
import { useTagMode } from './TagModeContext.jsx'
import TagModeOverlay from './TagModeOverlay.jsx'

const TagModeGate = () => {
  const { isOpen } = useTagMode()
  return (
    <>
      <div style={isOpen ? { display: 'none' } : undefined}>
        <Outlet />
      </div>
      {isOpen && <TagModeOverlay />}
    </>
  )
}

export default TagModeGate

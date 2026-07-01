// Global provider for every story. The single CSS import here assembles the
// full KOL cascade (see ../src/index.css) so components render on-brand.
import '../src/index.css'

// Centre every story on a padded stage so components aren't stranded top-left.
export const Provider = ({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 48,
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
)

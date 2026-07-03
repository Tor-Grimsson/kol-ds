import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'

/* Stand-in for an app icon registry (the EditorIcon case) — Button's
 * `iconComponent` seam resolves icon names here instead of the DS Icon. */
const GLYPHS = {
  dot: <circle cx="8" cy="8" r="4" fill="currentColor" />,
  ring: <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />,
}
const RegistryIcon = ({ name, size = 16, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...rest}>{GLYPHS[name]}</svg>
)

export default function ButtonPressedDemo() {
  const [pressed, setPressed] = useState(true)
  return (
    <>
      <Button quiet iconOnly="rectangle" pressed={pressed} onClick={() => setPressed((v) => !v)} aria-label="Rectangle tool" />
      <Button variant="ghost" pressed={pressed} onClick={() => setPressed((v) => !v)}>Toggle</Button>
      <Button iconLeft="ring" iconComponent={RegistryIcon}>Custom registry</Button>
      <Button quiet iconOnly="dot" iconComponent={RegistryIcon} aria-label="Dot tool" />
    </>
  )
}

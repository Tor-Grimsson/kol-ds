// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1076-27819
// source=packages/component/src/molecules/FullscreenOverlay.jsx
// component=Overlay
import figma from 'figma'
// the scrim behind a modal sheet
export default {
  example: figma.code`<FullscreenOverlay open={open} onClose={close}>{sheet}</FullscreenOverlay>`,
  imports: ["import { FullscreenOverlay } from \"@kolkrabbi/kol-component\""],
  id: 'Overlay',
}

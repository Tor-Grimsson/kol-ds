// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1859-610
// source=packages/icons/src
// component=Icon
import figma from 'figma'

const suffix = figma.selectedInstance.getEnum('solid', { "true": "-solid", "false": "" })

export default {
  example: figma.code`<IconLoader name="skip-forward-15${suffix}" />`,
  imports: ["import { IconLoader } from \"@kolkrabbi/kol-component\""],
  id: 'skip-forward-15',
}

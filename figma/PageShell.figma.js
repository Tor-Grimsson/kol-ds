// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=413-11647
// source=packages/shell/src/PageShell.jsx
// component=PageShell
import figma from 'figma'

/* the gutter and the ground; the page is the `page` slot. variant=desktop|phone is the breakpoint (48 / 20 gutter),
 * not a prop: the code takes it from --kol-shell-page-pad */
export default {
  example: figma.code`<PageShell>{children}</PageShell>`,
  imports: ["import { PageShell } from \"@kolkrabbi/kol-shell\""],
  id: 'PageShell',
}

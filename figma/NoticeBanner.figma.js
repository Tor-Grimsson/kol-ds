// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=583-20319
// source=packages/component/src/molecules/NoticeBanner.jsx
// component=NoticeBanner
import figma from 'figma'

export default {
  example: figma.code`<NoticeBanner title="Calendar needs attention" body="Unexpected response from gcalcli." action="Reconnect" onAction={reconnect} />`,
  imports: ["import { NoticeBanner } from \"@kolkrabbi/kol-component\""],
  id: 'NoticeBanner',
}

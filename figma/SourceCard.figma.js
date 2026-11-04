// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=561-19060
// source=packages/dashboards/src/cards/SourceCard.jsx
// component=SourceCard
import figma from 'figma'


export default {
  example: figma.code`<SourceCard code="#KOL-OB" title="Obsidian" status="Needs attention" message="Unable to load captures." detail="The source returned an unexpected response." action="Retry" onAction={retry} />`,
  imports: ["import { SourceCard } from \"@kolkrabbi/kol-dashboards\""],
  id: 'SourceCard',
}

// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1076-27821
// source=packages/component/src/organisms/MediaLibraryPages.jsx
// component=MediaLibrary/header
import figma from 'figma'
// the page header MediaLibrary draws: wordmark, bucket Dropdown, header actions
export default {
  example: figma.code`<MediaLibrary {...media.props} />`,
  imports: ["import { MediaLibrary } from \"@kolkrabbi/kol-component\""],
  id: 'MediaLibrary/header',
}

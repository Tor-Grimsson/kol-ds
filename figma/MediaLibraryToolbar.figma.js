// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1076-27823
// source=packages/component/src/organisms/MediaLibraryPages.jsx
// component=MediaLibrary/toolbar
import figma from 'figma'
// the page toolbar: title, filter · search, view toggle, page tabs
export default {
  example: figma.code`<MediaLibrary {...media.props} />`,
  imports: ["import { MediaLibrary } from \"@kolkrabbi/kol-component\""],
  id: 'MediaLibrary/toolbar',
}

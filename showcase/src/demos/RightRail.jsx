import { RightRail } from '@kolkrabbi/kol-workshop'
import { Icon } from '@kolkrabbi/kol-icons'

export const stage = 'sm'

/* The right rail: this page's outline, its links, its tags. */
export default function RightRailDemo() {
  return (
    <RightRail
      toc={[{ id: 'installation', label: 'Installation' }, { id: 'usage', label: 'Usage' }]}
      activeId="installation"
      related={[{ id: 'badge', label: 'Badge', href: '/components/badge' }]}
      actions={[{ id: 'copy', label: 'Copy path', icon: <Icon name="copy" size={14} />, onClick: () => {} }]}
      tags={['domain/components', 'pattern/action']}
      tagsHref="/search/tags"
      icon={Icon}
    />
  )
}

import { Header } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['nav', 'property', 'modal', 'settings']

const noop = () => {}

/* the one header, each variant with the toggles it wears in place */
export default function HeaderPreview({ variant = 'property' }) {
  const props = {
    nav: { icon: 'grid', title: 'Workspace', onSwitch: noop, onCollapseV: noop },
    property: { title: 'Properties', onExpand: noop, onCollapseH: noop, onCollapseV: noop },
    modal: { icon: 'user', title: 'Account', onMinimise: noop, onClose: noop },
    settings: { title: 'Stripe Array', kind: 'Generate', onClose: noop },
  }[variant]
  return <div style={{ width: variant === 'settings' ? 560 : 264 }}><Header variant={variant} {...props} /></div>
}

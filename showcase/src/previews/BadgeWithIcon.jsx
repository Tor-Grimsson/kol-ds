import { Badge } from '@kolkrabbi/kol-component'

/* the variant rides the picker (2026-10-09 — "just show default and give options to variants") */
export const variants = ['success', 'warning', 'critical']
const ICON = { success: 'check', warning: 'alert-triangle', critical: 'x' }
const TEXT = { success: 'Verified', warning: 'Pending', critical: 'Failed' }

export default function BadgeWithIconPreview({ variant = 'success' }) {
  return <Badge variant={variant} icon={ICON[variant]}>{TEXT[variant]}</Badge>
}

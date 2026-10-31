import AppFloatNav, { APP_FLOAT_NAV_VARIANTS } from './AppFloatNav.jsx'

/**
 * @deprecated 2026-10-30 → `AppFloatNav` — the same nav, the same props (AppFloatNav, kol-fxr: the floating nav is one
 * family). PhoneNav's `variant="nav"` is AppFloatNav's `mobile`; the alias maps it, AppFloatNav does not take `nav`. The
 * old file is in `_tmp/2026-10-30-phone-nav-transport-pill/`.
 */
export default function PhoneNav({ variant, ...props }) {
  return <AppFloatNav {...props} variant={variant === 'nav' ? 'mobile' : variant} />
}

/** @deprecated 2026-10-30 → `APP_FLOAT_NAV_VARIANTS` (`nav` is `mobile` there) */
export const PHONE_NAV_VARIANTS = { ...APP_FLOAT_NAV_VARIANTS, nav: APP_FLOAT_NAV_VARIANTS.mobile }

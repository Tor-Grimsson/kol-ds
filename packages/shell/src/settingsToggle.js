import { createContext, useContext } from 'react'

/* Settings-toggle context — own file so AppShell exports only components
 * (the react-refresh constraint `navHidden.js` was split out for).
 *
 * WHY A HOOK AND NOT JUST THE PROPS (SettingsToggleGestureConsumerSeam, kol-fxr
 * 2026-08-30). `settingsKey` navigates unconditionally, and that is wrong for an
 * app whose settings are sometimes a DRAWER: on kol-fxr's `/editor`, `,` opens
 * the panel in place and must not leave the canvas. Its rule is "open whatever
 * settings is available", which only the app can know.
 *
 * So the shell keeps what is genuinely shared — the return path, and the rail
 * row toggling — and hands out the toggle for a consumer that owns the gesture.
 * Without this, fxr had to keep its whole local copy (a `lastPage` ref and a
 * branch in `onNavigate`) to keep one line of app-specific routing, which is
 * the duplication `settingsPath` exists to end.
 *
 * No-op when `settingsPath` is unset, and safe outside an AppShell — a hook
 * that throws on a missing provider would make it unusable in exactly the
 * conditional places it is for. */
export const SettingsToggleContext = createContext(null)
export const useSettingsToggle = () => useContext(SettingsToggleContext) ?? (() => {})

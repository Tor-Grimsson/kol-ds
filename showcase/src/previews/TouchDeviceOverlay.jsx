import { TouchDeviceOverlay } from '@kolkrabbi/kol-shell'

/* It only shows on a touch-primary device, once. `force` shows it here regardless — on a desk, and
 * again after it was dismissed — so the note can be seen at all (user ruling 2026-10-01). */
export default function TouchDeviceOverlayPreview() {
  return <TouchDeviceOverlay appName="Monitor" force />
}

/* a fixed overlay with a scrim: it runs in its own document */
export const frame = 420

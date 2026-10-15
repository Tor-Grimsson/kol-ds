import { createContext, useContext, useMemo, useState } from 'react'

/**
 * RailSlotProvider / useRailSlot — a consumer slot in NavRail's opened width (NavRailConsumerSlot,
 * kol-monitor 2026-10-15). The rail renders in AppShell's own tree, outside the page's providers,
 * so it cannot read page state and the page cannot render into it. The rail publishes its slot's
 * DOM node here instead, and the page portals into it with its own state:
 *
 *   <RailSlotProvider><AppStudio … /></RailSlotProvider>
 *   const rail = useRailSlot(); rail?.slot && createPortal(<Panel />, rail.slot)
 *
 * The provider goes ABOVE the shell so the rail and the page both see it. No provider → no slot,
 * and the rail renders as it did. `railOpen` mirrors the rail's open state for the page.
 *
 * Monitor's shape (`src/hooks/useRailSlot.jsx`), shipped so its NavRail fork can retire.
 */
const RailSlotContext = createContext(null)

export function useRailSlot() {
  return useContext(RailSlotContext)
}

export function RailSlotProvider({ children }) {
  const [slot, setSlot] = useState(null)
  const [railOpen, setRailOpen] = useState(false)
  const value = useMemo(() => ({ slot, setSlot, railOpen, setRailOpen }), [slot, railOpen])
  return <RailSlotContext.Provider value={value}>{children}</RailSlotContext.Provider>
}

import { PopoverPanel } from '@kolkrabbi/kol-component'

/* The window a real rail tab opens as in kolbox (round 3, 4.1): his left rail keeps file header, Pages and Layers only
   (Figma plan W7), so Assets, History, Navigator, Stroke, Color, Swatches, Output and File each open on their own. The
   real tabs are rail-sized panes (StrokePanel, SwatchesPanel, ColourPanel draw them 320 wide), so the window is a
   Popover at the left rail's right edge, its top level with the rail's, 320 wide (w-pane), not a centred Modal.
   name: the window's id, read by scripts as data-window. */
export default function WindowPane({ title, name, onClose, children }) {
  return (
    <PopoverPanel variant="kolbox"
      anchor={document.querySelector('[data-rail="left"]') ?? document.querySelector('[data-canvas]')}
      open
      onClose={onClose}
      placement="right-start"
      title={title}
      width="var(--spacing-pane)"
    >
      <div className="flex flex-col gap-3 px-4 pb-4" data-window={name}>{children}</div>
    </PopoverPanel>
  )
}

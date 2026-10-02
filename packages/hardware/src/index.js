// @kolkrabbi/kol-hardware — hardware panel controls for instruments: everything drawn as hardware
// (mixers, synths, racks, decks). Renamed from kol-controls 2026-09-27 (user ruling: "hardware"
// says what it is — `controls` also meant the app atoms). Five groups:
//
//   value        things you turn or slide — Knob · Fader · the touch ParamSheet
//   switches     hardware switches and buttons — Toggle · FlipToggle · RockerSwitch · IconButton
//   indicators   lights and patching — LED · JackSocket · LabeledJack
//   panel        panel furniture — PanelLabel · ModuleHeader
//   frames       the shells a module is built in — ModuleFrame · ChannelStrip · FlipCard — and the
//                rack they mount in: RackCase · RackRow · RackSlot
//
// App-scale inputs are kol-component's (Dropdown · Input · Stepper at size="xs"); the panel copies
// retired in kol-controls 0.3.0 (ControlsXsRung).

// value
export { default as Knob } from './value/Knob.jsx'
export { default as Fader } from './value/Fader.jsx'
export { default as ParamSheet } from './value/ParamSheet.jsx'
/* moved to kol-component with the controls that arm it (2026-10-01); re-exported so imports hold */
export { armLongPress } from '@kolkrabbi/kol-component'
// switches
export { default as Toggle } from './switches/Toggle.jsx'
export { default as FlipToggle } from './switches/FlipToggle.jsx'
export { default as RockerSwitch } from './switches/RockerSwitch.jsx'
export { default as IconButton } from './switches/IconButton.jsx'
// indicators
export { default as LED } from './indicators/LED.jsx'
export { default as JackSocket } from './indicators/JackSocket.jsx'
export { default as LabeledJack } from './indicators/LabeledJack.jsx'
// panel
export { default as PanelLabel } from './panel/PanelLabel.jsx'
export { default as ModuleHeader } from './panel/ModuleHeader.jsx'
// frames
export { default as ModuleFrame } from './frames/ModuleFrame.jsx'
export { default as ChannelStrip } from './frames/ChannelStrip.jsx'
export { default as FlipCard } from './frames/FlipCard.jsx'
/* the rack (2026-10-01, user ruling: it comes into the design system) — the case, its 1U/3U rows
 * and the HP slot, lifted from kol-monitor; what mounts where and routing stay in the consumer */
export { default as RackCase, RackRow, RackSlot } from './frames/Rack.jsx'
export { HP_PX, TOTAL_HP, MIN_HP, ROW_HEIGHT, RAIL_HEIGHT, hpToPx } from './frames/eurorack.js'
// signal — the components over the signal engine (the engine itself, React-free, is `./signal`)
export { default as SignalScope } from './indicators/SignalScope.jsx'
export { default as SignalReference } from './panel/SignalReference.jsx'
export { default as EnvelopeGenerator, useEnvelopeGenerator, EnvelopeModeToggle, adsrCode } from './value/EnvelopeGenerator.jsx'

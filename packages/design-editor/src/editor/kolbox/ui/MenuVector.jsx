import { Menu } from '@kolkrabbi/kol-component'

/* MenuVector (Figma 262:39360): the Vector menu, one Menu beside MenuBoolean. The four boolean operations and Release
   boolean, then Shape parameters…, Convert to path and Blend… (W11.2: Shape parameters and Convert to path moved here
   from the rail's old Parameters section). vectorGroups builds the rows from the host's handlers, so the main menu's
   Vector submenu and this menu are one list: { ops: [{ label, run, disabled }], release, nodes, shapeParams, convert, blend },
   each { run, disabled, shortcut }. */
export function vectorGroups({ ops = [], release = {}, nodes = {}, shapeParams = {}, convert = {}, blend = {} } = {}) {
  return [
    [...ops, { label: 'Release boolean', ...release }],
    [
      /* node edit, the rail header's Edit object that the file does not draw (14, lost controls) */
      { label: 'Edit nodes', ...nodes },
      { label: 'Shape parameters…', ...shapeParams },
      { label: 'Convert to path', ...convert },
      { label: 'Blend…', ...blend },
    ],
  ]
}

/* `shapeParams` asks the right rail to open the selected shape's parameters (Properties listens) */
export const SHAPE_PARAMS_EVENT = 'kolbox:shape-params'
export const openShapeParams = () => window.dispatchEvent(new CustomEvent(SHAPE_PARAMS_EVENT))

export default function MenuVector({ anchor, open, onClose, groups = vectorGroups() }) {
  return <Menu variant="kolbox" aria-label="Vector" anchor={anchor} open={open} onClose={onClose} onSelect={(row) => row.run?.()} groups={groups} />
}

/* THE LAYER STACK — which open overlay owns the keyboard (2026-09-23). Every overlay and drawer
 * listened for Escape and Tab on `document`, so with a sheet open over a drawer one Escape closed
 * BOTH, and two focus traps fought over Tab. Each layer pushes itself on open and pops on close;
 * only the top one answers. Order is open order, which is stacking order. */
const stack = []

export function pushLayer() {
  const id = {}
  stack.push(id)
  return id
}

export function popLayer(id) {
  const i = stack.indexOf(id)
  if (i !== -1) stack.splice(i, 1)
}

export const isTopLayer = (id) => stack[stack.length - 1] === id

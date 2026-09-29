/**
 * tagGraph — the index's tags as a network: a node per tag (its item count), an edge between two tags
 * that share an item (weighted by how many). The node graph is a VIEW OF THE SEARCH INDEX (apps
 * review 2026-09-29, ruling D4: *"network nodes/keyword indexing and visualisation"* belong together),
 * so the data lives in the engine; the drawing (kol-workshop's d3 `TagGraph`) stays UI.
 *
 * Takes engine items — anything with `id` and `tags[]`, the shape `createIndex` takes. Tag ids are
 * lower-cased. Moved here from kol-markdown's `buildTagCooccurrence`, which now adapts onto this.
 *
 * @returns {{ nodes: [{ id, count, type: 'tag' }], edges: [{ source, target, weight }] }}
 */
export function tagGraph(items = []) {
  const docs = new Map() // tag → Set of item ids
  for (const item of items) {
    for (const raw of Array.isArray(item?.tags) ? item.tags : []) {
      const tag = String(raw).toLowerCase()
      if (!docs.has(tag)) docs.set(tag, new Set())
      docs.get(tag).add(item.id)
    }
  }
  const nodes = [...docs.entries()]
    .map(([id, set]) => ({ id, count: set.size, type: 'tag' }))
    .sort((a, b) => b.count - a.count)
  const tags = [...docs.keys()]
  const edges = []
  for (let i = 0; i < tags.length; i++) {
    for (let j = i + 1; j < tags.length; j++) {
      let weight = 0
      for (const id of docs.get(tags[i])) if (docs.get(tags[j]).has(id)) weight++
      if (weight) edges.push({ source: tags[i], target: tags[j], weight })
    }
  }
  return { nodes, edges }
}

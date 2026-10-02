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

/**
 * indexGraph — the index as a network of tags AND the items that carry them (2026-10-01 — user
 * ruling on the graph: files and orphans beside tags, with a filter). With nothing switched on it is
 * `tagGraph`.
 *
 *   files    a node per tagged item, joined to each of its tags. The tag-to-tag edges go: with the
 *            items drawn, two tags are joined THROUGH the items they share, which is what the
 *            co-occurrence edge was standing in for.
 *   orphans  a node per item with no tags — joined to nothing, which is the point of seeing them.
 *   filter   keeps the nodes whose id or label holds the text, and the edges between two kept nodes.
 *
 * Item nodes are `{ id: 'file:<item id>', label, href, count: 1, type: 'file', orphan }`.
 *
 * @returns {{ nodes: [{ id, count, type, label?, href?, orphan? }], edges: [{ source, target, weight }] }}
 */
export function indexGraph(items = [], { files = false, orphans = false, filter = '' } = {}) {
  const base = tagGraph(items)
  let nodes = [...base.nodes]
  let edges = files ? [] : [...base.edges]
  for (const item of items) {
    const tags = (Array.isArray(item?.tags) ? item.tags : []).map((t) => String(t).toLowerCase())
    const orphan = tags.length === 0
    if (orphan ? !orphans : !files) continue
    const id = `file:${item.id}`
    nodes.push({ id, label: item.title ?? String(item.id), href: item.href, count: 1, type: 'file', orphan })
    for (const tag of new Set(tags)) edges.push({ source: id, target: tag, weight: 1 })
  }
  const q = String(filter).trim().toLowerCase()
  if (q) {
    nodes = nodes.filter((n) => `${n.id} ${n.label ?? ''}`.toLowerCase().includes(q))
    const kept = new Set(nodes.map((n) => n.id))
    edges = edges.filter((e) => kept.has(e.source) && kept.has(e.target))
  }
  return { nodes, edges }
}

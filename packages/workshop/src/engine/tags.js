/**
 * Pure tag aggregation over a docs inventory — zero dependencies, no React, no d3.
 *
 * Extracted from TagModeOverlay (`buildTagCounts`) and TagGraph
 * (`buildTagCooccurrence`) so the counting/co-occurrence math is testable in
 * isolation and the components stay presentational. Each takes the docs
 * `inventory` (array of `{ id, metadata: { tags: string[] } }`) and returns
 * plain data.
 *
 * Case handling is deliberately NOT unified — it preserves the two call sites'
 * original behaviour:
 *   - buildTagCounts       keeps tags exact-case (the overlay's tag list)
 *   - buildTagCooccurrence lowercases tags (the graph's node ids)
 */

/**
 * Count docs per tag, tags kept exact-case. Returns `[{ tag, count }]` sorted
 * by count descending.
 */
export const buildTagCounts = (inventory = []) => {
  const counts = {}
  inventory.forEach((d) => {
    if (Array.isArray(d.metadata?.tags)) {
      d.metadata.tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1
      })
    }
  })
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Build the tag co-occurrence graph. Tag ids are lowercased. Nodes are all
 * tags with their doc counts (sorted desc); edges connect any two tags that
 * share at least one doc, weighted by the number of shared docs.
 *
 * Returns `{ nodes: [{ id, count, type: 'tag' }], edges: [{ source, target, weight }] }`.
 */
export const buildTagCooccurrence = (inventory = []) => {
  const tagCounts = {}
  const tagToDocs = {} // tag -> Set of doc ids

  inventory.forEach((doc) => {
    const tags = doc.metadata?.tags || []
    tags.forEach((tag) => {
      const tagLower = tag.toLowerCase()
      tagCounts[tagLower] = (tagCounts[tagLower] || 0) + 1
      if (!tagToDocs[tagLower]) {
        tagToDocs[tagLower] = new Set()
      }
      tagToDocs[tagLower].add(doc.id)
    })
  })

  const nodes = Object.entries(tagCounts)
    .map(([tag, count]) => ({ id: tag, count, type: 'tag' }))
    .sort((a, b) => b.count - a.count)

  const edges = []
  const tagList = Object.keys(tagToDocs)
  for (let i = 0; i < tagList.length; i++) {
    for (let j = i + 1; j < tagList.length; j++) {
      const tagA = tagList[i]
      const tagB = tagList[j]
      const commonDocs = [...tagToDocs[tagA]].filter((id) => tagToDocs[tagB].has(id))
      if (commonDocs.length > 0) {
        edges.push({ source: tagA, target: tagB, weight: commonDocs.length })
      }
    }
  }

  return { nodes, edges }
}

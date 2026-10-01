import { useEffect, useRef, useMemo, useState } from 'react'
import * as d3 from 'd3'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { getTagColor } from '@kolkrabbi/kol-markdown'
import { tagGraph } from '@kolkrabbi/kol-search'
import { EASE, DURATION, s } from '@kolkrabbi/kol-component/utilities/motion'

/**
 * TagGraph - Obsidian-style tag graph
 * All tags shown as interconnected nodes with force-directed layout
 * Lines connect tags that share common docs
 * Draggable nodes, click to navigate
 *
 * `tagHref(tag)` builds the navigation target when no `onTagClick` is provided
 * (route-decoupled — no hardcoded workshop paths here).
 *
 * REBUILT (the showcase review W14, 2026-09-30 — user: *"the node graph is fucked, it needs better
 * gsap and physics. asap."*). What was wrong, and what replaced it:
 *
 *   - ONE SIMULATION. Every hover and every active-tag change wiped the SVG and restarted the
 *     simulation from random positions, so the graph re-exploded on each interaction. The layout now
 *     builds once per data/size; highlight is a separate, tweened pass over the same elements.
 *   - PHYSICS THAT SCALES. Fixed numbers (charge −150, link 60, collide 30) whatever the graph held.
 *     Now: charge by node size and capped in range, link length and pull by how many pages two tags
 *     share, a gentle gravity so the cluster stays centred, collision from the drawn radius. Seeded on
 *     a phyllotaxis spiral and settled BEFORE the first frame, so it opens composed, not exploding.
 *   - MOTION ON THE HOUSE CURVE. Nodes grow in from the centre outward, edges fade in, the view eases
 *     to fit; hovering a tag brings it and its neighbours forward and dims the rest. Durations and
 *     curves are kol-component's motion constants; reduced motion skips the tweens.
 *   - LABELS WHERE THEY HELP. Every node printed its name; now the larger tags carry a label at rest
 *     and the rest show theirs when focused.
 */
const defaultTagHref = (tag) => `/workshop/design-system/documentation?tag=${encodeURIComponent(tag)}`

const radiusOf = (d) => Math.max(5, Math.min(14, 4 + Math.sqrt(d.count) * 2.2))
const fillOf = (d) => {
  /* palette tokens, not copies; `dark` is a surface role with no palette entry */
  const key = getTagColor(d.id)
  return key === 'dark' ? 'var(--kol-surface-on-primary)' : `var(--kol-palette-${key}, var(--kol-palette-teal))`
}
const EDGE = 'color-mix(in srgb, var(--kol-surface-on-primary) 24%, transparent)'
const ACCENT = 'var(--kol-accent-primary)'

const TagGraph = ({ docs, activeTag, onTagClick, allDocs, tagHref = defaultTagHref }) => {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const navigate = useNavigate()
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 })
  const [hoveredNode, setHoveredNode] = useState(null)
  const activeRef = useRef(activeTag)
  activeRef.current = activeTag

  const sourceDocs = allDocs || docs
  /* the engine's graph (kol-search `tagGraph`, 2026-09-29) over the docs' tags */
  const graphData = useMemo(() => tagGraph(sourceDocs.map((d) => ({ id: d.id, tags: d.metadata?.tags ?? [] }))), [sourceDocs])

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const { width } = containerRef.current.getBoundingClientRect()
      const size = Math.max(250, width)
      setDimensions((d) => (d.width === size ? d : { width: size, height: size }))
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  /* ── THE LAYOUT — once per data and size ─────────────────────────────────── */
  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return
    const { width, height } = dimensions
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const t = (ms) => (reduced ? 0 : s(ms))

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const g = svg.append('g')
    const zoom = d3.zoom().scaleExtent([0.3, 4]).on('zoom', (e) => g.attr('transform', e.transform))
    svg.call(zoom).on('dblclick.zoom', null)

    const nodes = graphData.nodes.map((d) => ({ ...d }))
    const links = graphData.edges.map((d) => ({ ...d }))
    const maxW = d3.max(links, (l) => l.weight) || 1
    const counts = nodes.map((d) => d.count).sort((a, b) => b - a)
    /* the eight biggest tags keep their label at rest; the rest show on focus */
    const labelFloor = counts[Math.min(7, counts.length - 1)] ?? 0

    /* neighbours, for focus */
    const near = new Map(nodes.map((d) => [d.id, new Set([d.id])]))
    for (const l of graphData.edges) { near.get(l.source)?.add(l.target); near.get(l.target)?.add(l.source) }

    /* seed on a phyllotaxis spiral, biggest first — deterministic, and already roughly in place */
    const cx = width / 2
    const cy = height / 2
    ;[...nodes].sort((a, b) => b.count - a.count).forEach((d, i) => {
      const r = 10 * Math.sqrt(i + 0.5)
      const a = i * 2.39996
      d.x = cx + r * Math.cos(a)
      d.y = cy + r * Math.sin(a)
    })

    const span = Math.min(width, height)
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d) => d.id)
        .distance((l) => 45 + 95 * (1 - l.weight / maxW))
        .strength((l) => 0.08 + 0.4 * (l.weight / maxW)))
      .force('charge', d3.forceManyBody().strength((d) => -70 - radiusOf(d) * 16).distanceMax(span * 0.8))
      .force('x', d3.forceX(cx).strength(0.07))
      .force('y', d3.forceY(cy).strength(0.07))
      .force('collide', d3.forceCollide((d) => radiusOf(d) + 9).iterations(2))
      .velocityDecay(0.38)
      .alphaDecay(0.035)
      .stop()
    /* settle before the first frame — it opens composed, not exploding */
    for (let i = 0; i < 260; i++) sim.tick()

    const link = g.append('g').attr('class', 'links').selectAll('line').data(links).enter().append('line')
      .attr('stroke', EDGE)
      .attr('stroke-width', (l) => 0.6 + 1.6 * (l.weight / maxW))
      .attr('stroke-linecap', 'round')
      .attr('opacity', 0)

    const node = g.append('g').attr('class', 'nodes').selectAll('g').data(nodes).enter().append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')

    const circle = node.append('circle')
      .attr('r', 0)
      .attr('fill', fillOf)
      .attr('stroke', 'var(--kol-surface-primary)')
      .attr('stroke-width', 1.5)

    const label = node.append('text')
      .text((d) => `#${d.id}`)
      .attr('dy', (d) => radiusOf(d) + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--kol-fg-72)')
      .attr('font-family', 'var(--kol-font-family-mono)')
      .attr('font-size', '9px')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)

    const place = () => {
      link.attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y).attr('x2', (d) => d.target.x).attr('y2', (d) => d.target.y)
      node.attr('transform', (d) => `translate(${d.x}, ${d.y})`)
    }
    place()
    sim.on('tick', place)

    /* ── the resting look, and a focus — both tweened ── */
    const restLabel = (d) => (d.count >= labelFloor ? 1 : 0)
    const paint = (focusId) => {
      const lit = focusId ? near.get(focusId) : null
      const act = activeRef.current
      gsap.to(circle.nodes(), {
        duration: t(DURATION.slow),
        ease: EASE.houseGsap,
        opacity: (i) => (lit ? (lit.has(nodes[i].id) ? 1 : 0.15) : act && nodes[i].id !== act ? 0.45 : 0.95),
        attr: { r: (i) => radiusOf(nodes[i]) * (nodes[i].id === focusId ? 1.3 : 1) },
        overwrite: 'auto',
      })
      gsap.to(label.nodes(), {
        duration: t(DURATION.slow),
        ease: EASE.houseGsap,
        opacity: (i) => (lit ? (lit.has(nodes[i].id) ? 1 : 0) : nodes[i].id === act ? 1 : restLabel(nodes[i])),
        overwrite: 'auto',
      })
      gsap.to(link.nodes(), {
        duration: t(DURATION.slow),
        ease: EASE.houseGsap,
        opacity: (i) => {
          const l = links[i]
          const hit = (id) => l.source.id === id || l.target.id === id
          if (focusId) return hit(focusId) ? 1 : 0.06
          if (act) return hit(act) ? 1 : 0.15
          return 0.35
        },
        overwrite: 'auto',
      })
      /* the stroke is SET, not tweened — two color-mix()/var() strings do not interpolate */
      link.attr('stroke', (l) => {
        const id = focusId ?? act
        return id && (l.source.id === id || l.target.id === id) ? ACCENT : EDGE
      })
      circle.attr('stroke', (d) => (d.id === act ? ACCENT : 'var(--kol-surface-primary)'))
    }

    /* ── the entrance: edges fade, nodes grow from the centre outward, the view eases to fit ── */
    const dist = (d) => Math.hypot(d.x - cx, d.y - cy)
    const maxDist = d3.max(nodes, dist) || 1
    gsap.to(link.nodes(), { duration: t(DURATION.zoom), ease: EASE.houseGsap, opacity: 0.35 })
    gsap.to(circle.nodes(), {
      duration: t(DURATION.spring),
      ease: 'back.out(1.6)',
      attr: { r: (i) => radiusOf(nodes[i]) },
      opacity: 0.95,
      delay: (i) => (reduced ? 0 : (dist(nodes[i]) / maxDist) * 0.35),
      onComplete: () => paint(null),
    })
    gsap.to(label.nodes(), { duration: t(DURATION.zoom), delay: t(300), ease: EASE.houseGsap, opacity: (i) => restLabel(nodes[i]) })

    const [x0, x1] = d3.extent(nodes, (d) => d.x)
    const [y0, y1] = d3.extent(nodes, (d) => d.y)
    const pad = 36
    const k = Math.min(3, 0.95 * Math.min(width / (x1 - x0 + pad * 2 || 1), height / (y1 - y0 + pad * 2 || 1)))
    const fit = d3.zoomIdentity.translate(width / 2, height / 2).scale(k).translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
    svg.transition().duration(reduced ? 0 : DURATION.zoom).ease(d3.easeCubicInOut).call(zoom.transform, fit)

    /* ── interaction ── */
    node
      .on('click', (event, d) => {
        event.stopPropagation()
        if (onTagClick) onTagClick(d.id)
        else navigate(tagHref(d.id))
      })
      .on('mouseenter', (event, d) => { setHoveredNode(d); paint(d.id) })
      .on('mouseleave', () => { setHoveredNode(null); paint(null) })
      .call(d3.drag()
        .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.2).restart(); d.fx = d.x; d.fy = d.y })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y })
        .on('end', (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null }))

    sceneRef.current = { paint }
    return () => {
      sim.stop()
      gsap.killTweensOf([...circle.nodes(), ...label.nodes(), ...link.nodes()])
      svg.interrupt()
      sceneRef.current = null
    }
  }, [graphData, dimensions, navigate, onTagClick, tagHref])

  /* ── an active-tag change re-paints; it never rebuilds the layout ── */
  useEffect(() => { sceneRef.current?.paint(null) }, [activeTag])

  if (graphData.nodes.length === 0) {
    return (
      <div className="text-fg-48 kol-mono-12 py-4 px-2">
        No tags found.
      </div>
    )
  }

  return (
    <div ref={containerRef} className="tag-graph-sidebar">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="tag-graph-svg" />
      {hoveredNode && (
        <div className="tag-graph-tooltip kol-helper-10 text-emphasis">
          #{hoveredNode.id} ({hoveredNode.count} {hoveredNode.count === 1 ? 'doc' : 'docs'})
        </div>
      )}
    </div>
  )
}

export default TagGraph

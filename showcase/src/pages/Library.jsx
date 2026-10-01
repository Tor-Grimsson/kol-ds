import HomeDoc from '../lib/HomeDoc.jsx'
import { DocSection } from '@kolkrabbi/kol-workshop'
import CompositionDiagram from '../lib/CompositionDiagram.jsx'

/**
 * Library · Composition · Collection — the parents' homes (plan-2026-09-30-library-taxonomy).
 * Each is its markdown home, then the diagram of what it holds, drawn with THE diagram idiom
 * (CompositionDiagram — a container solid, a leaf dashed, every box a link).
 */

/* THE TREE — grandest parent to last child */
const TREE = {
  label: 'KOL — the design system',
  children: [
    { label: 'Styles — what everything is painted with', to: '/styles' },
    { label: 'Library — everything you build with', to: '/library', row: true, children: [
      { label: 'Composition — by size', to: '/composition', children: [
        { label: 'Components', to: '/components' },
        { label: 'Modules', to: '/modules' },
        { label: 'Apps', to: '/apps' },
      ] },
      { label: 'Collection — by belonging', to: '/collection', children: [
        { label: 'Sets', to: '/sets' },
        { label: 'Packages', to: '/packages' },
      ] },
    ] },
    { label: 'Reference — about the system', row: true, children: [
      { label: 'Docs', to: '/docs' },
      { label: 'Search', to: '/search' },
      { label: 'Development', to: '/development' },
    ] },
  ],
}

/* THE SIZE LADDER — a component inside a block inside an app */
const SIZES = {
  label: 'An app — a tool, read through its layers',
  to: '/apps',
  children: [
    { label: 'A module — shells and tools composed, at every width', to: '/modules', children: [
      { label: 'Components — one export with a face', to: '/components', row: true, children: [
        { label: 'Atom', to: '/components/tier/atoms' },
        { label: 'Molecule', to: '/components/tier/molecules' },
        { label: 'Organism', to: '/components/tier/organisms' },
      ] },
    ] },
  ],
  note: 'Utilities sit beside the ladder — no face of their own.',
}

/* SET vs PACKAGE — one set drawing from two packages; one package and what its page holds */
const BELONGING = {
  label: 'Collection',
  children: [
    { label: 'A set — Cards, grouped by purpose', to: '/cards', row: true, children: [
      { label: 'from kol-component — the Section* family', to: '/packages/component' },
      { label: 'from kol-content — the content cards', to: '/packages/content' },
    ] },
    { label: 'A package — kol-content, grouped by shipping', to: '/packages/content', row: true, children: [
      { label: 'its family — every component it ships' },
      { label: 'its changelog and version' },
    ] },
  ],
}

export default function Library() {
  return (
    <>
      <HomeDoc id="library" />
      <DocSection id="tree" title="The tree"><CompositionDiagram node={TREE} /></DocSection>
    </>
  )
}

export function Composition() {
  return (
    <>
      <HomeDoc id="composition" />
      <DocSection id="by-size" title="By size"><CompositionDiagram node={SIZES} /></DocSection>
    </>
  )
}

export function Collection() {
  return (
    <>
      <HomeDoc id="collection" />
      <DocSection id="by-belonging" title="By belonging"><CompositionDiagram node={BELONGING} /></DocSection>
    </>
  )
}

/* ICON CATEGORIES — a level above the groups (Round 15, decided on the recommendation 2026-10-20 —
 * user: "icons sure whatever you want, you choose"). Each category is a page (`/icons/<set>/<slug>`),
 * a fold in the rail with its groups under it, and a ⌘K row; the groups keep their own pages. A slug
 * never collides with a group folder in its set — the gallery reads the URL's last segment as a
 * category first, then a group — which is why Editing · Misc · Color from the round became
 * Design tools · Other · Color & gradient. */
export const ICON_CATEGORIES = {
  'kol-icon-set-interface': [
    { slug: 'arrows', name: 'Arrows', groups: ['chevron', 'arrow', 'arrow-diagonal', 'caret', 'traffic', 'transfer'] },
    { slug: 'actions', name: 'Actions', groups: ['add-remove', 'singletons', 'eye-lock', 'notify'] },
    { slug: 'navigation', name: 'Navigation', groups: ['nav', 'layout'] },
    { slug: 'content', name: 'Content', groups: ['files', 'code', 'components', 'atomic'] },
    { slug: 'design-tools', name: 'Design tools', groups: ['tools', 'editing', 'typography'] },
    { slug: 'media', name: 'Media', groups: ['playback', 'device'] },
    { slug: 'shapes', name: 'Shapes', groups: ['shape-primitives', 'shape-forms', 'pattern'] },
    { slug: 'brand', name: 'Brand', groups: ['identity', 'social'] },
    { slug: 'other', name: 'Other', groups: ['misc'] },
  ],
  'kol-icon-set-signal': [
    { slug: 'waves', name: 'Waves', groups: ['wave', 'curve', 'ramp', 'shaper', 'filter'] },
    { slug: 'patterns', name: 'Patterns', groups: ['dither', 'pattern', 'ascii', 'line', 'radial'] },
    { slug: 'color-gradient', name: 'Color & gradient', groups: ['generator', 'color', 'gradient'] },
    { slug: 'control', name: 'Control', groups: ['logic', 'sequence', 'transport', 'cable'] },
    { slug: 'geometry', name: 'Geometry', groups: ['shape', 'cap'] },
  ],
}

export const findCategory = (set, slug) => ICON_CATEGORIES[set]?.find((c) => c.slug === slug) ?? null
export const categoryOf = (set, folder) => ICON_CATEGORIES[set]?.find((c) => c.groups.includes(folder)) ?? null

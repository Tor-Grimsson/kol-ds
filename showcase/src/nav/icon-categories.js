/* ICON CATEGORIES — a level above the groups (Round 15, decided on the recommendation 2026-10-20 —
 * user: "icons sure whatever you want, you choose"). Each category is a page (`/icons/<set>/<slug>`),
 * a fold in the rail with its groups under it, and a ⌘K row; the groups keep their own pages. A slug
 * never collides with a group folder in its set — the gallery reads the URL's last segment as a
 * category first, then a group — which is why Editing · Misc · Color from the round became
 * Design tools · Other · Color & gradient. */
export const ICON_CATEGORIES = {
  /* interface (kol-icons 0.58.0, plan-2026-10-31-icon-categories): the folders ARE the user's 18 categories (20 since 2026-11-05: `communication` split out of people, then `games` — the chess sets), so no
   * category layer sits over them — each folder is its own page */
  'kol-icon-set-interface': [],
  'kol-icon-set-signal': [
    { slug: 'waves', name: 'Waves', groups: ['wave', 'curve', 'ramp', 'shaper', 'filter'] },
    { slug: 'patterns', name: 'Patterns', groups: ['dither', 'pattern', 'ascii', 'line', 'radial'] },
    { slug: 'color-gradient', name: 'Color & gradient', groups: ['generator', 'color', 'gradient'] },
    { slug: 'control', name: 'Control', groups: ['logic', 'sequence', 'transport', 'cable'] },
    { slug: 'geometry', name: 'Geometry', groups: ['shape', 'cap'] },
  ],
  /* identity (kol-icons 0.49.0): two groups, each its own page — no category layer over two rows */
  'kol-icon-set-identity': [],
  /* external (IconSetExternal, 2026-10-31): flags · brands, each its own page */
  'kol-icon-set-external': [],
}

export const findCategory = (set, slug) => ICON_CATEGORIES[set]?.find((c) => c.slug === slug) ?? null
export const categoryOf = (set, folder) => ICON_CATEGORIES[set]?.find((c) => c.groups.includes(folder)) ?? null

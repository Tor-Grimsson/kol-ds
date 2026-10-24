/**
 * SettingsPage — Monitor's settings as the ROWS of the Hub's settings rail, studio-hub's tier (user 2026-10-24: *"ITS A
 * RAIL"* · *"a rail with tabs like labs"*). Every word is Monitor's; the Hub draws every label, value and note in its
 * own class — the rows were JSX until 2026-10-24, which is how a settings surface could wear a class the template does
 * not. Monitor's content is the biggest of the three, so the rail carries Settings · Shortcuts · About · Repo as tabs
 * — the last three are the Hub's own, drawn from `shortcuts`, `APP.about` and `APP.links` — never a page.
 * The old page (`SettingsScaffold` with its JSX) is in `_tmp/2026-10-24-create-on-studiocreate/rack-hub/`.
 */
export const settings = {
  sections: [
    { label: 'Display', note: 'Zoom defaults — coming soon' },
    { label: 'Performance', note: 'Frame rate cap, render quality — coming soon' },
    {
      label: 'Patches',
      note: [
        'Monitor has no database or user accounts. The rack loads a default init patch on each visit. To keep your work, export it as a JSON file — this saves everything: case layout, modules, knob positions, and cable connections. Import that file to restore exactly where you left off.',
        'Available in the Patch module and the sidebar Presets section.',
      ],
      rows: [
        { label: 'Export', value: 'Downloads the current rack as a JSON file — modules, connections, and settings', align: 'fill' },
        { label: 'Import', value: 'Loads a JSON patch file into the rack, restoring the full state', align: 'fill' },
      ],
    },
  ],
  /* Shortcuts · About · Repo are on every rail now — the Hub's own (2026-10-24) */
}

/* About as DATA — paragraphs the Hub draws (2026-10-24) */
export const ABOUT = [
  'Monitor treats math the way eurorack treats voltage — as a universal, scalable medium. Generators compute geometry through trigonometry and parametric equations. A 3D wireframe is 6 trig calls and a rotation matrix. A Lissajous curve is two sine functions. The system draws geometry, not pixels, which is why 50 modules run at 60fps in a browser.',
  'The modular rack engine at the core of Monitor. 50 modules across 5 categories — control, math, generators, display, utility — connected through virtual patch cables and evaluated in topological order.',
]
export const LINKS = [
  { label: 'GitHub', url: 'https://github.com/Tor-Grimsson/kol-monitor' },
  { label: 'Kolkrabbi', url: 'https://monitor.kolkrabbi.io' },
  { label: 'Vercel', url: 'https://kol-monitor-six.vercel.app/' },
]

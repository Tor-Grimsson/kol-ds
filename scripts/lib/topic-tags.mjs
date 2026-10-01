/**
 * topic-tags.mjs — what a page is ABOUT, as tags (the showcase review W6, 2026-09-30).
 *
 * User: *"I've never seen any other tags than maybe 8 total … do we understand what tags are"* and
 * *"tags are always the same, never relating to the content, like hashtag consumer … how about
 * search query index"*. 208 showcase pages shared 35 tags; `domain/design-system` sat on 137 of them.
 *
 * A topic is a `domain/` leaf (the closed namespace set, docs-framework 03) matched on a page's own
 * words — its name, title and description. Narrow on purpose: a wrong tag is a wrong edge in the
 * tag graph. Shared by sync-mdx-frontmatter (new component pages) and the W6 retag.
 */
export const TOPICS = [
  [/\b(search|query|palette|find)\w*/i, 'domain/search'],
  [/\b(filter|sort|facet)\w*/i, 'domain/filtering'],
  [/\b(media|image|video|audio|photo|gallery|carousel|thumb|playback|player)\w*/i, 'domain/media'],
  [/\b(file|bucket|folder|document|upload|pdf|kind)s?\b/i, 'domain/files'],
  [/\b(nav|navigation|rail|sidenav|menu|tab|tabs|breadcrumb|drawer)\b/i, 'domain/navigation'],
  [/\b(input|field|form|dropdown|select|toggle|switch|checkbox|slider|stepper|picker|quantity)\b/i, 'domain/forms'],
  [/\b(table|record|cms)\b/i, 'domain/data'],
  [/\b(chart|metric|dashboard|scope|kpi|heatmap)\w*/i, 'domain/dashboards'],
  [/\b(editor|canvas|layer|inspector|crop|keyframe|curve|tool)\w*/i, 'domain/editor'],
  [/\b(chess|board|piece|game|notation)\w*/i, 'domain/chess'],
  [/\b(slide|deck|present)\w*/i, 'domain/slides'],
  [/\b(note|markdown|prose|article|blog|author|share|portfolio|work index)\w*/i, 'domain/content'],
  [/\b(brand|logo|letterhead|business card|envelope|signature|feed post|story)\w*/i, 'domain/brand'],
  [/\b(setting|settings|shortcut|preference)\w*/i, 'domain/settings'],
  [/\b(animat|motion|tilt|parallax|drift|marquee|scroll|reveal|fly)\w*/i, 'domain/motion'],
  [/\b(knob|fader|jack|module|rack|led|rocker|channel|instrument|signal|envelope generator)\w*/i, 'domain/hardware'],
  [/\b(price|product|print|store|storefront|cart|commerce)\w*/i, 'domain/store'],
  [/\b(code|syntax|copy)\b/i, 'domain/code'],
  /* not the bare word "shell": ".kol-control shell" is a styling phrase, not the app shell */
  [/\b(app|hub|studio|masthead|header|footer)\b/i, 'domain/app-shell'],
  [/\b(type|font|glyph|typeface|specimen)\b/i, 'domain/typography'],
  [/\b(color|colour|swatch|hue|spectrum|ramp|gradient)\w*/i, 'domain/color'],
  [/\b(icon|icons)\b/i, 'domain/iconography'],
  [/\b(grid|layout|column|section|responsive|split)\b/i, 'domain/layout'],
  [/\b(token|tokens|scale|opacity|radius|shadow)\b/i, 'domain/tokens'],
  [/\b(overlay|modal|popover|tooltip|sheet|scrim)\b/i, 'domain/overlays'],
  [/\b(card|cards|tile|tiles)\b/i, 'domain/cards'],
  [/\b(hero|cta|newsletter|signup|faq|landing)\b/i, 'domain/website'],
  [/\b(tag|tags|chip|pill|badge)\b/i, 'domain/tags'],
]

/* The tags that say nothing: on most pages, or on every page (W6). */
export const NOISE = new Set(['domain/design-system', 'audience/consumer'])

export const topicsOf = (...texts) => {
  const hay = texts.filter(Boolean).join(' ')
  return TOPICS.filter(([re]) => re.test(hay)).map(([, tag]) => tag)
}

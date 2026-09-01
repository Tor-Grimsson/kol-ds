/**
 * ContentText — the ruled text block of the content-card system.
 *
 * Renders the per-variant / per-form type ramp ruled 2026-08-15
 * (docs/documentation/03-components/06-content-card-system.md §3). The laws:
 * title is the ONLY slot that steps between card and row (size only, one
 * family); body and meta are identical in both forms; ink is three roles
 * (emphasis · body · meta). `kol-helper-*` is out of this family — it is not
 * mono with line-height 1, it also carries weight 500 and 0.06em tracking, so
 * a helper field beside a mono one reads as a different voice.
 *
 * Every type class is a SEAM: pass `<slot>Class` to replace the ruled
 * class+ink string whole (consumers on their own faces swap here). Passing
 * nothing renders the ruled values.
 *
 * @param {string} variant   default | catalog | print | article | work | typeface
 * @param {string} form      card | row
 * @param {ReactNode} title
 * @param {ReactNode} body       article · work · typeface
 * @param {ReactNode} eyebrow    article only — THE EYEBROW HAS ONE NAME (2026-08-27); `kicker` is its alias
 * @param {ReactNode} detail     catalog · print
 * @param {ReactNode} date       default · article · typeface
 * @param {'card'|'row'|'hero'} form  the block's form; `hero` is article's featured text (ContentCard `hero`)
 * @param {ReactNode} size       default · article (file size / read length)
 * @param {ReactNode} meta       work only
 * @param {number}    gap        inner line gap in px (defaults per variant/form)
 * @param {string}    titleClass … eyebrowClass (alias `kickerClass`), bodyClass, detailClass,
 *                    dateClass, sizeClass, metaClass — full class overrides
 */

/* THE ROW INK LADDER — three rungs, and only three (2026-08-15).
 *
 * A work row was rendering its small title, its big description AND its type
 * label all at full emphasis, with only the year stepped down: four fields
 * wearing two values, so nothing led. The ladder is the same one the header
 * strips already use, which is why it reads as one system rather than a
 * per-variant guess:
 *
 *   emphasis  THE THING YOU CAME FOR — one per row, never two
 *   body      what identifies it — the title, the type
 *   meta      metadata — the year, the count, the file size
 *
 * The ROLES, not raw `fg-*` opacities and not raw `oq-*` rungs. A role is the
 * only thing that survives a theme flip and a consumer's own palette; the three
 * of them are exactly the three the family needs, which is why there are three
 * and not fourteen. */

/* [variant][form][slot] → 'type-class ink-role', verbatim from the ruled table */
const RAMP = {
  file: {
    card: { title: 'kol-sans-heading-04 text-emphasis truncate', date: 'kol-mono-12 text-meta', size: 'kol-mono-12 text-meta' },
    row:  { title: 'kol-sans-heading-05 text-emphasis truncate', date: 'kol-mono-12 text-meta', size: 'kol-mono-12 text-meta' },
  },
  catalog: {
    /* detail truncates (ShellHomeSystem, 2026-08-27): a wrapping blurb set three
     * cards' plates at three heights and misaligned the media */
    card: { title: 'kol-mono-14 text-emphasis', detail: 'kol-mono-10 text-meta truncate' },
    row:  { title: 'kol-mono-12 text-emphasis', detail: 'kol-mono-10 text-meta' },
  },
  /* `print` folded into `catalog` 2026-08-29 — its row was already catalog's,
   * and its card differed only by `detail` not truncating. It aliases now. */
  article: {
    /* kol-content-title-dim: the title dims to 70% on card hover (StackCardHover, 2026-08-27 — ListingCard's move, kol-theme) */
    card: { eyebrow: 'kol-mono-12 text-meta', title: 'kol-sans-heading-03 text-emphasis kol-content-title-dim', body: 'kol-mono-14 text-body', date: 'kol-mono-12 text-meta', size: 'kol-mono-12 text-meta', tags: 'flex flex-wrap gap-2' },
    row:  { eyebrow: 'kol-mono-12 text-meta', title: 'kol-sans-heading-04 text-emphasis kol-content-title-dim', body: 'kol-mono-12 text-body', date: 'kol-mono-12 text-meta', size: 'kol-mono-12 text-meta', tags: 'flex flex-wrap gap-2' },
    /* HERO — the featured card riding a page's fold (ContentCard `hero`,
    /* THE OLD FEATURED CARD, VERBATIM — ListingCard size="hero" as Stack
     * rendered it (user 2026-08-27: "everything was correct in the old featured
     * card … the only thing you had to do was carry it through"): kicker
     * `kol-card-kicker tracking-wide text-fg-64`, title display-section-sm →
     * display-03 uppercase, clamp 2, dim on hover; body mono-14 fg-48 clamp 2. */
    hero: { eyebrow: 'kol-card-kicker tracking-wide text-fg-64', title: 'kol-sans-display-03 uppercase line-clamp-2 kol-content-title-dim', body: 'kol-mono-14 text-fg-48 line-clamp-2', date: 'kol-mono-12 text-meta', size: 'kol-mono-12 text-meta', tags: 'flex flex-wrap gap-2' },
  },
  showcase: {
    /* INVERSE ink — the card's plate is the drawer, `surface-inverse`. Leaving
     * these on `text-emphasis` painted light type on a light plate and the
     * caption disappeared. */
    /* the drawer is an INVERSE surface, so the roles do not apply — but the
     * ladder does: one full ink, the rest stepped. */
    /* RULED ON /work GRID + shelf (WorkCardAndShelf, 2026-08-27): the title is one
     * line (the site passes its face as titleClass; the truncation is the card's),
     * the meta is the helper voice, uppercase, at inverse 80 */
    card: { title: 'kol-sans-display-03 text-fg-inverse truncate', meta: 'kol-helper-12 uppercase text-fg-inverse-80', body: 'kol-mono-14 text-fg-inverse-64', date: 'kol-mono-12 text-fg-inverse-48', tags: 'flex flex-wrap gap-2' },
    /* verbatim from WorkListItem: title `kol-mono-14` truncated · type
     * `kol-mono-12 md:kol-mono-14` at FULL ink, no opacity step · year
     * `kol-mono-12 text-fg-64` · description `kol-sans-heading-03 text-auto`.
     * Title and type are the pair — same rung, same full ink; only the year
     * steps down. */
    /* RULED ON /work beside the local WorkListItem (WorkListingRowsAndFilters,
     * 2026-08-27): the typeface row's voices — title + type kol-mono-14 full
     * ink, the year kol-mono-12 fg-64. Body unchanged (the site passes its face). */
    row:  { title: 'kol-mono-14 uppercase text-emphasis truncate', body: 'kol-sans-heading-03 leading-tight text-emphasis truncate', meta: 'kol-mono-14 text-emphasis', date: 'kol-mono-12 text-fg-64', tags: 'flex flex-wrap items-center gap-1.5' },
  },
  /* ROSTER — a pickable row's two lines, both TRUNCATED (ContentRowRosterVariant,
   * kol-chess 2026-08-31). Written out rather than derived from `showcase`: the
   * name-keyed maps below (FILL, GAPS) cannot be reached by a spread, and a
   * derive that misses one of them is the exact trap `showcaseCanvas` fell into
   * twice. Two literals beat a derive. Row form only — kol-chess wants no card,
   * and a card nobody asked for is a variant to keep in step for nothing. */
  roster: {
    row: { title: 'kol-mono-14 text-fg-96 truncate', meta: 'kol-mono-12 text-fg-48 truncate' },
  },
  showcaseCanvas: {
    /* RULED ON SCREEN (TypefaceCardAndRow, kol-website 2026-08-27): name and
     * classification are FULL ink, the year steps to 64; the card's title is the
     * row's title string — one title voice for the typeface family. Ink only. */
    /* same as the row: the SPECIMEN carries the emphasis on a typeface card,
     * so the name steps down. The glyph is what you came to look at. */
    card: { title: 'kol-mono-14 uppercase text-emphasis', body: 'kol-mono-12 text-meta', date: 'kol-mono-12 text-meta' },
    /* the name steps DOWN to `body`: on a typeface row the SPECIMEN is the
     * thing you came for and it carries the one emphasis. Two full inks in one
     * block is the ladder broken, and the measurement caught it. */
    row:  { title: 'kol-mono-14 uppercase text-emphasis', body: 'kol-mono-12 text-meta', detail: 'kol-mono-14 text-emphasis', date: 'kol-mono-12 text-fg-64' },
  },
}

/* render order per variant/form. Strings are slots; arrays are ONE line:
 * ['group', …] = 16px baseline group · ['between', …] = header.between ·
 * ['stack', …] = a vertical block on the tight 4px gap, nestable inside any of
 * the above. In a `between`, the LEADING part flexes and the trailing one hugs.
 *
 * A third kind, ['line', …] — fixed-width trailing columns for a table-like
 * row — was removed 2026-08-15. `default.row` was its only caller and moved to
 * a group when the date went below the title; the fixed 96/80px columns had
 * already been dropped for hugging content, so the branch was rendering
 * nothing anyone asked for.
 * Directions are the RULED structures (06-content-card-system.md §2 boxes),
 * read off the shipped components and the live pages they render on. */
const ORDER = {
  file:  { card: ['title', ['group', 'date', 'size']], row: ['title', ['group', 'date', 'size']] },
  catalog:  { card: ['title', 'detail'], row: [['between', 'title', 'detail']] },
  /* title + body are ONE block in BOTH forms — a `stack`, so they sit on the
   * tight 4px internal gap while tags, kicker and the meta group keep the
   * form's own outer gap. A flat column gave every line the same gap, which
   * read as unrelated lines rather than a heading with its standfirst. */
  article:  { card: ['tags', 'eyebrow', ['stack', 'title', 'body'], ['group', 'date', 'size']], row: ['eyebrow', ['stack', 'title', 'body'], ['group', 'date', 'size']] },
  /* the hero carries its tags as data (ListingCard hero: `data-tags` only) and its meta in the header row above the media — neither is a text line here */
  articleHero: ['eyebrow', ['stack', 'title', 'body'], ['group', 'date', 'size']],
  /* work CARD = the drawer's two lines: title, then one meta line.
   *
   * work ROW = WorkListItem, read off the live /work listing: a LEFT column of
   * title (small) → tags → description (the big line), and a RIGHT column of
   * type over year. The big line is the DESCRIPTION, not the title — the
   * earlier "the fields are crossed, uncross them" reading was wrong, and the
   * shipped page shows the small-title / big-description order is the design. */
  /* WorkListItem's inner column is `justify-between` with the header row on
   * top and the description BELOW IT, spanning the full width — not tucked
   * inside the left column, which is what squeezed the big line. */
  showcase: { card: ['title', 'meta'], row: [['between', ['stack', 'title', 'tags'], ['stack', 'meta', 'date']], 'body'] },
  /* typeface row = ONE header line, both sides stacked: name over styles on the
   * left, classification over year on the right. Verbatim from the shipped
   * item, which had been flattened into title-left / date-right and lost the
   * styles line into a body slot below. */
  showcaseCanvas: { card: ['title', 'body'], row: [['between', ['stack', 'title', 'body'], ['stack', 'detail', 'date']]] },
  /* two lines, pushed apart by the column's own justify-between (FILL) */
  roster: { row: ['title', 'meta'] },
}

/* inner line gap per variant/form, read from the shipped boxes and spelled in
 * --kol-spacing-* tokens — ALL of them. article's row carried a raw `10px` off
 * the scale, inherited from the shipped card; once its title and body became a
 * `stack` this gap stopped separating lines and started separating blocks, so
 * it sits on the 12px rung the rest of the family uses for that. */
/* Variants whose ROW text column STRETCHES: the block fills the row's height
 * and pushes its last child to the floor, so the big line bottom-aligns with
 * the thumb beside it instead of floating under the header. WorkListItem's
 * inner column is `flex flex-col justify-between … flex-1`.
 *
 * `self-stretch`, NOT `h-full` — the row carries `min-height`, never `height`,
 * so `height: 100%` resolves against an indefinite parent, computes to auto,
 * and shrink-wraps the column. Which is exactly what it did. */
const FILL = { showcase: true, roster: true }

/* gap INSIDE a ['stack', …] block. Defaults to the tight 4px pair article
 * wants; work's header stack is the shipped gap-1 md:gap-2. */
const STACK = {
  showcase: 'var(--kol-spacing-2)',
  showcaseCanvas: 'var(--kol-spacing-2)',
}

const GAPS = {
  file: { card: 'var(--kol-spacing-3)', row: 'var(--kol-spacing-2)' },
  catalog: { card: 'var(--kol-spacing-1)', row: 'var(--kol-spacing-2)' },
  article: { card: 'var(--kol-spacing-3)', row: 'var(--kol-spacing-3)', hero: 'var(--kol-spacing-3)' },
  showcase: { card: 'var(--kol-spacing-2)', row: 'var(--kol-spacing-4)' },
  showcaseCanvas: { card: 'var(--kol-spacing-2)', row: 'var(--kol-spacing-6)' },
  /* roster's lines are pushed apart by justify-between, so this is only a
   * floor for the case where the row is given more height than 56. */
  roster: { row: 'var(--kol-spacing-1)' },
}

/* `default` → `file` (user 2026-08-29) — kept working as an alias here too,
 * because ContentText is exported and a consumer can drive it directly. */
const ALIAS = { default: 'file', print: 'catalog', work: 'showcase', typeface: 'showcaseCanvas' }

export default function ContentText({
  variant: variantProp = 'file',
  form = 'card',
  title, body, eyebrow, kicker, detail, date, size, meta, tags,
  gap, clamp,
  titleClass, bodyClass, eyebrowClass, kickerClass, detailClass, dateClass, sizeClass, metaClass, tagsClass,
  className = '',
}) {
  /* `kicker` / `kickerClass` = aliases of `eyebrow` / `eyebrowClass` (2026-08-27) */
  eyebrow = eyebrow ?? kicker
  eyebrowClass = eyebrowClass ?? kickerClass
  const variant = ALIAS[variantProp] ?? variantProp
  const ramp = RAMP[variant]?.[form] ?? RAMP.file[form] ?? RAMP.file.card
  const order = (form === 'hero' && ORDER[`${variant}Hero`]) || ORDER[variant]?.[form] || ORDER.file.card
  const values = { title, body, eyebrow, detail, date, size, meta, tags }
  const overrides = { title: titleClass, body: bodyClass, eyebrow: eyebrowClass, detail: detailClass, date: dateClass, size: sizeClass, meta: metaClass, tags: tagsClass }

  /* the clamp rides the BODY only — it is the one slot that carries prose long
   * enough to need cutting, and clamping a title is what `truncate` in the ramp
   * already does on one line. Number in, `line-clamp-N` out; unset = no clamp,
   * so a card that wants the whole excerpt simply does not pass it. */
  const extra = (slot) => (slot === 'body' && clamp ? ` line-clamp-${clamp}` : '')

  /* the title dim is BEHAVIOUR, not voice: a `titleClass` override replaces the
   * ramp string whole (that is the seam's contract), and the hook was riding in
   * that string — so Stack's uppercase display title lost its hover the moment
   * it overrode the class (user 2026-08-27: "I had put A HOVER OPACITY drop,
   * WHERE IS IT"). The hook is re-attached after the override. */
  const hook = (slot) => (overrides[slot] && /\bkol-content-title-dim\b/.test(ramp[slot] ?? '') ? ' kol-content-title-dim' : '')
  const line = (slot) =>
    values[slot] == null ? null : (
      <div key={slot} className={`${overrides[slot] ?? ramp[slot] ?? ''}${extra(slot)}${hook(slot)}`.trim()}>{values[slot]}</div>
    )

  /* RECURSIVE (2026-08-15) — an entry inside a line/between/group may itself be
   * an entry, so a trailing COLUMN can hold two stacked fields. typeface's row
   * needs exactly that: classification over year at the right edge, which a
   * flat slot list cannot express and which was previously collapsed into one
   * `date` slot that lost a value. */
  const render = (entry, i, trailing = false) => {
    if (typeof entry === 'string') return line(entry)
    const [kind, ...slots] = entry
    const parts = slots.map((s, j) => render(s, j, kind === 'between' && j === slots.length - 1)).filter(Boolean)
    if (!parts.length) return null
    if (kind === 'stack') {
      /* A TRAILING column right-aligns (user ruling 2026-08-15) — it sits at
       * the row's right edge, so its own right edge is the one that lines up
       * down the list. `items-end` only applies where the stack is trailing;
       * a leading stack still reads from the left. */
      return (
        <div key={`stack-${i}`} className={`flex w-full min-w-0 flex-col ${trailing ? 'items-end text-right' : 'items-start text-left'}`} style={{ gap: STACK[variant] ?? 'var(--kol-spacing-1)' }}>
          {parts}
        </div>
      )
    }
    return (
      <div
        key={`${kind}-${i}`}
        /* a `between` whose trailing part is a STACK aligns on the top, not the
         * baseline — a two-line column has no single baseline to share with the
         * title beside it, and baseline-aligning it hangs the second line below
         * the row's floor. */
        className={`flex min-w-0 ${parts.length > 1 && Array.isArray(slots[slots.length - 1]) ? 'items-center' : 'items-baseline'} ${kind === 'between' ? 'justify-between' : ''}`}
        style={{ gap: 'var(--kol-spacing-6)' }}
      >
        {/* the LEADING part of a `between` takes the room; the trailing column
          * hugs its content. Without this the left stack sized to its content
          * and the big line truncated at a quarter of the row's width while
          * empty space sat between the two columns. */}
        {kind === 'between' && parts.length > 1
          ? parts.map((p, j) => (
              <div key={j} className={j === 0 ? 'min-w-0 flex-1' : 'shrink-0 text-right'}>{p}</div>
            ))
          : parts}
      </div>
    )
  }

  /* NOT `order.map(render)`: map passes (entry, index, ARRAY) and the array
   * landed in `trailing`, so every top-level stack right-aligned — the article
   * card's title and body sat flush right under left-aligned tags for eleven
   * days (found on the comparison page, 2026-08-26). */
  const nodes = order.map((entry, i) => render(entry, i))

  return (
    <div
      className={`flex min-w-0 flex-col ${FILL[variant] && form === 'row' ? 'self-stretch justify-between' : ''} ${className}`.trim()}
      style={{ gap: typeof gap === 'number' ? `${gap}px` : gap ?? GAPS[variant]?.[form] ?? 'var(--kol-spacing-2)' }}
    >
      {nodes}
    </div>
  )
}

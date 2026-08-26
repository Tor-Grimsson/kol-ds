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
 * @param {ReactNode} kicker     article only
 * @param {ReactNode} detail     catalog · print
 * @param {ReactNode} date       default · article · typeface
 * @param {ReactNode} size       default · article (file size / read length)
 * @param {ReactNode} meta       work only
 * @param {number}    gap        inner line gap in px (defaults per variant/form)
 * @param {string}    titleClass … kickerClass, bodyClass, detailClass,
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
  default: {
    card: { title: 'kol-sans-heading-04 text-emphasis truncate', date: 'kol-mono-12 text-meta', size: 'kol-mono-12 text-meta' },
    row:  { title: 'kol-sans-heading-05 text-emphasis truncate', date: 'kol-mono-12 text-meta', size: 'kol-mono-12 text-meta' },
  },
  catalog: {
    card: { title: 'kol-mono-14 text-emphasis', detail: 'kol-mono-10 text-meta' },
    row:  { title: 'kol-mono-12 text-emphasis', detail: 'kol-mono-10 text-meta' },
  },
  print: {
    card: { title: 'kol-mono-14 text-emphasis', detail: 'kol-mono-10 text-meta' },
    /* mono-12 + emphasis, matching catalog — print's row IS catalog's row, so
     * the two must not disagree about their own type. */
    row:  { title: 'kol-mono-12 text-emphasis', detail: 'kol-mono-10 text-meta' },
  },
  article: {
    card: { kicker: 'kol-mono-12 text-meta', title: 'kol-sans-heading-03 text-emphasis', body: 'kol-mono-14 text-body', date: 'kol-mono-12 text-meta', size: 'kol-mono-12 text-meta', tags: 'flex flex-wrap gap-2' },
    row:  { kicker: 'kol-mono-12 text-meta', title: 'kol-sans-heading-04 text-emphasis', body: 'kol-mono-12 text-body', date: 'kol-mono-12 text-meta', size: 'kol-mono-12 text-meta', tags: 'flex flex-wrap gap-2' },
  },
  work: {
    /* INVERSE ink — the card's plate is the drawer, `surface-inverse`. Leaving
     * these on `text-emphasis` painted light type on a light plate and the
     * caption disappeared. */
    /* the drawer is an INVERSE surface, so the roles do not apply — but the
     * ladder does: one full ink, the rest stepped. */
    card: { title: 'kol-sans-display-03 text-fg-inverse', meta: 'kol-mono-12 text-fg-inverse-64', body: 'kol-mono-14 text-fg-inverse-64', date: 'kol-mono-12 text-fg-inverse-48', tags: 'flex flex-wrap gap-2' },
    /* verbatim from WorkListItem: title `kol-mono-14` truncated · type
     * `kol-mono-12 md:kol-mono-14` at FULL ink, no opacity step · year
     * `kol-mono-12 text-fg-64` · description `kol-sans-heading-03 text-auto`.
     * Title and type are the pair — same rung, same full ink; only the year
     * steps down. */
    row:  { title: 'kol-mono-12 text-body uppercase truncate', body: 'kol-sans-heading-03 leading-tight text-emphasis truncate', meta: 'kol-mono-12 text-body', date: 'kol-mono-12 text-meta', tags: 'flex flex-wrap items-center gap-1.5' },
  },
  typeface: {
    /* same as the row: the SPECIMEN carries the emphasis on a typeface card,
     * so the name steps down. The glyph is what you came to look at. */
    card: { title: 'kol-mono-16 text-body', body: 'kol-mono-12 text-meta', date: 'kol-mono-12 text-meta' },
    /* the name steps DOWN to `body`: on a typeface row the SPECIMEN is the
     * thing you came for and it carries the one emphasis. Two full inks in one
     * block is the ladder broken, and the measurement caught it. */
    row:  { title: 'kol-mono-14 uppercase text-body', body: 'kol-mono-12 text-meta', detail: 'kol-mono-14 text-body', date: 'kol-mono-12 text-meta' },
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
  default:  { card: ['title', ['group', 'date', 'size']], row: ['title', ['group', 'date', 'size']] },
  catalog:  { card: ['title', 'detail'], row: [['between', 'title', 'detail']] },
  print:    { card: ['title', 'detail'], row: [['between', 'title', 'detail']] },
  /* title + body are ONE block in BOTH forms — a `stack`, so they sit on the
   * tight 4px internal gap while tags, kicker and the meta group keep the
   * form's own outer gap. A flat column gave every line the same gap, which
   * read as unrelated lines rather than a heading with its standfirst. */
  article:  { card: ['tags', 'kicker', ['stack', 'title', 'body'], ['group', 'date', 'size']], row: ['kicker', ['stack', 'title', 'body'], ['group', 'date', 'size']] },
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
  work:     { card: ['title', 'meta'], row: [['between', ['stack', 'title', 'tags'], ['stack', 'meta', 'date']], 'body'] },
  /* typeface row = ONE header line, both sides stacked: name over styles on the
   * left, classification over year on the right. Verbatim from the shipped
   * item, which had been flattened into title-left / date-right and lost the
   * styles line into a body slot below. */
  typeface: { card: ['title', 'body'], row: [['between', ['stack', 'title', 'body'], ['stack', 'detail', 'date']]] },
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
const FILL = { work: true }

/* gap INSIDE a ['stack', …] block. Defaults to the tight 4px pair article
 * wants; work's header stack is the shipped gap-1 md:gap-2. */
const STACK = {
  work: 'var(--kol-spacing-2)',
  typeface: 'var(--kol-spacing-2)',
}

const GAPS = {
  default: { card: 'var(--kol-spacing-3)', row: 'var(--kol-spacing-2)' },
  catalog: { card: 'var(--kol-spacing-1)', row: 'var(--kol-spacing-2)' },
  print: { card: 'var(--kol-spacing-2)', row: 'var(--kol-spacing-2)' },
  article: { card: 'var(--kol-spacing-3)', row: 'var(--kol-spacing-3)' },
  work: { card: 'var(--kol-spacing-2)', row: 'var(--kol-spacing-4)' },
  typeface: { card: 'var(--kol-spacing-2)', row: 'var(--kol-spacing-6)' },
}

export default function ContentText({
  variant = 'default',
  form = 'card',
  title, body, kicker, detail, date, size, meta, tags,
  gap, clamp,
  titleClass, bodyClass, kickerClass, detailClass, dateClass, sizeClass, metaClass, tagsClass,
  className = '',
}) {
  const ramp = RAMP[variant]?.[form] ?? RAMP.default[form] ?? RAMP.default.card
  const order = ORDER[variant]?.[form] ?? ORDER.default.card
  const values = { title, body, kicker, detail, date, size, meta, tags }
  const overrides = { title: titleClass, body: bodyClass, kicker: kickerClass, detail: detailClass, date: dateClass, size: sizeClass, meta: metaClass, tags: tagsClass }

  /* the clamp rides the BODY only — it is the one slot that carries prose long
   * enough to need cutting, and clamping a title is what `truncate` in the ramp
   * already does on one line. Number in, `line-clamp-N` out; unset = no clamp,
   * so a card that wants the whole excerpt simply does not pass it. */
  const extra = (slot) => (slot === 'body' && clamp ? ` line-clamp-${clamp}` : '')

  const line = (slot) =>
    values[slot] == null ? null : (
      <div key={slot} className={`${overrides[slot] ?? ramp[slot] ?? ''}${extra(slot)}`.trim()}>{values[slot]}</div>
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

  const nodes = order.map(render)

  return (
    <div
      className={`flex min-w-0 flex-col ${FILL[variant] && form === 'row' ? 'self-stretch justify-between' : ''} ${className}`.trim()}
      style={{ gap: typeof gap === 'number' ? `${gap}px` : gap ?? GAPS[variant]?.[form] ?? 'var(--kol-spacing-2)' }}
    >
      {nodes}
    </div>
  )
}

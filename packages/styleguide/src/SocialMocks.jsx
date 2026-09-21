/**
 * SocialMocks — a mark in situ on social surfaces: feed posts at 1:1, stories
 * at 9:16, and the round profile avatar.
 *
 * Lifted from the two brand apps (`brand-book-mocks-two-consumers`,
 * 2026-09-03 — 136 lines in kol-client-olina, 136 in kol-website, four lines
 * of diff between them). ASSET-AGNOSTIC the way `LogoCard` is: every mark is a
 * consumer-injected node and every string is a prop. What the forks baked in
 * and this does not:
 *
 * - `KolLogo` imported from the app → the `mark` node.
 * - A seven-stop client palette (champagne / sand / burgundy / maroon / wine)
 *   → `palette`, defaulting to the theme's own ink and paper. A brand supplies
 *   its own; the DS ships no colour.
 * - `'Bricolage Grotesque'` and `'JetBrains Mono'` by name → `fonts`,
 *   defaulting to `--kol-font-family-sans-narrow` / `--kol-font-family-mono`.
 *   A foreign family by name in a package is how a consumer's type silently
 *   stops being the system's.
 * - The client's own copy ("Made by hand, made to last.", "Edda Coat",
 *   "AW 2026", "Quiet, considered.") → text props with neutral placeholders.
 *
 * The geometry is carried through class-for-class: the aspect boxes, the mark
 * fractions (w-1/4 · w-1/5 · w-1/6 · w-1/3 · w-1/2) and the corner insets are
 * the forks' numbers, not new ones.
 *
 *   const brand = { mark: <Asset name="logomark" />, palette: { accent: '#F3F1EC' } }
 *   <PostPhoto {...brand} />
 *   <StoryType {...brand} quote={<>Quiet,<br/>considered.</>} />
 *   <ProfileAvatar {...brand} />
 *
 * One object spread into each mock is the intended call shape — no context, no
 * provider: a brand book renders these in a grid and already holds the object.
 */

/* Neutral defaults. `accent` is the only stop a brand normally overrides; the
 * rest track the theme so an un-themed render is still legible. */
export const DEFAULT_MOCK_PALETTE = {
  paper: '#FCFBFB',
  ink: '#131316',
  accent: '#F3F1EC',
  photo: '#363639',
}

export const DEFAULT_MOCK_FONTS = {
  display: 'var(--kol-font-family-sans-narrow)',
  mono: 'var(--kol-font-family-mono)',
}

const capsStyle = (fonts) => ({
  fontFamily: fonts.mono,
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
})

/* Every mock resolves its palette and fonts the same way, so a consumer can
 * pass one, both or neither and never get a half-themed frame. */
const resolve = (palette, fonts) => [
  { ...DEFAULT_MOCK_PALETTE, ...palette },
  { ...DEFAULT_MOCK_FONTS, ...fonts },
]

/**
 * PostPhoto — feed post, photo ground with the mark in the corner (1:1).
 *
 * @param {ReactNode} mark - The brand mark
 * @param {Object} palette - Partial override of DEFAULT_MOCK_PALETTE
 * @param {Object} fonts - Partial override of DEFAULT_MOCK_FONTS
 * @param {ReactNode} media - Node behind the mark — an <img>, a video frame; omitted, the `photo` stop fills it
 * @param {string} className - Extra classes on the frame
 */
export function PostPhoto({ mark, palette, fonts, media, className = '' }) {
  const [pal] = resolve(palette, fonts)
  return (
    <div
      className={`aspect-square relative rounded-sm overflow-hidden ${className}`.trim()}
      style={{ background: pal.photo, color: pal.paper }}
    >
      {media}
      <span className="absolute bottom-4 right-4 w-1/4">{mark}</span>
    </div>
  )
}

/**
 * PostType — feed post, type-driven quote on the accent ground (1:1).
 *
 * @param {ReactNode} mark - The brand mark
 * @param {Object} palette - Partial override of DEFAULT_MOCK_PALETTE
 * @param {Object} fonts - Partial override of DEFAULT_MOCK_FONTS
 * @param {ReactNode} quote - The line; authored with its own <br/> breaks
 * @param {string} className - Extra classes on the frame
 */
export function PostType({ mark, palette, fonts, quote = 'Your line here.', className = '' }) {
  const [pal, font] = resolve(palette, fonts)
  return (
    <div
      className={`aspect-square relative flex items-center justify-center p-8 rounded-sm ${className}`.trim()}
      style={{ background: pal.accent, color: pal.ink }}
    >
      <p style={{ fontFamily: font.display, fontSize: 20, fontWeight: 500, lineHeight: 1.15, textAlign: 'center', letterSpacing: '-0.01em' }}>
        {quote}
      </p>
      <span className="absolute bottom-4 left-4 w-1/5">{mark}</span>
    </div>
  )
}

/**
 * PostProduct — feed post, product flat with a caption row (1:1).
 *
 * @param {ReactNode} mark - The brand mark
 * @param {Object} palette - Partial override of DEFAULT_MOCK_PALETTE
 * @param {Object} fonts - Partial override of DEFAULT_MOCK_FONTS
 * @param {ReactNode} media - Fills the product panel; omitted, the `placeholder` label sits in the accent stop
 * @param {string} placeholder - Label shown in an empty product panel (default: 'product')
 * @param {string} eyebrow - Small caps line above the product name (default: 'Style')
 * @param {ReactNode} name - The product name
 * @param {string} className - Extra classes on the frame
 */
export function PostProduct({
  mark,
  palette,
  fonts,
  media,
  placeholder = 'product',
  eyebrow = 'Style',
  name = 'Product name',
  className = '',
}) {
  const [pal, font] = resolve(palette, fonts)
  const caps = capsStyle(font)
  return (
    <div
      className={`aspect-square relative flex flex-col p-6 rounded-sm ${className}`.trim()}
      style={{ background: pal.paper, color: pal.ink }}
    >
      <div
        className="flex-1 flex items-center justify-center rounded-sm overflow-hidden"
        style={{ background: pal.accent }}
      >
        {media ?? <span style={{ ...caps, fontSize: 8, opacity: 0.35 }}>{placeholder}</span>}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p style={{ ...caps, fontSize: 7, opacity: 0.5 }}>{eyebrow}</p>
          <p style={{ fontFamily: font.display, fontSize: 14, fontWeight: 500 }}>{name}</p>
        </div>
        <span className="w-1/6">{mark}</span>
      </div>
    </div>
  )
}

/**
 * PostEditorial — feed post, half photo / half type (1:1).
 *
 * @param {ReactNode} mark - The brand mark
 * @param {Object} palette - Partial override of DEFAULT_MOCK_PALETTE
 * @param {Object} fonts - Partial override of DEFAULT_MOCK_FONTS
 * @param {ReactNode} media - Fills the photo half; omitted, the `photo` stop does
 * @param {string} eyebrow - Small caps line at the top of the type half (default: 'Season')
 * @param {ReactNode} title - The headline; authored with its own <br/> breaks
 * @param {string} className - Extra classes on the frame
 */
export function PostEditorial({
  mark,
  palette,
  fonts,
  media,
  eyebrow = 'Season',
  title = 'Your headline',
  className = '',
}) {
  const [pal, font] = resolve(palette, fonts)
  const caps = capsStyle(font)
  return (
    <div className={`aspect-square grid grid-cols-2 rounded-sm overflow-hidden ${className}`.trim()}>
      <div style={{ background: pal.photo }}>{media}</div>
      <div
        className="relative flex flex-col justify-between p-5"
        style={{ background: pal.accent, color: pal.ink }}
      >
        <p style={{ ...caps, fontSize: 7, opacity: 0.5 }}>{eyebrow}</p>
        <div>
          <p style={{ fontFamily: font.display, fontSize: 16, fontWeight: 500, lineHeight: 1.1 }}>
            {title}
          </p>
          <span className="block w-1/3 mt-3">{mark}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * StoryPhoto — story frame, full-bleed photo with the mark low-left (9:16).
 *
 * @param {ReactNode} mark - The brand mark
 * @param {Object} palette - Partial override of DEFAULT_MOCK_PALETTE
 * @param {Object} fonts - Partial override of DEFAULT_MOCK_FONTS
 * @param {ReactNode} media - Fills the frame; omitted, the `photo` stop does
 * @param {string} className - Extra classes on the frame
 */
export function StoryPhoto({ mark, palette, fonts, media, className = '' }) {
  const [pal] = resolve(palette, fonts)
  return (
    <div
      className={`aspect-[9/16] relative rounded-sm overflow-hidden ${className}`.trim()}
      style={{ background: pal.photo, color: pal.paper }}
    >
      {media}
      <span className="absolute bottom-6 left-6 w-1/3">{mark}</span>
    </div>
  )
}

/**
 * StoryType — story frame, type-driven with the mark centred low (9:16).
 *
 * @param {ReactNode} mark - The brand mark
 * @param {Object} palette - Partial override of DEFAULT_MOCK_PALETTE — `ink` is the ground here and `accent` the type
 * @param {Object} fonts - Partial override of DEFAULT_MOCK_FONTS
 * @param {ReactNode} quote - The line; authored with its own <br/> breaks
 * @param {string} className - Extra classes on the frame
 */
export function StoryType({ mark, palette, fonts, quote = 'Your line here.', className = '' }) {
  const [pal, font] = resolve(palette, fonts)
  return (
    <div
      className={`aspect-[9/16] relative flex items-center justify-center p-8 rounded-sm ${className}`.trim()}
      style={{ background: pal.ink, color: pal.accent }}
    >
      <p style={{ fontFamily: font.display, fontSize: 18, fontWeight: 500, lineHeight: 1.2, textAlign: 'center', letterSpacing: '-0.01em' }}>
        {quote}
      </p>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1/3">{mark}</span>
    </div>
  )
}

/**
 * ProfileAvatar — the round profile mark (1:1).
 *
 * The forks called it `Avatar`, which is already a kol-component atom (a
 * PERSON's avatar). Two packages exporting one name is a collision the roster
 * gate catches; this is the social-profile frame, so it takes the longer name.
 *
 * @param {ReactNode} mark - The brand mark
 * @param {Object} palette - Partial override of DEFAULT_MOCK_PALETTE
 * @param {string} bg - Ground colour; unset, the `paper` stop
 * @param {'dark'|'light'} polarity - Which way the mark inks against that ground (default: 'dark')
 * @param {string} className - Extra classes on the frame
 */
export function ProfileAvatar({ mark, palette, bg, polarity = 'dark', className = '' }) {
  const [pal] = resolve(palette)
  return (
    <div
      className={`aspect-square rounded-full flex items-center justify-center overflow-hidden ${className}`.trim()}
      style={{ background: bg ?? pal.paper, color: polarity === 'light' ? pal.paper : pal.ink }}
    >
      <span className="w-1/2">{mark}</span>
    </div>
  )
}

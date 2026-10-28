import { useState } from 'react'
import { Button, PopoverPanel, usePopover, useMediaQuery, VectorLoader } from '@kolkrabbi/kol-component'
import PhoneNav from './PhoneNav.jsx'
import WalkthroughPanel from './WalkthroughPanel.jsx'
import MoreRows from './MoreSheet.jsx'
import CatalogPage from './CatalogPage.jsx'
import { useTouchPrimary } from './TouchDeviceOverlay.jsx'

/* taxonomy-ok: organism — nests CatalogPage (relative) + kol-component's Button */

/**
 * HubHome — A hub's home page. the Hub's Home: a Catalog under the app's masthead (the Hub, 2026-09-26).
 * monitor, mirror and fxr each wrote this page on `CatalogPage` with the same five
 * decisions — the mono masthead, RECENT · SAVED, a walkthrough opened by a button,
 * that button's Close label, a "Get started" last step — and the case of the view
 * labels had already drifted. They are made here once.
 *
 * HOME IS A DATA CONTRACT (HubHomeContract, kol-fxr 2026-10-23 — user: *"you 3 share THE SAME HUB
 * it should not DIFFER, that's literally the reason I made the hub"*). Until then the Hub shared only
 * the FRAME: `...rest` reached `CatalogPage`, so every consumer still wrote its own `toCard`, picked
 * its own preset, row, list and filter label, and the three Homes drifted on every one. Now the
 * consumer hands DATA — `files` and the handlers — and the Hub draws every card itself:
 * `preset="app"` (the app card, the app row three across — his 2026-10-22 ruling), grid by default,
 * "All Files", RECENT = the twelve newest, SAVED = every file, `name → title`, `updatedAt → date`,
 * `bytes → size`, `cover → media`, and `tags`, `details`, `onTags` to the file's info rail. No prop
 * reaches `CatalogPage` that is not named below, so a consumer with no knob cannot drift. The Library
 * pages stay per app on `CatalogPage` — only Home closes.
 *
 * FILES ONLY (user ruling 2026-10-23: the blank start — New File, Empty Studio, Empty 7U — rode RECENT
 * as a card with no verbs and read as a file nobody can delete; *"yeah drop it"*). The blank start is
 * the `action` button at the foot. The card carries no summary line either (the `meta` of 0.292.0 was
 * never designed for and broke the plate): a file's counts and dimensions are `details`, shown in the
 * rail the cog opens.
 *
 * THE WALKTHROUGH IS OPT-IN (user, 2026-09-26, on media-hub): it never opens by
 * itself. The Walkthrough button at the end of the action row opens it; the X inside
 * the card and the same button close it.
 *
 * @param {Object}   app          `{ name, subtitle }` — the masthead, when Home is the app's front door
 * @param {string}   title · subtitle  Home's own masthead instead — for a Home that is not the front
 *                                door (media-hub's Library at `/library`, 2026-09-26: it said "Media")
 * @param {Array}    files        the user's files, the ONLY source of cards:
 *                                `[{ id, name, updatedAt (ms), bytes?, cover? (src | node), back? (src | node), images?: [{ id, src, label? }],
 *                                tags?: string[], note?: string, mark?: { icon, label, of? }, details?: [{ label, value }] }]` — `back` is the card's
 *                                second cover, revealed on hover (AppCardBackCover, monitor: the rack behind the output); `images` are the
 *                                file's pictures, the rail's Files section (FileRailImages): quicklook, remove, upload, and the cover and back
 *                                picked from them; `mark` is a glyph
 *                                on the cover's other corner for what the file is (FXR: the chrome it was made with) — newest first wherever they come from; a
 *                                file may carry the keys its `filterGroups` read (monitor's `type`)
 * @param {Function} onOpen       `(file)` — the card and the row click; required with `files`
 * @param {Function} onDownload   `(file)` — the cover's download and the rail's button; absent → neither
 * @param {Function} onRename · onDuplicate · onRemove  `(file, name)` · `(file)` · `(file)` — the verbs
 *                                behind Rename · Duplicate · Delete (the menu, the plate's trash, the rail's
 *                                buttons); a verb not passed is not drawn (CatalogAppVariant's rule); Rename
 *                                prompts and Delete confirms before the handler runs
 * @param {Function} onTags       `(file, tags)` — the rail's tag chips write through it; absent → tags read-only
 * @param {Function} onNote       `(file, text)` — the rail's note (a plain description, 2026-10-23) writes through it; absent → read-only
 * @param {Function} onCover      `(file, src)` — the rail's Upload image (2026-10-24): the DS picker's webp data URL for the
 *                                file's cover; the consumer stores it as the file's `cover`. Absent → no Cover row. With `images`
 *                                on the file it is the Cover PICK instead — `src` is the picked image's, or `null` when that image is removed (FileRailImages)
 * @param {Function} onBack       `(file, src)` — the rail's Back pick over the file's `images`; the consumer stores it as `back`
 * @param {boolean}  flipped · backHover  the cards' back (AppCardWholeFlip, 2026-10-24): `flipped` turns every card that has a `back` — the
 *                                page turns them on a key; `backHover` opts the hover reveal in (default off)
 * @param {string}   backReveal   the cards' back treatment (HubHomeBackReveal, 2026-10-24): `flip-image` (default) · `flip-card` ·
 *                                `hover`, for every card; a file's own `backReveal` wins
 * @param {Function} onImages     `(file, next)` — the rail's Upload tile and × write the WHOLE list back (`[{ id, src, label? }]`, the
 *                                rail names a new image's id); the consumer stores it as the file's `images`. Absent → no tile, no ×.
 *                                An image removed while it was the cover or the back clears it: `onCover(file, null)` · `onBack(file, null)`
 * @param {Object}   touch        QUICK LINKS ON A PHONE, opt-in (studio-hub review 2, § 7.2 — *"fxr would use the quicklinks
 *                                for picking chrome right on mobile, while monitor and mirror wouldn't"*):
 *                                `{ label?, doors: [{ icon, label, onPress }] }` — on a coarse pointer or below `md`, ABOVE the
 *                                catalog: the eyebrow (`label`, fxr's "Select chrome"), then one full-width large button per
 *                                door, stacked, the icon on BOTH ends and the label centred — fxr's original chooser, carried
 *                                class for class from its `EntryScreen` (HubHomePhoneChooser, kol-fxr 2026-10-28 — user: *"I
 *                                want taht instead of this 2x2 bullshit"* · *"not with the padded container"*): no card, no
 *                                scrim, straight on the page. Absent, a phone gets the rows alone
 * @param {Array}    filterGroups ContentFilters' `[{ label, key, values, exclusive? }]`, opt-in — declare them or
 *                                Home is not a catalog for you (user, 2026-10-23). `exclusive` makes a group's
 *                                chips mutually exclusive. When files carry `tags` and no group claims the key,
 *                                the Hub derives a Tags group from them, so a tag added in the rail filters at once
 * @param {Object}   action       `{ label, onClick }` — the app's one action (New File), the first row of the masthead's round
 *                                button's sheet (2026-10-23; it was a button at the foot); the Hub draws
 *                                the `Button tone="grey" size="md"`, the consumer writes no JSX (shelf's rule)
 * @param {Array}    views        the view strip (default RECENT · SAVED); rename a set by passing your own,
 *                                e.g. `[…, { value: 'saved', label: 'FAVOURITES' }]` — the VALUES are the
 *                                Hub's (`recent` = the twelve newest · `saved` = every file)
 * @param {string}   defaultView  which view opens (default the first)
 * @param {Array}    walkthrough  steps (WalkthroughPanel's: `{ title, text, cover?, illustration?, actions? }`); the
 *                                "Get started" step's `actions` are DATA `[{ label, onClick, icon? }]` — the Hub draws the
 *                                buttons and closes the walkthrough before each handler runs (2026-10-24)
 * @param {ElementType} iconComponent  icon renderer seam for ContentFilters
 *
 * Gone, and the Hub warns in dev when it sees one: `toCard` · `items` · `preset` · `cardVariant` ·
 * `rowVariant` · `listLayout` · `defaultLayout` · `filtersTitle` · `filtersProps` · `className` ·
 * `actions` · `minColumn` · `maxColumns` (2026-10-23, the contract) and `template` · `summary`
 * (2026-10-23, his review: files only, no summary line on the card).
 */
const HUB_VIEWS = [
  { value: 'recent', label: 'RECENT' },
  { value: 'saved', label: 'SAVED' },
]

/* RECENT is the newest files — fxr, mirror and monitor each wrote twelve */
const RECENT_FILES = 12

/* dev-only, once per prop — a Home prop that left with the contract, or anything else unknown. A prop
 * that silently does nothing reads as working code at the call site (the props gate's lesson). */
const warned = new Set()
function warnUnknown(unknown) {
  for (const key of Object.keys(unknown)) {
    if (warned.has(key)) continue
    warned.add(key)
    console.warn(
      `HubHome: "${key}" is not a Home prop and was ignored — Home is a data contract (HubHomeContract, 2026-10-23). `
      + 'Props: files · onOpen · onDownload · onRename · onDuplicate · onRemove · onTags · onNote · onCover · filterGroups · action, '
      + 'plus app · title · subtitle · views · defaultView · walkthrough · iconComponent. '
      + '`template` and `summary` left 2026-10-23: files only, and a file\'s information is `details` in the rail. This warning is dev-only.',
    )
  }
}

export default function HubHome({
  app = {},
  title,
  subtitle,
  files = [],
  onOpen,
  onDownload,
  onRename,
  onDuplicate,
  onRemove,
  onTags,
  onNote,
  onCover,
  onBack,
  onImages,
  flipped,
  backHover,
  backReveal,
  filterGroups,
  action,
  views = HUB_VIEWS,
  defaultView,
  walkthrough,
  iconComponent,
  touch,
  /* AppHub's: the walkthrough's open state, and whether the phone bar's More sheet carries New and Walkthrough */
  touring: touringProp,
  onTouringChange,
  actionsInBar = false,
  /* SIGNED OUT (HubHomeSignedOut, kol-fxr 2026-10-28, frames A2 · B2 — user: *"we shouldnt see any files until you've
   * LOGGED-IN. we should rather have something unique to an unlogged experience"*): no catalog, no views, no filters. The
   * `stage` node lies full-bleed behind the page (fxr's live generator); the mark top-left, alone (48 on a phone, 112 on a
   * desk); the round `+` top-right opening New File, Walkthrough and Sign in (`signInAction`, AppHub's); the app's `chromes`
   * as the desk's dock pill bottom-left (PhoneNav `variant="dock"`) — the phone's pill is AppHub's, the chromes with the
   * rail under More. On by `signedOut`, or by a `stage` with no files. Signed in, nothing here changes. */
  signedOut,
  stage,
  chromes = [],
  signInAction,
  ...unknown
}) {
  if (import.meta.env.DEV) warnUnknown(unknown)
  const coarse = useTouchPrimary()
  const narrow = useMediaQuery('(max-width: 767px)')
  const [view, setView] = useState(defaultView ?? views?.[0]?.value)
  const [ownTouring, setOwnTouring] = useState(false)
  const touring = touringProp ?? ownTouring
  const setTouring = (v) => { const next = typeof v === 'function' ? v(touring) : v; setOwnTouring(next); onTouringChange?.(next) }
  const close = () => setTouring(false)
  /* a step's `actions` as DATA `[{ label, onClick }]` — each press closes the walkthrough, then runs the app's handler
   * (studio-hub's Get started: close, then Create); a function still gets `close` (the old shape), a node is drawn with
   * the panel's warning */
  const steps = (walkthrough ?? []).map((s) => (
    Array.isArray(s.actions) ? { ...s, actions: s.actions.map((a) => ({ ...a, onClick: () => { close(); a.onClick?.() } })) }
      : typeof s.actions === 'function' ? { ...s, actions: s.actions(close) } : s))

  /* newest first, whatever order the consumer keeps them in */
  const sorted = [...files].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
  const items = view === 'recent' ? sorted.slice(0, RECENT_FILES) : sorted

  /* the ONE mapping — data in, the `app` card's slots out (AppItem.jsx draws the rest) */
  const toCard = (item) => {
    const verbs = {
      ...(onRename && { rename: (name) => onRename(item, name) }),
      ...(onDuplicate && { duplicate: () => onDuplicate(item) }),
      ...(onRemove && { remove: () => onRemove(item) }),
    }
    return {
      key: item.id,
      title: item.name,
      date: item.updatedAt,
      size: item.bytes,
      media: item.cover,
      back: item.back,
      backReveal: item.backReveal ?? backReveal,
      tags: item.tags,
      details: item.details,
      onTags: onTags ? (tags) => onTags(item, tags) : undefined,
      note: item.note,
      mark: item.mark,
      onNote: onNote ? (text) => onNote(item, text) : undefined,
      onCover: onCover ? (src) => onCover(item, src) : undefined,
      /* the rail's Files section (FileRailImages, 2026-10-24): the file's images, and the picks and writes over them */
      images: item.images,
      onBack: onBack ? (src) => onBack(item, src) : undefined,
      onImages: onImages ? (next) => onImages(item, next) : undefined,
      verbs: Object.keys(verbs).length ? verbs : undefined,
      download: onDownload ? () => onDownload(item) : undefined,
      onClick: onOpen ? () => onOpen(item) : undefined,
    }
  }

  /* the Tags group is derived from the files when they carry tags and no declared group claims the key */
  const tagValues = [...new Set(files.flatMap((f) => f.tags ?? []))]
  const groups = !tagValues.length || filterGroups?.some((g) => g.key === 'tags')
    ? filterGroups
    : [...(filterGroups ?? []), { label: 'Tags', key: 'tags', values: tagValues }]
  /* a group's `exclusive` is ContentFilters' `mutuallyExclusiveFilters`, by key; the flag itself stays here */
  const exclusive = groups?.filter((g) => g.exclusive).map((g) => g.key)

  /* NEW AND WALKTHROUGH LIVE IN THE MASTHEAD'S ROUND BUTTON (user 2026-10-23: *"New and more should go into a component
   * like apps/catalog"*): the catalog's inverted full-radius Button in PageHeader's `actions` slot, opening the same sheet
   * the phone bar's More draws (MoreRows in `.kol-more-sheet`). The foot row it replaces was a row of buttons under the
   * catalog, hence a bottom pad that read as a clipped last row. With the bar on a phone the bar's More carries both
   * and the button hides below `md`; with the drawer it stays on every width. */
  const menuActions = [
    ...(action ? [{ label: action.label, icon: 'plus', onPress: action.onClick }] : []),
    ...(steps.length ? [{ label: touring ? 'Close walkthrough' : 'Walkthrough', icon: 'book-open', onPress: () => setTouring((t) => !t) }] : []),
  ]
  /* with the drawer the button stays on the phone, stepped left of the shell's drawer trigger (fixed top-right, 32 at 12;
   * the variants gate caught the overlap on editor-hub at 390) */
  const headerMenu = menuActions.length ? <HomeMenu actions={menuActions} className={actionsInBar ? 'max-md:hidden' : 'max-md:mr-11'} /> : undefined

  /* the quick links — fxr's chromes, a phone's stack above the rows; a desk never sees them. The stack is fxr's EntryScreen
   * verbatim (kol-fxr src/editor/mobile/MobileView.jsx): `kol-eyebrow text-body`, `gap-2`, `tone="primary" size="lg"`, the icon
   * both ends, `SPREAD` (w-full, the inner span spread) — without its card */
  const doors = touch?.doors?.length && (coarse || narrow) ? (
    <div className="flex flex-col gap-6 mb-8" data-hub-doors>
      {touch.label && <span className="kol-eyebrow text-body">{touch.label}</span>}
      <div className="flex flex-col gap-2">
        {touch.doors.map((d) => <Button key={d.label} tone="primary" size="lg" iconLeft={d.icon} iconRight={d.icon} className="w-full [&>span]:w-full [&>span]:justify-between" onClick={d.onPress}>{d.label}</Button>)}
      </div>
    </div>
  ) : undefined

  if (signedOut ?? (stage != null && files.length === 0)) {
    const outActions = [...menuActions, ...(signInAction ? [signInAction] : [])]
    return (
      <div className="relative min-h-dvh overflow-hidden" data-hub-signed-out>
        {stage && <div className="absolute inset-0" aria-hidden="true">{stage}</div>}
        {app.logomark && (
          <div className="absolute left-4 top-6 w-12 h-12 md:left-20 md:top-16 md:w-28 md:h-28 text-emphasis">
            <VectorLoader src={app.logomark} size="100%" role="img" aria-label={app.name} />
          </div>
        )}
        {outActions.length > 0 && <HomeMenu actions={outActions} icon="plus" className="absolute right-16 top-[72px] max-md:hidden" />}
        {chromes.length > 0 && <PhoneNav variant="dock" shape="pill" items={chromes.map((c) => ({ id: c.label, label: c.label, icon: c.icon, onPress: c.onPress }))} />}
        {/* the walkthrough over the stage, where the catalog's would sit */}
        {touring && steps.length > 0 && (
          <div className="absolute inset-x-4 top-24 md:left-20 md:right-auto md:top-52 md:w-[560px]">
            <WalkthroughPanel steps={steps} iconComponent={iconComponent} onClose={close} />
          </div>
        )}
      </div>
    )
  }

  return (
    <CatalogPage
      preset="app"
      header={{ title: title ?? app.name, subtitle: subtitle ?? app.subtitle, size: 'sm', voice: 'mono', actions: headerMenu, actionsPlacement: headerMenu ? 'head' : undefined }}
      items={items}
      toCard={toCard}
      flipped={flipped}
      backHover={backHover}
      filtersTitle="All Files"
      filterGroups={groups?.map(({ exclusive: _x, ...g }) => g)}
      filtersProps={exclusive?.length ? { mutuallyExclusiveFilters: exclusive } : undefined}
      views={views}
      view={view}
      onViewChange={setView}
      /* grid always (the user, 2026-10-09: "it should always default to grid mode"); the list is the preset's —
       * the app row three across (his 2026-10-22 ruling: "3 columns per row, not one single column") */
      defaultLayout="grid"
      iconComponent={iconComponent}
      walkthrough={steps.length ? { open: touring, steps, onClose: close, iconComponent } : undefined}
      lead={doors}
    />
  )
}

/* the masthead's round button and its sheet — the catalog's VariantsButton shape, the phone More's rows */
function HomeMenu({ actions, icon = 'more', className = '' }) {
  const [open, setOpen] = useState(false)
  /* the sheet opens to the LEFT of the button, top edges on one line (user 2026-10-23) — as the phone's sits beside its × */
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'left-start', offset: 12 })
  return (
    <div className={className}>
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex">
        {/* `icon` — `more` on Home, `plus` signed out (frame B2), the × while its sheet is open */}
        <Button iconOnly={icon === 'more' ? 'more' : open ? 'x' : icon} size="lg" tone="inverted" radius="full" aria-label={open ? 'Close' : 'Actions'} pressed={open} />
      </span>
      <PopoverPanel popover={popover} panel={false} className="kol-more-sheet" style={{ minWidth: 220 }}>
        <MoreRows actions={actions} onPick={() => setOpen(false)} />
      </PopoverPanel>
    </div>
  )
}

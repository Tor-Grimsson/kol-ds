import { useEffect, useState } from 'react';
import MediaLibrary from '@kolkrabbi/kol-component/organisms/MediaLibrary';
import IconFrame from '@kolkrabbi/kol-component/atoms/IconFrame';
import { Tooltip } from '@kolkrabbi/kol-component/utilities/Popover';
import { useModal } from '@kolkrabbi/kol-component/molecules/Modal';
import { useTheme } from '@kolkrabbi/kol-framework/src/theme.js';
import useMediaQuery from '@kolkrabbi/kol-component/hooks/useMediaQuery';
import { createFixtureClient } from 'media-fixture';
import { useFixtureMedia } from 'media-fixture/wiring';
import FileFormats from './FileFormats';
import { DEFAULTS, loadSettings, saveSettings, resetSettings } from './lib/settings';

/* The imagined olina setup (apps/media-fixture): a fake bucket + a fake D1. This app keeps its own
 * settings module (the forced column height lives there), so it hands the client that pair; the
 * shell app takes the fake D1's. */
const fixtureClient = createFixtureClient({
  settings: { load: loadSettings, save: (b, s) => (s === null ? resetSettings(b) : (saveSettings(b, s), s)) },
});
import ShortcutsOverlay from '@kolkrabbi/kol-shell/src/ShortcutsOverlay.jsx';
import { SHORTCUTS, BINDINGS } from './lib/shortcuts';

/* kol-r2b2's App.jsx, PORTED 1:1. Every ruling, comment, class and behaviour is
 * that file's. Four wiring changes and one addition, and nothing else:
 *   1. `fixtureClient` replaces `lib/client` + `lib/api` — no network.
 *   2. `BUCKETS` comes off the fixture instead of the api module; there is no
 *      module-level `setBucket`, because the fixture takes the bucket per call.
 *   3. `folderTree` is LIVE off the store, not a baked JSON manifest — here
 *      folders are real nodes that change under you, which is the point.
 *   4. `publicUrl(key)` → `fixtureClient.mediaUrl(key, bucket)`.
 *   + a Clear-changes control, required by the tier rules: the tree is mutable
 *     and destructive verbs must be repeatable.
 * The layout fault (two stacked full-height surfaces) is deliberately INTACT —
 * fixing it is a change, and changes come after this port is approved. */

/* kol-r2b2 thumbnails STILLS ONLY — "video would need a poster or a frame walk, and the DS already
 * draws a kind glyph for everything else — better than an unloaded rectangle" — because against a
 * live bucket a video thumb pulls the whole object for a 44px tile, and some of those are 400 MB.
 * The fixture's videos are local assets of a few hundred KB, so the cost that ruling avoided does
 * not exist here and a video gets a real frame. */
const TABS = [
  { value: 'browse', label: 'Browse', icon: 'folder' },
  { value: 'files', label: 'Files', icon: 'view-list' },
  { value: 'kinds', label: 'Kinds', icon: 'grid' },
];

/* How a date READS is ours, not the DS's — that is why `formatDate` is a seam beside
 * `formatSize` (component 0.209.0). Short local date, the form both references use
 * (`28.8.2026`), because the meta line cannot wrap and an ISO stamp fills it alone. */
/* The wordmark, and the virtual root the browser builds from it. This is the PRODUCT's name, not
 * the consumer repo's — kol-r2b2 is one consumer of the media product, and `apps/media` is the
 * product itself (user 2026-09-21: "this logo should just say MEDIA not r2b2"). */
const TITLE = 'MEDIA';

/* ONE VIEW still (the 2026-08-26 ruling — no tabs): the DS split the surface into two
 * pages, so they are STACKED here exactly as FileList had them — `browse` renders the
 * header, the crumb line and the columns; `library` renders the wall below it with
 * `header={false}`, sharing one bucket, one prefix and one settings object. */

/* THE THEME TOGGLE — in the settings drawer's footer, beside the reset icon, in the SAME chip
 * (user 2026-08-28). Passed as `settingsFooter` (BrowsePageRulingsAndSeams, component 0.166.0);
 * `SettingsFooter` renders it in reset's own row, before the reset button. Same
 * `IconFrame variant="primary" size="sm"` as reset, driven by the framework's own `useTheme`. */
function ThemeChip() {
  const { theme, cycle } = useTheme();
  const dark = theme === 'dark';
  return (
    <Tooltip label={dark ? 'Switch to light' : 'Switch to dark'}>
      <IconFrame
        name="mode-toggle-01"
        variant="primary"
        size="sm"
        onClick={cycle}
        aria-label={dark ? 'Switch to light' : 'Switch to dark'}
      />
    </Tooltip>
  );
}

export default function App() {
  // The folder path lives in the URL hash (#img/04-collections/) so browser
  // Back/Forward walk folders and a reload lands where you were.
  const [prefix, setPrefixState] = useState(() => decodeURIComponent(location.hash.slice(1)));
  const setPrefix = (next) => {
    setPrefixState(next);
    const hash = next ? `#${encodeURIComponent(next).replace(/%2F/g, '/')}` : '';
    if (location.hash !== hash) history.pushState(null, '', hash || location.pathname);
  };
  useEffect(() => {
    const onPop = () => setPrefixState(decodeURIComponent(location.hash.slice(1)));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const modal = useModal();
  /* THE WIRING (media-fixture/wiring, shared with apps/media-shell): the bucket, the verbs, the
   * trash, uploads and the three seams — this app keeps only its chrome and its hash routing. */
  const media = useFixtureMedia({ client: fixtureClient, title: TITLE, setPrefix, defaults: DEFAULTS });
  const { bucket, fileActions, clearChanges } = media;
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  /* Below `md` the three surfaces are TABS, one at a time; above it they stay stacked. A
   * structural fork, so it is a JS query and not a Tailwind class — the markup differs, it is not
   * one tree with different padding. `useMediaQuery` is the DS's own hook for exactly this. */
  const stack = useMediaQuery('(max-width: 767px)');

  /* ONE VIEW STATE, BOTH BREAKPOINTS. The mobile tab pill and the desktop switch are two controls
   * over the same question — which surface am I looking at — so they share `view` rather than the
   * pill driving a `tab` the desktop stack ignored. `kinds` is an overlay, not a view: selecting
   * it opens the overlay and leaves the surface on whatever it was, because a tab with nothing
   * behind it is a dead end. */
  /* ONE SURFACE, FOUR VIEWS (component 0.217.0, the merge). The phone pill still names three
   * things, because a tab is a place and `kinds` is an overlay: Browse is the tree, Files is the
   * wall, and which FLAVOUR of each (columns/rows, grid/list) is the view switch's business. */
  const [view, setView] = useState('columns');
  const [tab, setTab] = useState('browse');
  const onTabChange = (v) => {
    setTab(v);
    setOverviewOpen(v === 'kinds');
    if (v === 'browse') setView('columns');
    if (v === 'files') setView('list');
  };
  const tabProps = stack ? { tabs: TABS, activeTab: tab, onTabChange } : {};

  /* THE BINDINGS, read off the same array the overlay renders (`lib/shortcuts.js`), so a key can
   * never be listed and not work. Ignored while typing — a search field owns its own letters, and
   * a bare-letter keymap that steals them is the classic version of this bug. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target;
      if (el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? '')) return;
      if (!BINDINGS.some((b) => b.key === e.key)) return;
      e.preventDefault();
      switch (e.key) {
        case 'b': setView('columns'); setTab('browse'); break;
        case 'f': setView('list'); setTab('files'); break;
        case 'r': setView('rows'); setTab('browse'); break;
        case 'c': setView('columns'); setTab('browse'); break;
        case 'g': setView('grid'); setTab('files'); break;
        case 'k': setOverviewOpen((v) => !v); break;
        case 's': setShortcutsOpen((v) => !v); break;
        case 'n': if (bucket.writable) {
          modal.prompt(`New folder in ${prefix || 'the bucket root'}:`, '', { okLabel: 'Create' }).then((name) => {
            if (name?.trim()) fileActions.createFolder(`${prefix}${name.trim().replace(/^\/+|\/+$/g, '')}/`);
          });
        } break;
        case 'R': clearChanges(); break;
        default: break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });


  /* THE SETTINGS FOOTER, kol-olina's arrangement (2026-09-21): the kind overview is a reference,
   * not a daily control, so it sits in the drawer beside theme and reset instead of the header. */
  /* TWO RESETS, TWO JOBS, ONE PLACE (user 2026-09-23: *"clear changes should live in settings …
   * one clears the file changes and the other sets the preferences defaults"*). Clear changes puts
   * the FIXTURE back — files, folders, trash — and wears a folder; the DS's own reset beside it
   * (refresh glyph) puts the PREFERENCES back to today's defaults. It left the header, where it
   * sat as a second refresh icon beside the reload. */
  const settingsFooter = (
    <>
      <ThemeChip />
      <Tooltip label="Clear changes — the fixture's files back to the seed">
        <IconFrame name="folder" variant="primary" size="sm" onClick={clearChanges} aria-label="Clear changes" />
      </Tooltip>
      <Tooltip label="File formats">
        <IconFrame name="grid" variant="primary" size="sm" onClick={() => setOverviewOpen(true)} aria-label="File formats" />
      </Tooltip>
    </>
  );

  return (
    <div className="min-h-screen py-6 max-w-[var(--kol-container-max)] mx-auto breakpoint-padding flex flex-col gap-10">
      {/* ONE SURFACE, TWO VIEWS (`variant="explorer"`, component 2026-09-21). This used to be two
          `<MediaLibrary>` calls stacked — browse at a fixed 800px with the wall and the drop zone
          below the fold, `header={false}` and `stats={false}` suppressing the second copy of each.
          The explorer mounts one at a time behind a switch beside the bucket dropdown, so the
          suppressions are gone and so is the scroll.

          `gap-10` IS the page rhythm (user 2026-08-27: the air goes BETWEEN the units, never
          inside one). `media-browse` is the count-line hook — a class we own beats a DOM shape
          we don't. */}
      <MediaLibrary
        variant="explorer"
        {...media.props}
        {...tabProps}
        view={view}
        onViewChange={setView}
        prefix={prefix}
        onPrefix={setPrefix}
        autoFocus
        settingsFooter={settingsFooter}
        className="gap-10 media-browse"
      />

      {/* A tile opens that kind's file large, inside the same dialog — the grid is a step, not a filter. */}
      {/* The DS's own sheet (kol-shell), fed the SAME array the bindings are read from. Hand-rolling
          a second one here is the duplication that component exists to end — kol-mirror and
          kol-monitor each kept their own and both drifted from their settings page. */}
      {shortcutsOpen && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setShortcutsOpen(false)} />}

      <FileFormats
        open={overviewOpen}
        onClose={() => { setOverviewOpen(false); if (stack) setTab('browse'); }}
        client={fixtureClient}
        buckets={media.buckets}
      />
    </div>
  );
}

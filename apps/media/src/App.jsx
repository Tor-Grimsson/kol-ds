import { useEffect, useState } from 'react';
import UploadZone from './UploadZone';
import MediaLibrary from '@kolkrabbi/kol-component/organisms/MediaLibrary';
import IconFrame from '@kolkrabbi/kol-component/atoms/IconFrame';
import { Tooltip } from '@kolkrabbi/kol-component/utilities/Popover';
import { useTheme } from '@kolkrabbi/kol-framework/src/theme.js';
import { kindOf } from '@kolkrabbi/kol-component/utilities/mediaKinds';
import useMediaQuery from '@kolkrabbi/kol-component/hooks/useMediaQuery';
import fixtureClient from './fixture/client';
import KindOverview from './KindOverview';
import { loadSettings, saveSettings, resetSettings } from './lib/settings';
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
const THUMBABLE = new Set(['image', 'video']);

/* THE THREE SURFACES (ColumnBrowserMobileViews §5, user-ruled 2026-09-03). Neither reference
 * stacks two full-height surfaces on a phone; each floats a pill and gives every surface a tab.
 * The DS ships the pill and takes a list — what a tab MEANS is ours, and ours are the three this
 * app already had: the folder tree, the ContentFilters wall, and the kind overview. Above `md`
 * nothing here renders and the 2026-08-26 one-view ruling stands: both pages, stacked. */
const TABS = [
  { value: 'browse', label: 'Browse', icon: 'folder' },
  { value: 'files', label: 'Files', icon: 'view-list' },
  { value: 'kinds', label: 'Kinds', icon: 'grid' },
];

/* How a date READS is ours, not the DS's — that is why `formatDate` is a seam beside
 * `formatSize` (component 0.209.0). Short local date, the form both references use
 * (`28.8.2026`), because the meta line cannot wrap and an ISO stamp fills it alone. */
const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(+d) ? iso : `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

/* The wordmark, and the virtual root the browser builds from it. This is the PRODUCT's name, not
 * the consumer repo's — kol-r2b2 is one consumer of the media product, and `apps/media` is the
 * product itself (user 2026-09-21: "this logo should just say MEDIA not r2b2"). */
const TITLE = 'MEDIA';

const BUCKETS = Object.fromEntries(fixtureClient.buckets().map((b) => [b.id, b]));

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

// The last-used bucket survives a reload (localStorage; falls back to r2).
const BUCKET_KEY = 'kol-media:bucket';
const initialBucket = () => {
  try { const v = localStorage.getItem(BUCKET_KEY); if (v && BUCKETS[v]) return v; } catch { /* private mode */ }
  return 'r2';
};

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [bucketId, setBucketId] = useState(initialBucket);
  const [settings, setSettings] = useState(() => loadSettings(bucketId));
  const [uploadOpen, setUploadOpen] = useState(() => loadSettings(bucketId).uploadOpen);

  const bucket = BUCKETS[bucketId];
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  /* The tree is read fresh after every mutation. kol-r2b2 bakes this to JSON (scripts/folder-tree.mjs)
   * because a live bucket cannot be walked cheaply; here the store IS the tree, so a folder created,
   * moved or emptied shows in the columns at once. */
  const [folderTree, setFolderTree] = useState(() => fixtureClient.folderTree());
  const touched = () => { setFolderTree(fixtureClient.folderTree()); setRefreshKey((k) => k + 1); };

  /* Below `md` the three surfaces are TABS, one at a time; above it they stay stacked. A
   * structural fork, so it is a JS query and not a Tailwind class — the markup differs, it is not
   * one tree with different padding. `useMediaQuery` is the DS's own hook for exactly this. */
  const stack = useMediaQuery('(max-width: 767px)');

  /* ONE VIEW STATE, BOTH BREAKPOINTS. The mobile tab pill and the desktop switch are two controls
   * over the same question — which surface am I looking at — so they share `view` rather than the
   * pill driving a `tab` the desktop stack ignored. `kinds` is an overlay, not a view: selecting
   * it opens the overlay and leaves the surface on whatever it was, because a tab with nothing
   * behind it is a dead end. */
  const [view, setView] = useState('browse');
  const [tab, setTab] = useState('browse');
  const onTabChange = (v) => {
    setTab(v);
    setOverviewOpen(v === 'kinds');
    if (v !== 'kinds') setView(v);
  };
  const tabProps = stack ? { tabs: TABS, activeTab: tab, onTabChange } : {};

  // Persist on every change. `null` is the panel's reset signal.
  const applySettings = (next) => {
    if (next === null) {
      const back = resetSettings(bucketId);
      setSettings(back);
      setUploadOpen(back.uploadOpen);
      return;
    }
    setSettings(next);
    saveSettings(bucketId, next);
    setUploadOpen(next.uploadOpen);
  };

  const switchBucket = (id) => {
    if (!BUCKETS[id]) return;
    const next = loadSettings(id);
    setBucketId(id);
    try { localStorage.setItem(BUCKET_KEY, id); } catch { /* private mode */ }
    setSettings(next);
    // A bucket you never upload to should never arrive with a drop pool open.
    setUploadOpen(next.uploadOpen);
    setPrefix('');
    setRefreshKey((k) => k + 1);
  };

  /* CLEAR CHANGES — the one control this app has that the live one cannot. The tier rules require
   * a reset so destructive verbs can be exercised repeatedly against the fixture. */
  const clearChanges = () => {
    fixtureClient.reset();
    setPrefix('');
    touched();
  };

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
        case 'b': setView('browse'); setTab('browse'); break;
        case 'f': setView('files'); setTab('files'); break;
        case 'r': setSettings((s) => { const n = { ...s, folderView: 'rows' }; saveSettings(bucketId, n); return n }); break;
        case 'c': setSettings((s) => { const n = { ...s, folderView: 'columns' }; saveSettings(bucketId, n); return n }); break;
        case 'k': setOverviewOpen((v) => !v); break;
        case 's': setShortcutsOpen((v) => !v); break;
        case 'u': if (bucket.writable) setUploadOpen((v) => !v); break;
        case 'n': if (bucket.writable) {
          const name = prompt(`New folder in ${prefix || 'the bucket root'}:`);
          if (name?.trim()) fileActions.createFolder(`${prefix}${name.trim().replace(/^\/+|\/+$/g, '')}/`);
        } break;
        case 'R': clearChanges(); break;
        default: break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /* The app's own controls, slotted into the DS header beside its bucket dropdown, lock and gear.
   * The grid opens the kind overview — what this bucket actually holds, one tile per kind. */
  /* These three use the DS `Tooltip` (utilities/Popover → `.kol-tooltip`) rather than a `title`
   * attribute, so the shipped tooltip is visible next to the gear's native browser one — the gear
   * is drawn by MediaLibraryPages, which hardcodes `title`. Side by side on purpose, pending the
   * ruling on which the DS should use. */
  const headerActions = (
    <>
      <span className="max-md:hidden contents">
        <Tooltip label="What is in this bucket">
          <IconFrame name="grid" variant="primary" size="sm" onClick={() => setOverviewOpen(true)} aria-label="What is in this bucket" />
        </Tooltip>
      </span>
      <Tooltip label="Clear changes">
        <IconFrame name="refresh" variant="primary" size="sm" onClick={clearChanges} aria-label="Clear changes" />
      </Tooltip>
      {bucket.writable && (
        <Tooltip label="Upload">
          <IconFrame name="upload" variant="primary" size="sm" onClick={() => setUploadOpen((v) => !v)} aria-label={uploadOpen ? 'Close upload' : 'Upload'} aria-expanded={uploadOpen} />
        </Tooltip>
      )}
    </>
  );

  /* ── THE THREE SEAMS (ColumnBrowserMobileViews, component 0.209.0) ─────────────────────────
   * The DS deliberately does not count, does not fetch and does not decide how a date reads.
   * All three are answered here because this app already holds what they need. */

  /* Multi-bucket browse prefixes every key with a virtual root (`<title>/<bucket label>/`) so the
   * stores share one tree. Both seams are handed those prefixed paths, and both need the
   * bucket-relative key back — the counts are keyed that way and `mediaUrl` builds from it.
   * The root IS the title, so the two cannot be written separately. */
  const unroot = (p) => {
    const vroot = `${TITLE}/${bucket.label}/`;
    return p.startsWith(vroot) ? p.slice(vroot.length) : p;
  };

  const folderMeta = (path) => {
    const c = folderTree[bucketId]?.counts?.[unroot(path)];
    // The count alone, as both references show it. Files carry `date · size`; a folder has
    // neither of its own, and the tally is the one fact about it worth a line.
    return c ? `${c.files} item${c.files === 1 ? '' : 's'}` : '';
  };

  /* The tile. Anything outside THUMBABLE falls through to the DS's kind glyph. A video draws its
   * own first frame — `preload="metadata"` plus `#t=0.1`, which is what makes a browser paint a
   * frame rather than a black rectangle; muted + playsInline so nothing autoplays or goes
   * fullscreen on a tap. */
  const thumbnailFor = (o) => {
    const kind = kindOf(o);
    if (!THUMBABLE.has(kind)) return null;
    const url = fixtureClient.mediaUrl(unroot(o.key), bucketId);
    return kind === 'video'
      ? <video src={`${url}#t=0.1`} preload="metadata" muted playsInline
               className="w-full h-full object-cover" />
      : <img src={url} alt="" loading="lazy" decoding="async"
             className="w-full h-full object-cover" />;
  };

  /* THE FILE VERBS, wired to the fixture. Every one of these has existed in `fixture/store.js`
   * since phase 2 with a passing self-check, and nothing in the UI could reach them — the store
   * could create a folder and the product could not. `move` is `rename` with a new parent, which
   * is what it is in a key-prefix bucket too; the difference here is that a folder is a real node,
   * so moving one actually moves its children instead of rewriting keys one at a time. */
  const fileActions = {
    createFolder: async (path) => { await fixtureClient.createFolder(path, bucketId); touched() },
    createFile: async (key) => { await fixtureClient.createFile(key, bucketId); touched() },
    rename: async (from, to) => { await fixtureClient.renameObject(from, to, bucketId); touched() },
    move: async (path, destFolder) => {
      const name = path.replace(/\/$/, '').split('/').pop()
      const isFolder = path.endsWith('/')
      await fixtureClient.renameObject(path, `${destFolder}${name}${isFolder ? '/' : ''}`, bucketId)
      touched()
    },
    remove: async (path) => { await fixtureClient.deleteObject(path, bucketId); touched() },
  }

  const shared = {
    client: fixtureClient,
    title: TITLE,
    fileActions: bucket.writable ? fileActions : undefined,
    bucket: bucketId,
    onBucketChange: switchBucket,
    settings,
    onSettingsChange: applySettings,
    refreshKey,
    stackView: settings.stackView ?? 'list',
    folderMeta,
    thumbnailFor,
    formatDate,
  };

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
        {...shared}
        {...tabProps}
        view={view}
        onViewChange={setView}
        prefix={prefix}
        onPrefix={setPrefix}
        folderTree={folderTree}
        headerActions={headerActions}
        autoFocus
        settingsFooter={<ThemeChip />}
        className="gap-10 media-browse"
        /* THE DROP ZONE RIDES THE `banner` SLOT, directly under the header. Rendered after the
           surface — which is where it used to sit — it landed below an 800px column browser, so
           pressing Upload scrolled you past the whole browser to reach the target you had just
           asked for. Measured at 968px on a 900px viewport before the slot existed. */
        banner={bucket.writable && uploadOpen
          ? <UploadZone pathPrefix={prefix} bucket={bucketId} onUploaded={touched} />
          : null}
      />

      {/* A tile opens that kind's file large, inside the same dialog — the grid is a step, not a filter. */}
      {/* The DS's own sheet (kol-shell), fed the SAME array the bindings are read from. Hand-rolling
          a second one here is the duplication that component exists to end — kol-mirror and
          kol-monitor each kept their own and both drifted from their settings page. */}
      {shortcutsOpen && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setShortcutsOpen(false)} />}

      <KindOverview
        open={overviewOpen}
        onClose={() => { setOverviewOpen(false); if (stack) setTab('browse'); }}
        client={fixtureClient}
        buckets={Object.values(BUCKETS)}
      />
    </div>
  );
}

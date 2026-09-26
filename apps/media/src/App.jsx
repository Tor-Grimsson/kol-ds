import { useEffect, useState } from 'react';
import MediaLibrary from '@kolkrabbi/kol-component/organisms/MediaLibrary';
import { createFixtureClient } from 'media-fixture';
import { useFixtureMedia, useMediaTool, TOOL_SHORTCUTS } from 'media-fixture/wiring';

/* The imagined olina setup (apps/media-fixture): a fake bucket + a fake D1. Settings AND their
 * per-bucket defaults are the fixture's, shared with apps/media-shell (2026-09-26 — this app kept
 * its own module and the same tool opened differently one shell over; retired to _tmp/). */
const fixtureClient = createFixtureClient();
import ShortcutsOverlay from '@kolkrabbi/kol-shell/src/ShortcutsOverlay.jsx';

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
/* THE TOOL'S EXTRAS ARE SHARED (2026-09-26): the phone tabs, the view keys and N live in the DS
 * explorer (`keys`, `phoneTabs`); the drawer footer, the file-formats overview and ⇧R in
 * media-fixture's `useMediaTool` — so apps/media-shell renders the same tool. This app keeps its
 * frame, its hash routing and its own S sheet. */

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
  /* THE WIRING (media-fixture/wiring, shared with apps/media-shell): the bucket, the verbs, the
   * trash, uploads and the three seams — this app keeps only its chrome and its hash routing. */
  const media = useFixtureMedia({ client: fixtureClient, title: TITLE, setPrefix });
  const tool = useMediaTool({ client: fixtureClient, media });
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  /* S — this app's sheet (the tool's keys are the explorer's; ⇧R is the fixture's). Ignored while
   * typing — a search field owns its own letters. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 's' || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target;
      if (el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? '')) return;
      e.preventDefault();
      setShortcutsOpen((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
        {...tool.props}
        prefix={prefix}
        onPrefix={setPrefix}
        autoFocus
        className="gap-10 media-browse"
      />

      {/* A tile opens that kind's file large, inside the same dialog — the grid is a step, not a filter. */}
      {/* The DS's own sheet (kol-shell), fed the SAME array the bindings are read from. Hand-rolling
          a second one here is the duplication that component exists to end — kol-mirror and
          kol-monitor each kept their own and both drifted from their settings page. */}
      {shortcutsOpen && <ShortcutsOverlay shortcuts={TOOL_SHORTCUTS} onClose={() => setShortcutsOpen(false)} />}

      {tool.overlay}
    </div>
  );
}

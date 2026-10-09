import { useEffect, useState } from 'react';
import MediaLibrary from '@kolkrabbi/kol-component/organisms/MediaLibrary';
import { createFixtureClient } from 'media-fixture';
import { useFixtureMedia, useMediaTool, TOOL_SHORTCUTS } from 'media-fixture/wiring';

/* The imagined olina setup (apps/media-fixture): a fake bucket + a fake D1. Settings AND their
 * per-bucket defaults are the fixture's, shared with apps/media-hub (2026-09-26 — this app kept
 * its own module and the same tool opened differently one shell over; retired to _tmp/). */
const fixtureClient = createFixtureClient();
import { PageShell, ShortcutsOverlay } from '@kolkrabbi/kol-shell';
import { Button, PageHeader, MediaTileGallery } from '@kolkrabbi/kol-component';

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
/* THE TOOL'S EXTRAS ARE SHARED (2026-09-26): the view keys and N live in the DS explorer (`keys`;
 * `phoneTabs` is off since 2026-09-29); the drawer footer, the file-formats overview and ⇧R in
 * media-fixture's `useMediaTool` — so apps/media-hub renders the same tool. This app keeps its
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

/* THE PICKER PAGE — `/picker` (user, 2026-10-07: "apps/media/picker"). The modal library as a
 * consumer opens it: fxr's three library doors, a brand book's image slot — `MediaLibrary
 * variant="modal"` over a client, `onSelect(url, { contentType, kind })` back. The component
 * page previews the component; this is the preview of its USE, over the fixture bucket, with
 * the pick shown under the button. The modal's Store dropdown lists the fixture's two buckets. */
/* THE PICKER IS A VARIANT (user 2026-10-09: "why is this even a choice? it should be a variant
 * option"). Picker A was built here 2026-10-08 to be seen before the package changed; it is
 * `MediaLibrary variant="picker"` now — the browse surface in the modal card with a Use footer —
 * and `variant="modal"` keeps its own grid | list listing. Both routes stay so each variant is
 * walked as a consumer opens it:
 *   /picker · /picker/a — variant="picker"
 *   /picker/b           — variant="modal"
 * Both cards are one fixed height (the theme's `--kol-media-picker-h`), whatever the folder holds. */
function PickerPage({ variant }) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(null);
  const media = useFixtureMedia({ client: fixtureClient, title: TITLE });
  const { title, folderMeta, thumbnailFor, formatDate, folderTree } = media.props;
  return (
    <PageShell className="gap-10">
      <PageHeader
        title={`variant="${variant}"`}
        subtitle={variant === 'picker'
          ? 'The browse surface in the modal card: columns · rows · grid, select a file, Use'
          : 'The modal library: its own grid | list listing'}
        size="sm"
        voice="mono"
      />
      <div className="flex flex-col items-start gap-6">
        <Button tone="grey" size="md" onClick={() => setOpen(true)}>Pick media</Button>
        {picked && (
          <div className="flex items-start gap-4">
            {picked.kind === 'video'
              ? <video src={picked.url} muted controls className="w-48 rounded border border-oq-08" />
              : <img src={picked.url} alt="" className="w-48 rounded border border-oq-08" />}
            <dl className="kol-mono-12 flex flex-col gap-1">
              <div><dt className="text-fg-32 inline">url </dt><dd className="inline break-all">{picked.url}</dd></div>
              <div><dt className="text-fg-32 inline">contentType </dt><dd className="inline">{picked.contentType}</dd></div>
              <div><dt className="text-fg-32 inline">kind </dt><dd className="inline">{picked.kind}</dd></div>
            </dl>
          </div>
        )}
      </div>
      <MediaLibrary
        variant={variant}
        open={open}
        client={fixtureClient}
        accept={['image', 'video']}
        onClose={() => setOpen(false)}
        onSelect={(url, meta) => setPicked({ url, ...meta })}
        {...(variant === 'picker' ? { title, folderMeta, thumbnailFor, formatDate, folderTree } : {})}
      />
    </PageShell>
  );
}

/* THE VIEWER PAGE — `/viewer`: `MediaTileGallery` over one fixture folder, each tile opening THE
 * fullscreen `MediaViewer` at that tile, paged across the set — the site-tier way into the viewer
 * (the library's tiles open the same viewer from inside the explorer). */
function ViewerPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let on = true;
    fixtureClient.listMedia('img/01-shoots/', { bucket: 'r2' }).then((objs) => {
      if (!on) return;
      setItems(objs
        .filter((o) => /^image\//.test(o.contentType ?? ''))
        .map((o) => ({ url: fixtureClient.mediaUrl(o.key, 'r2'), alt: o.key.split('/').pop(), kind: 'image', caption: o.key.split('/').pop() })));
    });
    return () => { on = false; };
  }, []);
  return (
    <PageShell className="gap-10">
      <PageHeader
        title="Viewer"
        subtitle="Framed tiles that open the fullscreen viewer at the tile, paged across the set"
        size="sm"
        voice="mono"
      />
      <MediaTileGallery items={items} layout="grid" cols={4} />
    </PageShell>
  );
}

/* EVERY SURFACE THE MEDIA FAMILY SHIPS HAS A ROUTE (user, 2026-10-08: "I want to preview and
 * sync every media output, mobile desktop touch, every variant"):
 *
 *   /          explorer — the browser and the wall as two views of one surface (media as it ships)
 *   /library   library  — the files wall alone: FILES, filter · search, grid / list, FLAT, the sort row
 *   /picker    MediaLibrary variant="picker" (also /picker/a); /picker/b is variant="modal", the
 *              modal library with its own grid | list
 *   /viewer    MediaViewer, from MediaTileGallery's tiles
 *
 * Paths, not hashes — the hash is the folder prefix. Built, the app sits under `/apps/media/` and
 * vercel.json rewrites `/apps/media/(.*)` to its index.html. */
const route = () => location.pathname.slice(import.meta.env.BASE_URL.length).replace(/\/+$/, '');

export default function App() {
  const r = route();
  if (r === 'picker' || r === 'picker/a') return <PickerPage variant="picker" />;
  if (r === 'picker/b') return <PickerPage variant="modal" />;
  if (r === 'viewer') return <ViewerPage />;
  return <Library variant={r === 'library' ? r : 'explorer'} />;
}

function Library({ variant }) {
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
  /* THE WIRING (media-fixture/wiring, shared with apps/media-hub): the bucket, the verbs, the
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
    /* THE TOOL FRAME (app anatomy § Tool frame, 2026-09-27): PageShell fixed · bleed — the page the
       tool gets inside apps/media-hub, so alone and in the shell are one geometry. It was the
       site tier's `--kol-container-max` cap and `breakpoint-padding`, which no other app wears. */
    <PageShell mode="fixed" className="gap-10">
      {/* ONE SURFACE, TWO VIEWS (`variant="explorer"`, component 2026-09-21). This used to be two
          `<MediaLibrary>` calls stacked — browse at a fixed 800px with the wall and the drop zone
          below the fold, `header={false}` and `stats={false}` suppressing the second copy of each.
          The explorer mounts one at a time behind a switch beside the bucket dropdown, so the
          suppressions are gone and so is the scroll.

          `gap-10` IS the page rhythm (user 2026-08-27: the air goes BETWEEN the units, never
          inside one). `media-browse` is the count-line hook — a class we own beats a DOM shape
          we don't. */}
      <MediaLibrary
        variant={variant}
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
    </PageShell>
  );
}

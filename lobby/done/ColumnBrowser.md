---
component: ColumnBrowser
source: kol-r2b2/src/ColumnBrowser.jsx (whole file) + FileList.jsx wiring + index.css overrides — built locally on kol-component 0.93.1 / kol-theme 0.62.0
staged: 2026-08-27
status: draft
deps: [ContentFilters, ContentCard, ContentRow, ContentMedia, FullscreenOverlay, ActionButton, ToggleCheckbox, ViewToggle, Icon, Table]
---

# ColumnBrowser + the second round of collection rulings

## Purpose
Built and ruled locally in kol-r2b2 after `ContentFiltersCollection` shipped (user: "make it locally first, then ship it"). One new organism — **`ColumnBrowser`**, Finder-style Miller columns as the listing surface's **folder view** (it replaces the folder rows above the files; it is NOT a card layout) — plus five fixes/rulings on pieces that already shipped. Everything below renders today on the consumer; the DS ships it so the consumer's local code goes away. "Identically" means the pixels, not the code.

## 1 · `ColumnBrowser` (new organism)

Reference: macOS Finder column view (path bar → columns → preview pane; the user's own screenshot was the brief) and `_assets/2026-08-27-column-browser/column-view-height-ref.png` (the ruled default height). Source verbatim in §5.

- **Data**: a flat key space (`objects[{ key, size, uploaded, contentType }]`) + `prefix`; one column per path segment of `prefix` (column 0 = root). Folders derived by `partition`-style prefix split. Picking a folder sets `prefix` to it (deeper columns truncate); picking a file highlights it and opens a **preview column** on the right.
- **Preview column** (320px): image (`object-contain` in a 1/1 `bg-fg-04` frame) or the kind label; file name; a `dl` of Kind · Type · Size · **Dimensions (W × H px, read from the loaded image)** · Date. `preview-column.png`.
- **Rows** wear the DS **Table** cell metrics (`kol-components-organisms.css` `.kol-table-cell-*`): `12px 16px` padding, `kol-mono-12`, `oq-08` hairline between rows, none after the last. Folder rows: folder icon · name · `chevron-right`; file rows: kind icon (`image`/`video`/`audio`/`file`) · name, `text-fg-48` at rest.
- **Selected and cursor rows use the HOVER fill (`bg-fg-04`)** — user ruling: "make hover state the selected state"; the darker `fg-absolute-12` was invisible. The open folder in each column and the picked file are "selected"; the keyboard row is "cursor"; both draw the same fill.
- **Height**: fixed **528px = 12 rows × 44px** (user ruling), columns scroll inside; container `overflow-x-auto`, `oq-08` border, `rounded`. **No focus ring** on the container (it was drawing one after the overlay returned focus).
- **Keyboard**, Finder's: ↑/↓ move in the column — landing on a folder OPENS its column, landing on a file previews it; → into the open folder's column (first row); ← back to the parent column on the folder you came out of. **Space** = Quick Look: opens the picked file in the overlay **over the column's files** with a real index (`3 / 11`). While the overlay is open: ↑/↓ step the file (overlay and column highlight follow), ←/→ are the overlay's own, space closes. The opening keystroke bubbles from the browser and must not close what it just opened (guard: ignore window keys whose target is inside the browser).
- **Consumer wiring**: the folder-view toggle is an icon `ViewToggle` (rows `view-list` · columns — **`layout` glyph stands in; kol-icons needs a `columns` glyph**) beside the breadcrumb, persisted per bucket as `folderView: 'rows' | 'columns'`, also in the settings panel under Structure → Folders.

## 2 · `ContentRow` default — thumb ratio not applied (defect)
BOX declares `ratio: '1 / 1'` for default but the render uses a `thumbSquare` flag default doesn't set, and the `ratio` prop is accepted then ignored — so a portrait `<img>` stretches the row to the image's intrinsic height (seen on the vault's `lobby/*.jpg` phone screenshots). Consumer pins `style={{ width: 48, height: 48, objectFit: 'cover' }}` on the `<img>` until fixed. Also: the frame's fit rules target a DIRECT `<img>`/`<video>` child only — a consumer wrapper `<div>` gets no constraint; document or widen.

## 3 · `ContentCard` default — no border (ruling)
"I don't like the border, I feel like I've said that before" — same ruling as ListingCardThumbBorder 2026-08-27. Consumer override: `.kol-card { border-color: transparent; }`. The selected state reads from the checked `ToggleCheckbox variant="media"`; the `fg-64` selected border is not needed. `card-border-to-remove.png`.

## 4 · `FullscreenOverlay` / lightbox rulings
- **Flat scrim**: consumer sets `.kol-overlay { background: var(--kol-surface-primary) }` — the 55 % black wash read as a halo ("shadow") around the image. Ruling: no wash.
- Click-away: works once the consumer's sheet content has no padding around the image (any click outside the image must land on the backdrop).
- Caption: name · size · **W × H px** · the DS `ActionButton` download glyph (not a text link).
- Quick-look browsing: the overlay receives the column's file list + index, prev/next wrap.

## 5 · Layout-stability rulings (ContentFilters consumer)
- Toggling SELECT must move nothing: the below-divider row is a fixed **32px** (bar `h-8`, sort group wrapped `h-8`); the selection bar is `display:none` when off (so filter groups sit left) and the sort group holds the row height.
- The card plate keeps a **two-glyph** actions column in both states: copy + a reserved invisible slot off select, rename + delete on select.
- Card/row **title is the file basename** even in Flat mode (path stays in `displayKey` for identity).

## 6 · Source, verbatim

### `src/ColumnBrowser.jsx`
```jsx
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@kolkrabbi/kol-icons';
import { formatSize, isImageType as isImage } from '@kolkrabbi/kol-media-client';
import { publicUrl } from './lib/api';
import { partition, kindOf, KIND_LABEL } from './lib/media';

/* Finder-style Miller columns over the bucket's key space. One column per
 * path segment of `prefix`: column 0 is the root level, column k the contents
 * of the k-th folder on the path. Picking a folder sets the prefix to it (and
 * so truncates deeper columns); picking a file highlights it and opens a
 * PREVIEW column on the right — the image and its facts, as Finder does.
 *
 * Keyboard, Finder's: ↑/↓ move within the column (a folder opens its column as
 * you land on it, a file previews), → steps into the open folder's column,
 * ← steps back to the parent column.
 * Built here first (user ruling 2026-08-27), ships to the DS as ColumnBrowser. */

const COL_ICON = { image: 'image', video: 'video', audio: 'audio' };

function Row({ icon, label, active, cursor = false, trailing, onClick, muted = false }) {
  return (
    <li
      /* Row metrics are the DS Table's (kol-components-organisms.css .kol-table-cell-*):
       * 12px 16px padding, mono 12, an oq-08 hairline between rows, none after the last. */
      /* `cursor` = the keyboard row, drawn with the hover fill so ↑/↓ always shows where you are. */
      className={`flex items-center gap-2 px-4 py-3 border-b last:border-b-0 cursor-pointer transition-colors ${
        active || cursor ? 'bg-fg-04 text-fg-default' : muted ? 'text-fg-48 hover:bg-fg-04' : 'text-fg-default hover:bg-fg-04'
      }`}
      style={{ borderColor: 'var(--kol-oq-08)' }}
      onClick={onClick}
    >
      <span className="w-5 shrink-0 flex items-center justify-center text-fg-48">
        <Icon name={icon} size={14} />
      </span>
      <span className="kol-mono-12 flex-1 truncate">{label}</span>
      {trailing}
    </li>
  );
}

function Preview({ o }) {
  // Pixel size comes from the loaded image itself — the bucket stores none.
  const [dims, setDims] = useState(null);
  const facts = [
    ['Kind', KIND_LABEL[kindOf(o)] || 'file'],
    ['Type', o.contentType || '—'],
    ['Size', formatSize(o.size)],
    ...(isImage(o.contentType) ? [['Dimensions', dims ? `${dims.w} × ${dims.h} px` : '…']] : []),
    ['Date', o.uploaded ? new Date(o.uploaded).toISOString().slice(0, 10) : '—'],
  ];
  return (
    <div className="w-[320px] shrink-0 overflow-y-auto p-4 flex flex-col gap-4">
      <div className="w-full aspect-square bg-fg-04 rounded flex items-center justify-center overflow-hidden">
        {isImage(o.contentType) ? (
          <img
            src={publicUrl(o.key)}
            alt=""
            className="max-w-full max-h-full object-contain"
            loading="lazy"
            onLoad={(e) => setDims({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
          />
        ) : (
          <span className="kol-mono-12 text-fg-48">{KIND_LABEL[kindOf(o)] || 'file'}</span>
        )}
      </div>
      <p className="kol-mono-12 text-fg-default break-all">{o.displayKey}</p>
      <dl className="flex flex-col gap-1">
        {facts.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 kol-mono-12">
            <dt className="text-fg-48">{k}</dt>
            <dd className="text-fg-default text-right break-all">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ColumnBrowser({ objects, prefix, onPrefix, quickLook, onQuickLook }) {
  const [picked, setPicked] = useState(null);
  // Keyboard cursor: which column, which row. Clicks keep it in sync.
  const [cursor, setCursor] = useState({ col: 0, idx: 0 });
  const rootRef = useRef(null);

  const levelsOf = (pfx) => {
    const out = [''];
    if (pfx) {
      const segs = pfx.replace(/\/$/, '').split('/');
      segs.forEach((_, i) => out.push(segs.slice(0, i + 1).join('/') + '/'));
    }
    return out;
  };
  const itemsAt = (level) => {
    const { folders, files } = partition(objects.filter((o) => o.key.startsWith(level)), level);
    return [...folders.map((f) => ({ type: 'folder', name: f })), ...files.map((o) => ({ type: 'file', o }))];
  };
  const land = (level, item) => {
    if (!item) return;
    if (item.type === 'folder') { setPicked(null); onPrefix(level + item.name); }
    else setPicked(item.o);
  };

  const onKeyDown = (e) => {
    // Space = Quick Look over the picked column's files, starting at the picked one.
    if (e.key === ' ' && picked) {
      e.preventDefault();
      const siblings = itemsAt(levelsOf(prefix)[cursor.col] ?? '').filter((it) => it.type === 'file').map((it) => it.o);
      onQuickLook?.({ files: siblings, index: Math.max(0, siblings.findIndex((o) => o.key === picked.key)) });
      return;
    }
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    const lv = levelsOf(prefix);
    const col = Math.min(cursor.col, lv.length - 1);
    const items = itemsAt(lv[col]);
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const idx = Math.max(0, Math.min(items.length - 1, cursor.idx + (e.key === 'ArrowDown' ? 1 : -1)));
      setCursor({ col, idx });
      land(lv[col], items[idx]);
    } else if (e.key === 'ArrowRight') {
      // Into the open folder's column, first row.
      if (lv[col + 1]) {
        const next = itemsAt(lv[col + 1]);
        setCursor({ col: col + 1, idx: 0 });
        land(lv[col + 1], next[0]);
      }
    } else if (col > 0) {
      // Back to the parent column, on the folder we came out of.
      const parentItems = itemsAt(lv[col - 1]);
      const opened = lv[col].slice(lv[col - 1].length);
      const idx = Math.max(0, parentItems.findIndex((it) => it.type === 'folder' && it.name === opened));
      setCursor({ col: col - 1, idx });
      setPicked(null);
      onPrefix(lv[col]);
    }
  };
  // While Quick Look is open the overlay holds focus, so the same keys are read
  // off window: ↑/↓ step the picked file (overlay follows), space closes. The
  // opening keystroke bubbles from this component and is ignored.
  useEffect(() => {
    if (!quickLook) return;
    const onKey = (e) => {
      if (rootRef.current?.contains(e.target)) return;
      if (e.key === ' ') { e.preventDefault(); onQuickLook(null); return; }
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault();
      const lv = levelsOf(prefix);
      const col = Math.min(cursor.col, lv.length - 1);
      const items = itemsAt(lv[col]);
      let idx = cursor.idx;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      do { idx += step; } while (items[idx] && items[idx].type !== 'file');
      if (!items[idx]) return;
      setCursor({ col, idx });
      setPicked(items[idx].o);
      const siblings = items.filter((it) => it.type === 'file').map((it) => it.o);
      onQuickLook({ files: siblings, index: siblings.findIndex((o) => o.key === items[idx].o.key) });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const levels = levelsOf(prefix); // '' → ['']; 'a/b/' → ['', 'a/', 'a/b/']
  // While Quick Look is open the overlay's index is the truth for the highlight.
  const shown = quickLook ? quickLook.files[quickLook.index] : picked;

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      // Fixed height — 12 rows of 44px (user ruling 2026-08-27), so the browser never jumps as columns change; each column scrolls.
      className="flex overflow-x-auto h-[528px] border rounded outline-none"
      style={{ borderColor: 'var(--kol-oq-08)' }}
    >
      {levels.map((level, k) => {
        const { folders, files } = partition(objects.filter((o) => o.key.startsWith(level)), level);
        const next = levels[k + 1];
        const activeFolder = next ? next.slice(level.length) : null;
        return (
          <ul
            key={level || '/'}
            className="w-[260px] shrink-0 overflow-y-auto border-r last:border-r-0"
            style={{ borderColor: 'var(--kol-oq-08)' }}
          >
            {folders.map((f, i) => (
              <Row
                key={f}
                icon="folder"
                label={f.replace(/\/$/, '')}
                active={f === activeFolder}
                cursor={cursor.col === k && cursor.idx === i}
                trailing={<Icon name="chevron-right" size={12} className="text-fg-32" />}
                onClick={() => { setCursor({ col: k, idx: i }); rootRef.current?.focus(); setPicked(null); onPrefix(level + f); }}
              />
            ))}
            {files.map((o, i) => (
              <Row
                key={o.key}
                icon={COL_ICON[kindOf(o)] || 'file'}
                label={o.displayKey}
                muted={shown?.key !== o.key}
                active={shown?.key === o.key}
                cursor={cursor.col === k && cursor.idx === folders.length + i}
                onClick={() => { setCursor({ col: k, idx: folders.length + i }); rootRef.current?.focus(); setPicked(o); }}
              />
            ))}
            {folders.length === 0 && files.length === 0 && (
              <li className="kol-mono-12 text-fg-32 px-4 py-3">empty</li>
            )}
          </ul>
        );
      })}
      {shown && <Preview key={shown.key} o={shown} />}
    </div>
  );
}
```

### `src/index.css` — local overrides to absorb
```css
/* Lightbox scrim: flat, no wash around the image (user 2026-08-27). Local until
   the DS overlay takes it as a token. */
.kol-overlay { background: var(--kol-surface-primary); }

/* No card border (user 2026-08-27 — "I hate border", same ruling as ListingCardThumbBorder).
   The selected state reads from the checked ToggleCheckbox. Local until the DS default variant drops it. */
.kol-card { border-color: transparent; }
```

### `src/FileList.jsx` — the wiring (folder-view toggle, quick look, row thumb pin, reserved glyph)
```jsx
// The FOLDER view — rows (the list above the files) or Finder-style columns.
// ponytail: 'layout' stands in until the icon set ships a `columns` glyph.
const FOLDER_VIEW_OPTIONS = [
  { value: 'rows', label: 'Rows', icon: 'view-list' },
  { value: 'columns', label: 'Columns', icon: 'layout' },
];

170:  const { flat, layout, sortBy, sortDir, pageSize, folderView = 'rows' } = settings;
495:      <ViewToggle viewMode={folderView} onViewChange={(v) => onSettings({ ...settings, folderView: v })} variant="icon" options={FOLDER_VIEW_OPTIONS} />
540:      {folderView === 'columns' ? (

  const renderThumb = (o, onClick, row = false) => {
    const isMedia = isImage(o.contentType) || isVideo(o.contentType);
    // Sibling <name>.png next to a video — lets the poster render without the
    // browser range-requesting the video itself to find a frame.
    const poster = (isVideo(o.contentType) || kindOf(o) === 'playlist') ? posterFor(o.key, keySet) : null;
    const vp = settings.videoPreview;
    // A bare <img> as the media node — ContentMedia's fit rules target a direct
    // <img>/<video> child; wrapped in a div the frame fell back to the image's
    // intrinsic size and a portrait thumb stretched the row.
    const imgSrc = isImage(o.contentType) ? publicUrl(o.key) : poster && vp !== 'none' ? publicUrl(poster) : null;
    if (imgSrc) {
      return (
        <img
          src={imgSrc}
          alt=""
          loading="lazy"
          className={onClick ? 'cursor-zoom-in' : undefined}
          // ContentRow default declares a 1/1 thumb but never applies it (DS defect,
          // filed 2026-08-27) — pin the 48px square here until it ships.
          style={row ? { width: 48, height: 48, objectFit: 'cover' } : undefined}
          onClick={onClick || undefined}
        />
      );
    }
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-fg-04 overflow-hidden${isMedia && onClick ? ' cursor-zoom-in' : ''}`}
        onClick={isMedia && onClick ? onClick : undefined}
      >
        {isVideo(o.contentType) && vp === 'autoload' ? (
          <video src={publicUrl(o.key)} className="w-full h-full object-cover" muted preload="metadata" />
        ) : isVideo(o.contentType) ? (
          // 'poster' with no sibling image, or 'none' — either way the card must
          // not touch the file. Vault video is 46 files / 20.4 GB.
          <span className="kol-mono-12 text-fg-48">video</span>
        ) : (
          <span className="kol-mono-12 text-fg-48">
            {KIND_LABEL[kindOf(o)] || 'file'}
            {o.segmentCount ? ` ${o.segmentCount}` : ''}
          </span>
        )}
      </div>
    );
  };

  const renderActions = (o, row = false) => {
    const isEditing = editingKey === o.key;
    if (isEditing) {
      return (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={commitRename} disabled={renaming}>{renaming ? 'Saving…' : 'Save'}</Button>
          <Button variant="ghost" size="sm" onClick={cancelRename} disabled={renaming}>Cancel</Button>
        </div>
      );
    }
    return (
      <div className={row ? 'flex translate-y-[2px] items-center gap-2' : 'flex h-full flex-col items-center justify-between'}>
        {!selectMode && (
          <>
            <ActionButton chrome="inline" size="sm" icon="copy" confirmIcon="check" label="Copy URL" confirmLabel="Copied" onAction={() => handleCopy(o.key)} />
            {/* Reserved slot: keeps the plate the same height as the two-glyph select state. */}
            {bucket.writable && !row && <span className="invisible" aria-hidden><ActionButton chrome="inline" size="sm" icon="trash" label="" /></span>}
          </>
        )}
        {bucket.writable && selectMode && (
          <>
            <ActionButton chrome="inline" size="sm" icon="edit" label="Rename" onAction={() => startRename(o.key)} />
            <ActionButton chrome="inline" size="sm" icon="trash" confirmIcon="check" label="Delete" confirmLabel="Deleted" onAction={() => handleDelete(o.key)} />
          </>
        )}
      </div>
    );
  };

      {folderView === 'columns' ? (
        <ColumnBrowser
          objects={objects.filter((o) => !isSystemFile(o.key))}
          prefix={prefix}
          onPrefix={onPrefix}
          quickLook={quickLook}
          onQuickLook={setQuickLook}
        />
      ) : folders.length > 0 && (
        <ul className="flex flex-col">
          {folders.map((f) => (
            <FolderRow key={f} name={f} onClick={() => onPrefix(prefix + f)} struck={flat} />
          ))}
        </ul>
      )}

      {quickLook && (
        <MediaLightbox
          files={quickLook.files}
          index={quickLook.index}
          onClose={() => setQuickLook(null)}
          onPrev={() => setQuickLook((q) => ({ ...q, index: (q.index - 1 + q.files.length) % q.files.length }))}
          onNext={() => setQuickLook((q) => ({ ...q, index: (q.index + 1) % q.files.length }))}
        />
      )}
```

## Recreation notes
- Tier: `ColumnBrowser` **organism** (its `Row` and `Preview` may become molecules); `columns` **icon** in kol-icons; the `ContentRow` ratio fix; `ContentCard` default border off; `FullscreenOverlay` flat scrim as the default (or a `scrim` prop).
- Publish; the consumer then swaps `src/ColumnBrowser.jsx` for the DS organism, drops the three `index.css` overrides, drops the `<img>` size pin and the `layout` stand-in icon. Nothing else may need to change.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.96.0 · kol-theme 0.65.0 · kol-icons 0.19.0

ColumnBrowser shipped verbatim as a kol-component organism — the app bits are seams with defaults (urlOf, kindOf, kindLabel, formatSize, partition; displayKey falls back to the key under the level). Rendered: 528 tall, one column per segment, a file click opens the 320px preview with Kind · Type · Size · Dimensions · Date, → opens the folder's column. kol-icons 0.19.0 ships the columns glyph. ContentCard default carries no border (selected reads from the checkbox). ContentMedia's fit rules reach a consumer wrapper div. .kol-overlay is a flat surface-primary scrim. The row-thumb defect (§2) shipped in 0.94.0 / theme 0.63.0 — every row thumb is a fixed square. §5 (32px below row, reserved glyph, basename title) is consumer wiring and stays yours.

**Remainder here:** none — kol-r2b2 bump kol-icons 0.19.0 + kol-theme 0.65.0 + kol-component 0.96.0; swap src/ColumnBrowser.jsx for the DS organism passing urlOf={(o) => publicUrl(o.key)} kindOf={kindOf} kindLabel={KIND_LABEL} formatSize={formatSize} partition={partition}; drop the .kol-overlay and .kol-card overrides, the <img> size pin, and the layout stand-in (icon: 'columns').


# FileRailImages

**Staged:** 2026-10-24 · from a kol-monitor session
**Change:** the File Rail's images: a Files section (the images attached to a file, quicklook, remove, upload), the cover picked from them, and the pencil in the foot row

---

## The problem, in one case
Monitor's Library opens the `app` card's File Rail (`AppItemMenuProvider`). In edit mode its Cover row is one button, **Upload image**, that hands a data URL to `onCover(src)` — and that is the whole of a file's images. Monitor's patch now has TWO images worth keeping (the output frame and the rack screenshot, `AppCardBackCover`), the user wants to see them, open them, remove one, add one, and say which is the card's cover. The user (2026-10-24): *"it should show images associated with file … literally the files that you could click and view with quicklook (like media) and you can remove them and upload new … file should be able to hold more files then just for thumbnails. You would rather click/select which file or files go to thumbnail."*

And the pencil sits alone on the header line while every other verb (download · duplicate · delete) is in the foot row: *"the edit icon should move to the bottom row next to download duplicate and trash icons"*.

## The fix
1. **A Files section in the File Rail** (read AND edit mode): the file's images as thumbnails (`images: [{ id, src, label? }]` on the item, through `toCard` / HubHome file data). Click = quicklook, the `MediaInspector` apps/media uses. Edit mode adds remove (×) per image and an Upload tile (the DS picker, as today) — `onImages(next)` or `onImageAdd(src)` / `onImageRemove(id)`, your call.
2. **The cover is picked, not uploaded**: a mark on the thumbnail that is the cover (`cover: id`), click another to make it the cover → `onCover(id)`. With `AppCardBackCover` in the tree, the same pick names the `back` (`onBack(id)`). "Upload image" as the only cover path goes.
3. **The pencil moves to the foot row**, beside download · duplicate · delete; the header keeps only the ×.
4. Storage is the consumer's: monitor keeps the images in the browser when signed out and in its database when signed in — nothing for the DS to hold.

## Rejected alternative
Keeping Upload image and adding a second "Upload back" button — two buttons, still no way to see, open or remove what was uploaded.

## Definition of done
- [ ] Files section with thumbnails, quicklook, remove and upload in edit mode; `images` absent = section absent, today's Rail
- [ ] cover (and back) picked from the images; `onCover` / `onBack` receive the pick
- [ ] pencil in the foot row with the other verbs
- [ ] Published; kol-monitor's receipt names the version

## 🟠 ADDRESSED — 2026-10-24 · built, unpublished

- **Files section** in the File Rail (`AppItemMenuProvider`), between the fields and Details, for an item with `images`
  `[{ id, src, label? }]` (on the card, on `toCard`, on a Hub file — `HubHome` maps it): square thumbnails two across, a
  click opens them in `MediaInspector` (apps/media's quicklook, portalled to the body — the rail's slide-in transform had
  made it the overlay's containing block). Edit mode: × per image and an Upload tile (the DS picker), both writing
  **`onImages(next)`** — the whole list, the rail naming a new image's id. Chosen over add/remove by id because the rail's
  item is a snapshot: a consumer's remove handler closed over a stale file and cleared the wrong field in the walk.
- **The cover is picked**: Cover and Back on each caption in edit mode (`onCover(src)` · `onBack(src)`, the picked
  image's src — one argument type, the one `onCover` always took; `null` when the image that was it is removed), the
  marks reading the card's own `media` and `back`. With `images` the Cover row's Upload image goes; without, the rail is as
  it was. Storage stays the consumer's.
- **The pencil leads the foot row** beside download · duplicate · delete; the header keeps only the ×.
- Twins: `apps/rack-hub` patches carry Output + Rack, modules their front; `apps/studio-hub` files carry their cover (the
  no-cover file holds `[]`). The twin's `/previews/patches` were still the old rack screenshots (3528 wide) — swapped for the
  ticket's output frames (368 × 652), the old set in `_tmp/2026-10-24-app-card-back-cover/old-patch-previews/`.
- Walk `_tmp/2026-10-24-file-rail-images/walk.mjs`: 21/21 — read marks, quicklook on top and Escape, edit tile · × · picks,
  Back pick → the card's back, Cover pick → the card's front, remove → one left and the other 41 cards untouched, Home's
  save shows its two, console clean. props · syntax clean. Docs: `06-content-card-system.md`, `16-app-anatomy.md`,
  `06-studio-adoption.md`, `ContentCard.mdx`; Unreleased lines in kol-component · kol-shell.
- **Closes on:** the publish; the receipt names the version.

## 🟢 CLOSED — 2026-10-24 · kol-component 0.299.0 · kol-shell 0.79.0 live

Registry live (checked once after the PUT). Receipt returned to kol-monitor's outbox — its remainder: bump, `images` + `onImages` on `shipped.jsx` `card` and Home's file data, `onCover` / `onBack` take a src, `setThumb` becomes the pick.

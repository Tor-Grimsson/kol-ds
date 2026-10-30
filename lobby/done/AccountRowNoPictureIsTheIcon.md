---
component: AccountRowNoPictureIsTheIcon
source: kol-fxr, live on kol-shell 0.87.0
staged: 2026-10-29
status: draft
---

# AccountRowNoPictureIsTheIcon

**Raised:** user, 2026-10-29, on fxr's rail (the account row signed in, no picture): *"gross icon why are you introducing a new icon style? if no image then just use outline"*.

## Seen
`HubAccountRow` (kol-shell 0.85.0+): signed in, the rail row draws `Avatar size="xs"` — with no `avatar`, a filled disc with the initial (`T`). Every other rail row is a 24-box outline glyph (image, sliders …), so the disc reads as a foreign icon set.

## The ask
- `signIn.user.avatar` set → the picture (round, the row's icon size).
- No avatar → the outline `user` glyph from kol-icons, drawn exactly like the other rows; no initial, no fill.

## Done when
fxr's rail, signed in with no picture: the account row is the outline `user` icon; with a picture, the picture.


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-shell 0.87.2**. When signed in, the account row draws the picture if `user.avatar` is set. With no picture it draws the rail's own outline `user` glyph at 20px, drawn by the same icon component as the image and sliders rows; there's no initial and no fill. Walked on studio-hub, signed in with no picture: the rail's foot reads image, user, sliders, all outline.

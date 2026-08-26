/**
 * AudioPlayer — the interactive audio atom: one native <audio> with the UA's
 * own control strip, and an optional label line above it.
 *
 * WHY IT EXISTS. Audio was the one media kind the design system had nothing for,
 * so every consumer hand-rolled a bare `<audio controls>` and inherited whatever
 * the browser painted. The MediaLibrary widening (kol-component 0.39.0) made
 * audio objects arrive — 116 sound files in `kol-vault-media` alone — and left
 * minting this as the open taxonomy call; this is that call made: an ATOM,
 * beside HlsVideo.
 *
 * THE CONTRAST WITH HlsVideo, which is the thing to read before touching either.
 * Same tier, same shape — one native media element, all layout via `className`,
 * no composition — and **inverted intent**. HlsVideo is deliberately inert:
 * `pointer-events: none`, `controls={false}`, plus the hardening set (no PiP, no
 * download, no fullscreen, no remote playback, no context menu). It is
 * decorative. This atom exists **to be operated**, so none of that hardening
 * crosses over, and `controls` is not a prop — an audio player without controls
 * is not a variant, it is a different component.
 *
 * The native strip is UA-painted and not themeable past `color-scheme`. Do not
 * reach for pseudo-element hacks; a branded transport would be a separate
 * `AudioTransport` molecule built on this atom.
 *
 * Layout is the call site's: the padding, the centring and the width that lived
 * in the consumer source are all call-site concerns and none of them are baked
 * in here.
 *
 * @param {string} src        audio URL; renders nothing when absent (the guard
 *                            style the other media atoms use)
 * @param {string} [label]    line above the player; the element is omitted entirely
 *                            when absent. Authored casing — no text-transform
 * @param {'none'|'metadata'|'auto'} [preload='metadata']  native preload hint
 * @param {string} [className] all layout/sizing (consumer-supplied)
 */
export default function AudioPlayer({
  src,
  label,
  preload = 'metadata',
  className = '',
  ...props
}) {
  if (!src) return null

  return (
    <figure className={`kol-audio-player flex flex-col gap-3 ${className}`.trim()}>
      {label && <figcaption className="kol-mono-12 text-fg-48">{label}</figcaption>}
      <audio src={src} preload={preload} controls className="w-full" {...props} />
    </figure>
  )
}

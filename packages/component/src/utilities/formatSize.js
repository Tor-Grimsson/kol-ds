/**
 * formatSize — bytes → the weight a file reads as in the media admin
 * (`1.2 MB`). Lived inside MediaLibraryPages; exported since 0.178.0
 * (slide-variant-and-shelf-preset, 2026-09-03) because kol-shell's shelf preset
 * and olina's deck page were restating it byte for byte. Duplicated from the
 * media client on purpose (§3: the UI never imports the client).
 */
export default function formatSize(bytes) {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

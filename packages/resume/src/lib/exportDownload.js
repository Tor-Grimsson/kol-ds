import { useState } from 'react'

/**
 * One download path for every export button. Hits the dev-only /api/export
 * endpoint (vite.config.js → scripts/export-kit.sh), then hands the blob to
 * the browser as a named file. Each export takes ~30–45s (build + headless
 * render), so callers read `busy` to show progress; `busy` holds whatever key
 * the caller passed so a page with several buttons knows which one is running.
 *
 * The <a download> must be IN the DOM — a detached one gets treated as a
 * navigation, which opens the file instead of downloading it.
 */
export function useExportDownload() {
  const [busy, setBusy] = useState(null)
  const [err, setErr] = useState(null)

  const download = async (key, url, filename) => {
    setBusy(key)
    setErr(null)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error((await res.text()).slice(0, 300))
      const blob = await res.blob()
      const href = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = href
      a.download = filename
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(href), 10000)
    } catch (e) {
      setErr(String(e.message || e))
    } finally {
      setBusy(null)
    }
  }

  return { busy, err, download }
}

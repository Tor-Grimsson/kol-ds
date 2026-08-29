import { SizeOrDownload } from '@kolkrabbi/kol-component'

/* the card's `size` slot: the size at rest, a download link on hover — `href`
 * is the download (the demo's is a data URI) */
export default function SizeOrDownloadDemo() {
  return (
    <div className="flex items-center gap-8">
      <SizeOrDownload href="data:text/plain,kol">2.4 MB</SizeOrDownload>
      <SizeOrDownload>48 MB</SizeOrDownload>
    </div>
  )
}

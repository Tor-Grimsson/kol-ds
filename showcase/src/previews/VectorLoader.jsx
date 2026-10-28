import { VectorLoader } from '@kolkrabbi/kol-component'
import wordmark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-wordmark.svg?url'

/* any SVG by URL, inlined in currentColor — here the brand's wordmark straight from the identity set's path export */
export default function VectorLoaderPreview() {
  return (
    <div className="flex items-center gap-6">
      <VectorLoader src="/svg/logo.svg" size={20} />
      <VectorLoader src="/svg/logo.svg" size={32} />
      <VectorLoader src="/svg/logo.svg" size={48} />
      <VectorLoader src={wordmark} size={48} className="w-auto" />
    </div>
  )
}

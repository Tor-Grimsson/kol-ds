import { ExitPreview } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/**
 * ExitPreview is a router-aware escape hatch (react-router Link to "/") worn
 * as CMS draft-mode chrome. It takes no props — the .kol-exit-preview classes
 * carry the whole look. Clicking it here really navigates to the showcase root.
 */
export default function ExitPreviewDemo() {
  return (
    <div className="flex flex-col items-start gap-2">
      <ExitPreview />
      <span className="kol-helper-12 text-fg-48">
        Propless — clicking it navigates to the site root.
      </span>
    </div>
  )
}

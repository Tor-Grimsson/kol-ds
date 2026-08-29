import { KindPreview } from '@kolkrabbi/kol-component'

export const stage = 'lg'

const MD = `---
title: Field notes
type: reference
status: active
created: 2026-08-01
updated: 2026-08-27
tags: [domain/components, pattern/media]
description: The row is the unit; the column is the path
---

# Field notes

The **row** is the unit; the *column* is the path.

- one
- two

\`\`\`js
const x = 1
\`\`\`
`
const YAML = 'title: kol\nkinds:\n  - image\n  - video\n  - audio\n'
const FILES = [
  { key: 'labs/README.md', contentType: 'text/markdown', url: 'data:text/markdown,' + encodeURIComponent(MD) },
  { key: 'labs/manifest.yaml', contentType: 'text/yaml', url: 'data:text/yaml,' + encodeURIComponent(YAML) },
]

/* every document on ONE plate: KindPreview renders markdown (with its
 * frontmatter block above the prose) and YAML on DocPage — the base plate here;
 * the overlay's A-series page and the column's zoomed frame are the theme's */
export default function DocPageDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      {FILES.map((o) => <KindPreview key={o.key} o={o} />)}
    </div>
  )
}

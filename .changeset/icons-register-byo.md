---
"@kolkrabbi/kol-icons": minor
---

Add `registerIcons()` — bring-your-own-icons. A consumer app can register its own SVG folder so `<Icon name>` resolves app-specific icons that never ship in the package:

```js
import { registerIcons } from '@kolkrabbi/kol-icons'
registerIcons(import.meta.glob('./icons/**/*.svg', { eager: true, query: '?raw', import: 'default' }))
```

Registered icons win over the packaged set (so a repo can add *or* override), resolve synchronously (no wait on the packaged chunk), and let each repo carry only the icons it needs instead of pulling the whole set. `import.meta.glob` is a compile-time, path-relative macro, so the glob must run in the consumer's own source. Non-breaking: the packaged set is unchanged when nothing is registered.

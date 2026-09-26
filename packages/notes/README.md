# @kolkrabbi/kol-notes

Notes as a tool: a note is a database row with a markdown body. The list, the editor (kol-component's `DocumentEditor`, in the page) and the whole tool over a client you inject.

```jsx
import { Notes } from '@kolkrabbi/kol-notes'

<Notes client={client} assets={assets} />   // client: listNotes · loadNote · saveNote · deleteNote
```

Needs `ModalProvider` (kol-component) above it. Consumer contract as every KOL package: Vite + Tailwind v4, `@source` the package's `src`. Live: `apps/notes` in kol-ds-ui.

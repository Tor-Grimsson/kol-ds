# @kolkrabbi/kol-deck

Presentations as a tool: slides as data (a 1920×1080 stage of text, image and rule layers), the editor, present mode, and PNG · PDF · PPTX · `.deck.json` export.

```jsx
import { Decks } from '@kolkrabbi/kol-deck'

<Decks client={client} layouts={layouts} mediaClient={mediaClient} onUpload={onUpload} />
// client: listDecks · loadDeck · saveDeck · deleteDeck — layouts: [{ slug, name, doc }]
```

`@kolkrabbi/kol-deck/model` is the pure model (no React). Needs `ModalProvider` (kol-component) above it. Consumer contract as every KOL package: Vite + Tailwind v4, `@source` the package's `src`. Live: `apps/presentation` in kol-ds-ui.

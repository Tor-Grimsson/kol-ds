# @kolkrabbi/kol-component

The KOL design-system component library — atoms through organisms. Components emit canonical `kol-*` classes; their styling lives in [`@kolkrabbi/kol-theme`](https://www.npmjs.com/package/@kolkrabbi/kol-theme).

## Install

```sh
npm i @kolkrabbi/kol-component @kolkrabbi/kol-theme
# react, react-dom are peers; react-router-dom is an optional peer (some components)
```

Requires a **Vite + Tailwind v4** app and the theme CSS imported (see the theme package).

## Tailwind v4 consumers

Tailwind skips `node_modules` when scanning, so point it at this package's source — otherwise the utility classes inside the components never generate and layouts collapse:

```css
@source "../node_modules/@kolkrabbi/kol-component/src";
```

## Use

```jsx
import { Button, Tag, Badge, Slider, Dropdown, Table } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

<Button variant="primary" iconLeft="plus">New</Button>
<Badge variant="success">Active</Badge>
```

Atoms (Button, Input, Slider, Toggle\*, …), molecules (Dropdown, Tag, Badge, Modal, Popover, …), primitives (Accordion, Carousel, CodeBlock, Image, …), an organism (Table), graphics, and hooks (`useReveal`, `useScrollSpy`). See the [usage reference](https://github.com/Tor-Grimsson/kol-ds/tree/main/docs/usage) for real examples of each.

### Deep imports — skip the barrel, skip the peers

The barrel (`import { Button } from '@kolkrabbi/kol-component'`) statically imports the whole tree, so building against it requires every organism peer (`framer-motion`, `gsap`, `hls.js`) even if you render none of them — module resolution happens before tree-shaking. Consumers that want a slice import the file directly and only its own chain resolves:

```jsx
import Button from '@kolkrabbi/kol-component/atoms/Button'
import Modal from '@kolkrabbi/kol-component/molecules/Modal'
import useReveal from '@kolkrabbi/kol-component/hooks/useReveal'
```

Subpaths: `./atoms/*`, `./molecules/*`, `./organisms/*`, `./utilities/*` (`.jsx`) and `./hooks/*` (`.js`). Most files default-export their component; multi-part families (`Modal`, `MenuItem`, `Accordion`) export named — mirror whatever the barrel re-exports. The barrel stays for showcase-style consumers that want everything.

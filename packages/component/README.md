# @kolkrabbi/kol-component

The KOL design-system component library — atoms through organisms. Components emit canonical `kol-*` classes; their styling lives in [`@kolkrabbi/kol-theme`](https://www.npmjs.com/package/@kolkrabbi/kol-theme).

## Install

```sh
npm i @kolkrabbi/kol-component @kolkrabbi/kol-theme
# react, react-dom are peers; react-router-dom is an optional peer (some components)
```

Requires a **Vite + Tailwind v4** app and the theme CSS imported (see the theme package).

## Use

```jsx
import { Button, Tag, Badge, Slider, Dropdown, Table } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-loader'

<Button variant="primary" iconLeft="plus">New</Button>
<Badge variant="success">Active</Badge>
```

Atoms (Button, Input, Slider, Toggle\*, …), molecules (Dropdown, Tag, Badge, Modal, Popover, …), primitives (Accordion, Carousel, CodeBlock, Image, …), an organism (Table), graphics, and hooks (`useReveal`, `useScrollSpy`). See the [usage reference](https://github.com/Tor-Grimsson/kol-ds/tree/main/docs/usage) for real examples of each.

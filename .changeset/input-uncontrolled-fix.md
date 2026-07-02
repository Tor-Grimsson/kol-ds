---
"@kolkrabbi/kol-component": patch
---

`Input` is now controlled only when a `value` prop is passed. Previously every Input rendered controlled with `value ?? ''` — a prop-less usage (e.g. a search stub) froze on typing and fired React's value-without-onChange warning. Prop-less Inputs are now uncontrolled; controlled Inputs without an `onChange` render `readOnly` (deliberate display-only). Also fixes `Button` icon alignment: `iconLeft`/`iconRight` glyphs now render directly as flex items — the old wrapper spans (with -2px optical margins) sat glyphs on the span baseline instead of centering them against the label (fix ported from kol-client).

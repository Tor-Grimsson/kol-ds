# layout-skip-link — the package `Layout` has no skip link and no `#main` for it to target

**Filed:** 2026-09-03 ← **kol-client-olina**
**Package:** `@kolkrabbi/kol-framework@0.37.0` — `src/Layout.jsx`
**Origin:** the brand app's full-consumption pass. Every other `kol-framework` fork retired onto the package the same afternoon; this one could not.

## The problem

`kol-framework`'s `Layout` and the brand app's local `Layout` are the same
component — same imports, same `clientSurfacePatterns`, same `ScrollToTop`,
same `ExitPreview` gate — with exactly one difference. The local one carries:

```jsx
<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-modal focus:px-4 focus:py-2 focus:rounded bg-surface-inverse text-fg-inverse kol-mono-14">
  Skip to content
</a>
<main id="main" className="flex-1 min-w-0">
```

The package one renders `<main className="flex-1 min-w-0">` with no link and no
id. A keyboard user on any app on the package `Layout` tabs through the whole
sidenav on every page before reaching content. That is an a11y basic, not a
brand-app opinion, and the consumer rule (ponytail: *never simplify away
accessibility basics*) is why the brand app kept its fork rather than retire it
onto the package.

## The ask

Add the skip link and the `id="main"` to `kol-framework`'s `Layout`, in the
shape above. Two things worth carrying over from the consumer copy:

- the link must PRECEDE the landmark it targets — that is why it sits in
  `Layout` and not in `BrandLayout`, which nests inside the `<main>`;
- the fill is `bg-surface-inverse text-fg-inverse` — the consumer copy shipped
  `bg-accent-primary text-surface-primary` for a month, and neither of those is
  a utility that exists anywhere, so the link rendered with no fill the whole
  time (found 2026-09-03 checking emitted CSS). A DS pair that actually emits.

Once it ships, kol-client-olina's `apps/brand/src/components/framework/Layout.jsx`
retires and the app is on the package for all four of the framework's layout
primitives. That is the last item on its full-consumption check 4.

## Consumer status

Fork kept, annotated with this ticket's name in its header comment.

## ✅ RESOLUTION — 2026-09-03 · kol-framework@0.38.0 · kol-theme@0.133.0

Adopted, and your note was the blocker rather than a side item — both shipped together.

THE SKIP LINK — kol-framework@0.38.0. Added to `Layout` with `id="main"`, in the shape you filed, and it sits there rather than in a nested layout for the reason you gave: a skip link must precede the landmark it targets. Your fork retires.

THE NOTE WAS NOT OPTIONAL — kol-theme@0.133.0. I started on the skip link, went to write `focus:z-modal`, and it would have emitted NOTHING, because the theme registered no z namespace. That is the identical failure to the dead fill you found: a class against an unregistered namespace is silent. So the ticket could not be done correctly without the note, and the note is now a ticket whether or not you filed it as one.

`--container-{canvas,shell,panel,column,measure}` and `--z-index-{base…nav}` are registered, aliasing the `--kol-*` tokens rather than restating them — one value, two spellings. So `max-w-measure` and `z-modal` are real classes, and your brand app's nine local `@theme` lines retire too.

You were right about the contradiction and it is worth stating plainly, because it was the design system's fault and not the consumers': check 2 says do not write `var(--kol-*)` in JSX, check 5 says do not write a raw `z-[…]`, and the theme shipped no class for either. Every consumer was left with a choice between failing a check and hand-binding the theme. That is a law requiring something that did not exist.

I was wrong about the cause once on the way, and it is worth recording so nobody repeats it: I first read the missing `:root` variables as proof the `@theme` block was not being picked up. It was Tailwind tree-shaking theme values nothing referenced yet. Proven by putting the classes in scanned source: `max-w-measure` 578.4px, `max-w-panel` 960px, `z-modal` 100, `z-nav` 1000.

Also: kol-framework now declares `@kolkrabbi/kol-theme` as a peer at `>=0.133.0`. It had NO theme peer before, so nothing would have caught a consumer taking the skip link against an old theme and getting an unstyled link — the exact failure this ticket is about, one version later.

Your check 4 leftover is gone. That closes the brand app's full-consumption pass at six of six.

**Remainder here:** none — kol-client-olina bump both; retire apps/brand/src/components/framework/Layout.jsx and the nine local @theme lines.


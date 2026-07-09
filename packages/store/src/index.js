// @kolkrabbi/kol-store — the commerce / storefront system: the product-detail
// layout, price display, and the diagonal marquee river. Product data is
// consumer-injected. Shared form primitives (Pill, Divider, QuantityInput,
// SpecList, TabsRow, Dropdown) stay in @kolkrabbi/kol-component — this package
// depends on them.

export { default as ProductDetailLayout } from './ProductDetailLayout.jsx'
export { default as DiagonalMarqueeRiver } from './DiagonalMarqueeRiver.jsx'
export { default as PriceDisplay } from './PriceDisplay.jsx'
export { default as PrintsGrid } from './PrintsGrid.jsx'
export { default as PrintGridCard } from './PrintGridCard.jsx'
export { default as PrintGridCardGsap } from './PrintGridCardGsap.jsx'
export { default as PrintBuyButton } from './PrintBuyButton.jsx'
// The "Drift" scroll gallery is NOT re-implemented here — reuse the generic
// engine `ScrollDriftGallery` from @kolkrabbi/kol-content, composing it with a
// prints `renderCard` (e.g. PrintGridCardGsap). Kept single to avoid a second
// near-identical gsap+ScrollTrigger river. See 06-store-system doc.

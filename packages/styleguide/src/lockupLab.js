/**
 * lockupLab — the math behind LockupLab: a branded house's lockup, as PARTS and the TYPES that show them.
 *
 * From the branded-house sheets (kol-atlas `docs/documentation/05-graphics/_assets/bh-logo-system-0.svg`, Canalix —
 * BrandLabToolWindow 2026-10-29; the user: *"scale doesnt matter … its about the lockup of shapes not size. size is just
 * output and usage … much better would be text controls, font ratio, line height (as in clip to baseline), grid on off,
 * logo shape, lockup type, different sub-categories"*).
 *
 *   parts   mark (the product or company logo) · parent (the company wordmark, small, over the product) · product (the
 *           product wordmark) · sub (the sub-category, after the product) · optional (a suffix, `Ltd.`)
 *   types   the sheet's five, from everything down to the product alone
 *   sizes   relative to the product (1): the parent and the sub-category are ratios of it — size is the output's, never
 *           the lockup's
 */
export const LOCKUP_PARTS = [
  { id: 'mark', label: 'Logo' },
  { id: 'parent', label: 'Company wordmark' },
  { id: 'product', label: 'Product wordmark' },
  { id: 'sub', label: 'Sub-category' },
  { id: 'optional', label: 'Optional' },
]

/* the five lockup types on bh-logo-system-0.svg, in the sheet's order */
export const LOCKUP_TYPES = [
  { id: 'full', label: 'Full', parts: ['mark', 'parent', 'product', 'sub', 'optional'] },
  { id: 'mark-product-sub', label: 'Logo, product, sub', parts: ['mark', 'product', 'sub', 'optional'] },
  { id: 'product-sub', label: 'Product, sub', parts: ['product', 'sub', 'optional'] },
  { id: 'mark-product', label: 'Logo, product', parts: ['mark', 'product'] },
  { id: 'product', label: 'Product', parts: ['product'] },
]

export const LOCKUP_SHAPES = [
  { id: 'square', label: 'Square' },
  { id: 'rounded', label: 'Rounded square' },
  { id: 'circle', label: 'Circle' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'mark', label: "The brand's mark" },
]

export const LOCKUP_CASES = [{ id: 'none', label: 'As typed' }, { id: 'upper', label: 'Uppercase' }]

/* the sheet's part colours, for the grid (the boxes behind each part on bh-logo-system-0) */
export const LOCKUP_GRID = { mark: '#58C23B', parent: '#27B3F2', product: '#F4C51F', sub: '#F28C1E', optional: '#F06AE6' }

export const LOCKUP_SUB_PRESETS = ['Solutions', 'Services', 'Courts', 'Archives', 'Mgmt.', 'Studio', 'Labs']

/** the lab's starting value */
export const DEFAULT_LOCKUP_LAB = {
  type: 'full', shape: 'rounded',
  parent: 'Brand', product: 'Product', sub: 'Solutions', optional: '',
  parentRatio: 0.36, subRatio: 0.62, optionalRatio: 0.62,
  parentWeight: 700, productWeight: 700, subWeight: 400, optionalWeight: 400,
  parentCase: 'upper', productCase: 'none', subCase: 'none', optionalCase: 'none',
  clip: true, grid: false,
}

/** the lockup's parts as drawn at a product size of `size` px: `{ type, parts: [{ id, text, size, weight, case }] }` */
export function lockupLab(value, size = 64) {
  const v = { ...DEFAULT_LOCKUP_LAB, ...value }
  const type = LOCKUP_TYPES.find((t) => t.id === v.type) ?? LOCKUP_TYPES[0]
  const text = { parent: v.parent, product: v.product, sub: v.sub, optional: v.optional }
  const px = { parent: Math.round(size * v.parentRatio), product: size, sub: Math.round(size * v.subRatio), optional: Math.round(size * v.optionalRatio) }
  const weight = { parent: v.parentWeight, product: v.productWeight, sub: v.subWeight, optional: v.optionalWeight }
  const kase = { parent: v.parentCase, product: v.productCase, sub: v.subCase, optional: v.optionalCase }
  /* the mark spans the text it stands beside: the company and product lines when both show, else the product's cap */
  const markSize = Math.round(type.parts.includes('parent') ? size * (0.78 + v.parentRatio) : size * 0.82)
  const parts = type.parts
    .filter((p) => p === 'mark' || text[p])
    .map((p) => (p === 'mark' ? { id: p, text: '', size: markSize, weight: null, case: null } : { id: p, text: text[p], size: px[p], weight: weight[p], case: kase[p] }))
  return { ...v, type, parts }
}

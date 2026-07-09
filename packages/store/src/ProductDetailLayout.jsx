import { useState } from 'react'
import PriceDisplay from './PriceDisplay.jsx'
import { Pill } from '@kolkrabbi/kol-component'
import { Divider } from '@kolkrabbi/kol-component'
import { QuantityInput } from '@kolkrabbi/kol-component'
import { SpecList } from '@kolkrabbi/kol-component'
import { TabsRow } from '@kolkrabbi/kol-component'
import { Dropdown } from '@kolkrabbi/kol-component'

/**
 * ProductDetailLayout — the pure two-column PDP skeleton: a full-height media
 * gallery beside a scrollable details column (eyebrow + title + tags, a
 * SpecList of key facts, an underline TabsRow with its panel, then a purchase
 * block of price / size / quantity / CTA / fine print / back link).
 *
 * Presentational and commerce-agnostic — the print-store source's PayPal URL,
 * `print.*` reads, Sanity image normalization and route wiring are all dropped.
 * Data enters through props; the DS parts (PriceDisplay, SpecList, TabsRow,
 * QuantityInput, Dropdown) are composed here, everything else is a slot. Size,
 * quantity and the active tab are owned internally (uncontrolled), seeded from
 * props; pass the change callbacks to observe them.
 *
 * @param {ReactNode[]} mediaItems    gallery frames (rendered nodes, e.g. inline SVG); drives the internal big-frame + thumbnail strip
 * @param {ReactNode}   media         single media slot used when `mediaItems` is empty
 * @param {ReactNode}   eyebrow       category caption above the title (authored verbatim)
 * @param {ReactNode}   title         product name — rendered kol-heading-md (author case at the call site)
 * @param {string[]}    tags          optional Pill row
 * @param {Array<{label,value}>} specs key-facts rows → SpecList
 * @param {Array<{id,label,content}>} tabs tab strip (→ TabsRow) + panel content per tab
 * @param {{amount:number,currency?:string,locale?:string,secondary?:ReactNode}} price → PriceDisplay
 * @param {string[]}    sizeOptions   size <select> options → Dropdown (default ['A3'])
 * @param {string}      defaultSize   initially-selected size (default sizeOptions[0])
 * @param {Function}    onSizeChange  (value) => void — fires on size select
 * @param {number}      defaultQuantity initial qty (default 1)
 * @param {number}      minQuantity   qty floor (default 1)
 * @param {number}      maxQuantity   qty ceiling (default 10)
 * @param {Function}    onQuantityChange (value) => void — fires on qty step
 * @param {ReactNode}   actions       CTA slot — pass the "Add to cart" Button
 * @param {ReactNode}   shippingNote  fine-print line under the CTA
 * @param {ReactNode}   backLink      back-to-catalog link slot
 */
export default function ProductDetailLayout({
  mediaItems = [],
  media,
  eyebrow,
  title,
  tags = [],
  specs = [],
  tabs = [],
  price,
  sizeOptions = ['A3'],
  defaultSize,
  onSizeChange,
  defaultQuantity = 1,
  minQuantity = 1,
  maxQuantity = 10,
  onQuantityChange,
  actions,
  shippingNote,
  backLink,
}) {
  const [activeMedia, setActiveMedia] = useState(0)
  const [size, setSize] = useState(defaultSize ?? sizeOptions[0])
  const [quantity, setQuantity] = useState(defaultQuantity)
  const [activeTab, setActiveTab] = useState(tabs[0]?.id)

  const activeTabItem = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  const handleSize = (value) => {
    setSize(value)
    onSizeChange?.(value)
  }
  const handleQuantity = (value) => {
    setQuantity(value)
    onQuantityChange?.(value)
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-surface-primary text-auto">
      <section className="grid h-dvh w-full gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* Media column */}
        <div className="relative flex h-dvh bg-surface-secondary">
          <div className="relative flex-1 flex items-center justify-center px-8 py-24 lg:px-16 lg:py-32 overflow-hidden">
            {mediaItems.length > 0 ? (
              <div className="flex max-h-full max-w-full items-center justify-center">
                {mediaItems[activeMedia] ?? mediaItems[0]}
              </div>
            ) : (
              media
            )}

            {mediaItems.length > 1 && (
              <div className="absolute inset-x-0 bottom-0 flex gap-3 overflow-x-auto bg-surface-primary/80 px-6 py-4">
                {mediaItems.map((item, index) => {
                  const isActive = index === activeMedia
                  return (
                    <button
                      key={index}
                      type="button"
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={isActive}
                      onClick={() => setActiveMedia(index)}
                      className={`h-20 aspect-[4/5] overflow-hidden rounded border-2 transition-all ${
                        isActive
                          ? 'border-auto opacity-100'
                          : 'border-transparent opacity-40 hover:opacity-100'
                      }`}
                    >
                      <span className="flex size-full items-center justify-center overflow-hidden">
                        {item}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Details column */}
        <div className="h-dvh flex flex-col text-left px-6 pt-20 pb-8 sm:px-10 lg:px-16 lg:pt-24 lg:pb-12 bg-surface-primary overflow-y-auto">
          <div className="mx-auto flex flex-1 w-full max-w-[640px] flex-col gap-6">
            {/* Header */}
            <header className="space-y-4">
              {eyebrow != null && <p className="kol-helper-uc-xs text-accent-primary">{eyebrow}</p>}
              {title != null && <h1 className="kol-heading-md">{title}</h1>}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Pill key={tag} variant="subtle" size="sm">
                      {tag}
                    </Pill>
                  ))}
                </div>
              )}
            </header>

            {/* Specs */}
            {specs.length > 0 && <SpecList items={specs} framed />}

            {/* Tabs */}
            {tabs.length > 0 && (
              <div className="space-y-4">
                <div className="border-b border-auto">
                  <TabsRow tabs={tabs.map(({ id, label }) => ({ id, label }))} value={activeTab} onChange={setActiveTab} />
                </div>
                <div role="tabpanel" className="kol-mono-text text-fg-64 leading-relaxed space-y-4">
                  {activeTabItem?.content}
                </div>
              </div>
            )}

            {/* Purchase block */}
            <div className="mt-auto space-y-6 border-t border-auto pt-6">
              {price != null && <PriceDisplay {...price} />}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <span className="kol-helper-uc-xs text-fg-48">Size</span>
                  <Dropdown
                    options={sizeOptions.map((s) => ({ label: s, value: s }))}
                    value={size}
                    onChange={handleSize}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <span className="kol-helper-uc-xs text-fg-48">Quantity</span>
                  <QuantityInput
                    value={quantity}
                    onChange={handleQuantity}
                    min={minQuantity}
                    max={maxQuantity}
                    className="w-full"
                  />
                </div>
              </div>

              {actions}

              {shippingNote != null && <p className="kol-mono-xs text-fg-48">{shippingNote}</p>}
              {backLink}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

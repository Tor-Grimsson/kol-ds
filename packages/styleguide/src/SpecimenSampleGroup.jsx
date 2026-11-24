/**
 * SpecimenSampleGroup — A stack of SpecimenSample. The library master `SpecimenSampleGroup` (Styleguide page, Samples
 * section; type-ramp plan 6.7): one `samples` slot stacking `SpecimenSample` children, the fg-08 hairline between them
 * drawn by `.kol-type-sample + .kol-type-sample` (kol-components-foundry.css).
 *
 * @param {ReactNode} children   the `SpecimenSample`s (Figma slot `samples`)
 * @param {string}    [className]
 */
export default function SpecimenSampleGroup({ children, className = '' }) {
  return <div className={`flex flex-col ${className}`.trim()}>{children}</div>
}

import { ComboLab } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

/* Color Lab's palette, combined — the default colour value; the combo generates no colours of its own, and its mark slot
 * is a plain shape (unbranded) */
export default function ComboLabPreview() {
  return <ComboLab color={{ base: '#FFCF33', relation: 'complementary', count: 5 }} value={{ layout: 'applied-card', logo: true }} />
}

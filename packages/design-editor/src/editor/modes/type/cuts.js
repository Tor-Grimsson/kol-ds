/**
 * Type-lab constants — aspect / case + display palette. The Right Grotesk
 * width cuts, WEIGHTS, familyFor and cssFor left with the static cut system
 * (2026-11-18, variable fonts; kept in _tmp/2026-11-18-static-cuts/).
 */
import { applyCase } from '../../../data/typography-cuts'

export { applyCase }

export { ASPECTS } from '../../shell/aspects'

export const CASES = [
  { id: 'original', label: 'Aa'  },
  { id: 'upper',    label: 'AA'  },
  { id: 'lower',    label: 'aa'  },
  { id: 'sentence', label: 'Aa.' },
]

export const PALETTE = [
  { hex: '#FBF7EE', label: 'Cream 100' },
  { hex: '#F8F1E0', label: 'Cream 200' },
  { hex: '#F2E5CB', label: 'Cream 300' },
  { hex: '#F2D9A9', label: 'Cream 400' },
  { hex: '#D9B97A', label: 'Cream 500' },
  { hex: '#CC7762', label: 'Red 100' },
  { hex: '#AD5038', label: 'Red 200' },
  { hex: '#913F2B', label: 'Red 300' },
  { hex: '#662C1E', label: 'Red 400' },
  { hex: '#522418', label: 'Red 500' },
  { hex: '#FCFBFB', label: 'Grey 50' },
  { hex: '#EBEBEB', label: 'Grey 100' },
  { hex: '#DBDBDB', label: 'Grey 200' },
  { hex: '#A3A3A4', label: 'Grey 300' },
  { hex: '#5B5B5D', label: 'Grey 400' },
  { hex: '#363639', label: 'Grey 500' },
  { hex: '#2E2E30', label: 'Grey 600' },
  { hex: '#242427', label: 'Grey 700' },
  { hex: '#1B1B1E', label: 'Grey 800' },
  { hex: '#131316', label: 'Grey 900' },
]

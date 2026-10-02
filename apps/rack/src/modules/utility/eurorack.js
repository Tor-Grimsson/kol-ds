// Eurorack dimensions — kol-hardware's, plus the two the rack derives for itself.
import { HP_PX, TOTAL_HP } from '@kolkrabbi/kol-hardware'
export { HP_PX, TOTAL_HP, MIN_HP, ROW_HEIGHT, RAIL_HEIGHT, hpToPx } from '@kolkrabbi/kol-hardware'

export const ROW_WIDTH = TOTAL_HP * HP_PX  // 1664px
export const MODULE_PADDING = 12  // ~p-3

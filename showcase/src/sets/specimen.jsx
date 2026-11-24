import { useEffect, useMemo } from 'react'
import { Table } from '@kolkrabbi/kol-component'
import {
  SpecimenSheet, SpecimenFooterGroup, SpecimenNote, SpecimenDisplay, SpecimenFontCard,
  SpecimenFontSheet, SpecimenRamp, SpecimenWeights,
} from '@kolkrabbi/kol-styleguide'
import {
  INTER, SPECIAL_GOTHIC, MONO, interTracking, RAMP_TABLE_COLUMNS, rampTableRows, PARTS_COLUMNS, PARTS_ROWS, NOTE,
  loadSpecialGothic,
} from '../demo-data/specimen.js'

export const meta = {
  title: 'Specimen',
  description: 'The Specimen kit: the six sheets of the library Previews section, built from the Specimen components',
  category: 'foundry',
  featured: false,
  type: 'reference',
  status: 'active',
  updated: '2026-11-14',
  tags: ['domain/typography', 'pattern/blocks'],
}
export const stage = 'full'

const Notes = () => (
  <SpecimenFooterGroup title="Notes" showTitle={false}>
    <SpecimenNote label="NOTE 1" text={NOTE} />
    <SpecimenNote label="NOTE 2" text={NOTE} />
  </SpecimenFooterGroup>
)

/* the six views of Figma Previews (2153:1973): the table alone, the font card, the mono card, the font sheet with its
 * footer, the display and ramp with the footer, and the same with the weights hanging outside the frame */
export default function SpecimenSet() {
  useEffect(loadSpecialGothic, [])
  const inter = useMemo(() => ({ ...INTER, tracking: interTracking() }), [])
  const rampRows = useMemo(rampTableRows, [])
  const rampFooter = (
    <>
      <SpecimenFooterGroup title="Size ramp">
        <Table variant="simple" width="column" columns={RAMP_TABLE_COLUMNS} rows={rampRows} />
      </SpecimenFooterGroup>
      <Notes />
    </>
  )
  const rampContent = (
    <>
      <SpecimenDisplay font={inter} />
      <SpecimenRamp font={inter} />
    </>
  )

  return (
    /* laid out as the Figma section is: the table, the card column, the ramp, the ramp with weights */
    <div className="flex items-start gap-20 overflow-x-auto p-20">
      <SpecimenSheet showContent={false} footer={rampFooter} />
      <div className="flex flex-col gap-20">
        <SpecimenSheet showFooter={false} content={<SpecimenFontCard font={SPECIAL_GOTHIC} />} />
        <SpecimenSheet showFooter={false} content={<SpecimenFontCard ramp font={MONO} />} />
        <SpecimenSheet
          content={<SpecimenFontSheet font={SPECIAL_GOTHIC} faces={[SPECIAL_GOTHIC, INTER]} showFaces />}
          footer={(
            <>
              <SpecimenFooterGroup title="Parts">
                <Table width="column" columns={PARTS_COLUMNS} rows={PARTS_ROWS} />
              </SpecimenFooterGroup>
              <Notes />
            </>
          )}
        />
      </div>
      <SpecimenSheet content={rampContent} footer={rampFooter} />
      <SpecimenSheet content={rampContent} footer={rampFooter} showAside aside={<SpecimenWeights font={inter} />} />
    </div>
  )
}

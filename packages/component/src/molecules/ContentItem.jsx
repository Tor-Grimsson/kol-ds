import ContentCard from './ContentCard.jsx'
import ContentRow from './ContentRow.jsx'

/**
 * ContentItem — the form switch the estate hand-wrote nine times
 * (`layout === 'list' ? row : card`). One prop picks the form; everything
 * else passes through to ContentCard / ContentRow unchanged, so a listing
 * under a LIST/GRID toggle is one component with one prop flipped.
 *
 * @param {string} form  'card' | 'row'
 */
export default function ContentItem({ form = 'card', ...rest }) {
  return form === 'row' ? <ContentRow {...rest} /> : <ContentCard {...rest} />
}

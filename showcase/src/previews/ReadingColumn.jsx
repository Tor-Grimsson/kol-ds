import { ReadingColumn, ReadingHighlight } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* the text set for reading — position line, head, prose with a highlight and a quote, the chapters either side */
export default function ReadingColumnPreview() {
  return (
    <ReadingColumn position="The Waves / Interlude 03" page="125 / 297" eyebrow="03 / Sample reading text" title="The third interlude"
      standfirst="Original demonstration prose for this reader layout. Not text from Virginia Woolf’s novel. Contents and pagination are illustrative."
      prev={{ label: 'Previous interlude', title: 'Second interlude', onClick: () => {} }} next={{ label: 'Next interlude', title: 'Fourth interlude', onClick: () => {} }}>
      <p>By the time I reached the water, the town had begun to open its windows. A chair scraped against a kitchen floor; somewhere a radio was finding a station. These small sounds crossed the street and faded at the wall of the harbour, where the morning seemed to have a different measure.</p>
      <p>We tend to remember a journey by its arrivals. The intervals do their work more quietly. A pause at a crossing, the slow passage of a cloud, a sentence read twice: none of these would make a useful itinerary.</p>
      <ReadingHighlight note={1}>Attention is not always a matter of looking harder. Sometimes it is simply a willingness to remain.</ReadingHighlight>
      <h2>A place to return to</h2>
      <p>When I opened the book at last, the first sentence seemed to belong to the place where I was sitting. It gave a shape to the feeling of being there: present, but with room enough for another world beside this one.</p>
      <blockquote><p>“A page can hold our place even while the world continues around it.”</p><cite>From this original sample interlude</cite></blockquote>
      <small>1. A reader’s note: notice the change from watching to remaining.</small>
    </ReadingColumn>
  )
}

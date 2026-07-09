/**
 * matchSearchItems — the pure substring-match predicate extracted from
 * ShellSearchOverlay. Case-insensitive `includes` across each item's
 * label / tags / headings / keywords, returning the matched items annotated
 * with `matchedHeading` and `matchedKeyword` for the overlay's subtext rows.
 *
 * Match semantics (unchanged from the overlay):
 *   - an item survives if the query hits ANY of label / tags / headings / keywords
 *   - `matchedHeading` = the first heading that matched, else null
 *   - `matchedKeyword` = the first keyword that matched, but ONLY surfaced when
 *      the label and headings did NOT match (a keyword-only reason-for-inclusion)
 *
 * Pure JS, zero dependencies.
 *
 * @param {Array<Object>} items  items shaped { label, tags?, headings?, keywords? }
 * @param {string}        query  raw query string
 * @returns {Array<Object>} filtered items, each spread with matchedHeading/matchedKeyword
 */
export function matchSearchItems(items, query) {
  if (!query || query.length === 0) return []
  const q = query.toLowerCase()
  return (items || [])
    .map((item) => {
      const labelMatch = item.label.toLowerCase().includes(q)
      const tagMatch = (item.tags || []).some((tag) => tag.toLowerCase().includes(q))
      const headingMatch = (item.headings || []).find((h) => h.toLowerCase().includes(q))
      const keywordMatch = (item.keywords || []).find((k) => k.toLowerCase().includes(q))
      if (!labelMatch && !tagMatch && !headingMatch && !keywordMatch) return null
      return {
        ...item,
        matchedHeading: headingMatch || null,
        matchedKeyword: !labelMatch && !headingMatch && keywordMatch ? keywordMatch : null,
      }
    })
    .filter(Boolean)
}

/**
 * QuoteBlock - Render blockquotes with consistent styling
 *
 * Simple wrapper for blockquote elements.
 * Styling is handled by .kol-prose blockquote in prose.css
 *
 * @param {React.ReactNode} children - Quote content
 */
export default function QuoteBlock({ children }) {
  return <blockquote>{children}</blockquote>
}

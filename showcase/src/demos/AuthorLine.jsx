import { AuthorLine } from '@kolkrabbi/kol-content'

export const stage = 'hug'

/**
 * AuthorLine — the byline cluster (Avatar + name + role) extracted from
 * ArticleHeader. `initial` overrides the avatar glyph (defaults to the name's
 * first character); `title` hides when falsy; `size` maps to Avatar sizes.
 */
export const sizes = ['lg', 'md', 'sm']

export default function AuthorLineDemo({ size = 'lg' }) {
  return (
    <div className="flex flex-col items-start gap-6">
      <AuthorLine
        name="Thordur Grimsson"
        title="Principal design engineer"
        initial="TG"
        size={size}
      />
      <AuthorLine name="Anna Sigridardottir" title="Photography" size={size} />
      <AuthorLine name="Kolkrabbi Studio" size={size} />
    </div>
  )
}

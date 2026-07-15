import { AuthorLine } from '@kolkrabbi/kol-content'

export const stage = 'hug'

/**
 * AuthorLine — the byline cluster (Avatar + name + role) extracted from
 * ArticleHeader. `initial` overrides the avatar glyph (defaults to the name's
 * first character); `title` hides when falsy; `size` maps to Avatar sizes.
 */
export default function AuthorLineDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <AuthorLine
        name="Thordur Grimsson"
        title="Principal design engineer"
        initial="TG"
      />
      <AuthorLine name="Anna Sigridardottir" title="Photography" size="md" />
      <AuthorLine name="Kolkrabbi Studio" size="sm" />
    </div>
  )
}

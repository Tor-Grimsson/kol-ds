/**
 * @deprecated 2026-10-22 → `SectionText` with `level` (user: *"rename PageHeader to something that describes
 * section text elements and ship together"*). PageHeader was SectionText under four header levels; the levels
 * now live on SectionText, so one component carries every section text block — a page's masthead, a page
 * section, a section of content. Same props as before, mapped: `title` → `headline`, `subtitle` /
 * `description` → `body`, `titleClass` → `headlineClass`, `subtitleMaxWidth` → the body's measure. `size` ·
 * `voice` · `register` · `masthead` stay accepted and ignored. On the retirement ledger; the original is in
 * `_tmp/2026-10-22-dev-section-header/`.
 */
import SectionText, { SECTION_TEXT_LEVELS } from './SectionText.jsx'

/** @deprecated → `SECTION_TEXT_LEVELS` */
export const PAGE_HEADER_ROLES = SECTION_TEXT_LEVELS

export default function PageHeader({ title, subtitle, description, subtitleMaxWidth, titleClass, level = 'page', eyebrow, actions, media, className = '' }) {
  return (
    <SectionText
      level={level}
      eyebrow={eyebrow}
      headline={title}
      headlineClass={titleClass}
      body={subtitle ?? description}
      actions={actions}
      media={media}
      slotStyle={subtitleMaxWidth ? { body: { maxWidth: subtitleMaxWidth } } : undefined}
      className={className}
    />
  )
}

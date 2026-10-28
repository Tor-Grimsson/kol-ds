/**
 * Tiny i18n helper for the kit. Content lives in the data co-located as
 * `<key>` (English) + `<key>_is` (Icelandic); pages pass a `lang` prop.
 *
 * pick(obj, 'title', 'is') → obj.title_is if present, else obj.title.
 * English is always the fallback, so a missing translation degrades, never breaks.
 */
export const pick = (obj, key, lang) =>
  lang === 'is' && obj[`${key}_is`] != null ? obj[`${key}_is`] : obj[key]

/** The language a resume surface renders in, from `?lang=is`. English is the
 * absence of the param, so a plain URL is always the English kit — and the
 * headless export inherits whichever value the preview URL carries. */
export const readLang = (params) => (params.get('lang') === 'is' ? 'is' : 'en')

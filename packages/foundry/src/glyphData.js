/**
 * Foundry glyph data — static character collections + category metadata for the
 * type-specimen sections (GlyphMetricsGrid, FoundryCharacterSets). Ported from
 * the monorepo `@kol/ui/data` glyphSets so the DS foundry layer carries its own
 * default coverage instead of reaching into an app data package. Consumers can
 * override any of it via the `uppercaseGlyphs` / `lowercaseGlyphs` / category
 * props.
 */

export const glyphSets = {
  uppercase: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  lowercase: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
  numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  punctuation: ['.', ',', '!', '?', ';', ':', '"', "'", '-', '—', '(', ')', '[', ']', '{', '}', '&', '@', '#', '$', '%'],
  latin1: ['À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø'],
  latinExtended: ['Ā', 'Ă', 'Ą', 'Ć', 'Ĉ', 'Ċ', 'Č', 'Ď', 'Đ', 'Ē', 'Ĕ', 'Ė', 'Ę', 'Ě', 'Ĝ', 'Ğ', 'Ġ', 'Ģ', 'Ĥ', 'Ħ', 'Ĩ', 'Ī', 'Ĭ', 'Į'],
}

export const glyphCategories = [
  { key: 'uppercase', title: 'Uppercase' },
  { key: 'lowercase', title: 'Lowercase' },
  { key: 'numbers', title: 'Numbers' },
  { key: 'punctuation', title: 'Punctuation & Symbols' },
  { key: 'latin1', title: 'Latin-1 Supported' },
  { key: 'latinExtended', title: 'Latin Extended' },
]

/** Default preview pangram — neutral English, authored in intended case. */
/* the foundry's own passage (Icelandic — the site's typeface sample, moved here
 * from FontPreviewSection 2026-08-27, TypefaceCardRevealText; user: "we have
 * custom text samples in typefaces — Rennimjúkt eðal flauel etc."). The library
 * grid's card reveal shows its first sentence. */
export const FOUNDRY_SAMPLE_TEXT =
  'Rennimjúkt eðal flauel, duft slæðist niður, silkislaufa & æðardúnn, fiður daðra dilur, friður. Sjáumst sjaldnar en sálagárur, samverustundir við skák að sötri, soðin sjálfsögðum samtölum. Spakir sötra á sætu seyði, sjónlistarspjall, síðfóníur, söngur sungin suður af Síberíu, setið að sálrænum stríðsglæpum, svaðil-pöttum og skyndimátum, svarthvítar svikamyllur, sökkvandi skálínur spegla sýnirnar – seinni tíðirnar.'

export const SPECIMEN_SAMPLE_TEXT =
  'The quick brown fox jumps over the lazy dog while five wizards vex the gnomic judge.'

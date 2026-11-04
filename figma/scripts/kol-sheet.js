/* kol-sheet.js — the Foundations sheets (plan-2026-11-03-figma-mirrors-showcase W4). Paste into a use_figma call after
 * defining SHEETS = [{ name, eyebrow, lede, sections: [{ title, kind, items }] }]. Section titles mirror the showcase
 * page's (showcase/src/nav/page-sections.json). Every swatch, radius, bar and sample is BOUND to its variable or style,
 * never a hex. kind: swatch (color var names) · radius · shadow (effect style names) · styles (text style names) ·
 * prefix (every text style under a family) · bar (size/spacing var names) · tones (tone collection modes) ·
 * ink (ink-roles modes) · note (one line). Runs under the type→Schibsted swap; radius 4; fg/* ink. */
const type = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'type')
const sch = type.modes.find(m => m.name === 'Schibsted').modeId
for (const st of ['Regular', 'Medium', 'Bold', 'Light', 'SemiBold', 'Black', 'Italic']) { try { await figma.loadFontAsync({ family: 'Schibsted Grotesk', style: st }) } catch (e) {} }
for (const st of ['Regular', 'Medium', 'Light', 'Bold']) { try { await figma.loadFontAsync({ family: 'JetBrains Mono', style: st }) } catch (e) {} }
for (const f of [['Noto Sans', 'Regular'], ['Noto Sans', 'Medium'], ['Noto Sans Symbols', 'Regular'], ['Noto Sans Symbols', 'Medium'], ['Noto Sans Symbols2', 'Regular'], ['Public Sans', 'Light'], ['Public Sans', 'Regular'], ['Inter', 'Regular']]) { try { await figma.loadFontAsync({ family: f[0], style: f[1] }) } catch (e) {} }
const cols = await figma.variables.getLocalVariableCollectionsAsync()
const allVars = []; for (const c of cols) for (const id of c.variableIds) allVars.push(await figma.variables.getVariableByIdAsync(id))
const VN = (n) => allVars.find(v => v.name === n)
const VAR = { surface: VN('surface/primary'), border: VN('fg/08'), emph: VN('fg/96'), body: VN('fg/72'), meta: VN('fg/48'), plate: VN('fg/08') }
const paint = (v) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v)
const TS = await figma.getLocalTextStylesAsync(), ES = await figma.getLocalEffectStylesAsync()
const ST = (n) => TS.find(s => s.name === n).id
async function text(parent, chars, style, color, width) { const t = figma.createText(); parent.appendChild(t); t.characters = chars; await t.setTextStyleIdAsync(ST(style)); t.fills = [paint(VAR[color])]; if (width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height) } return t }
const AL = (d, p) => { const f = figma.createAutoLayout(d, p); f.fills = []; return f }
async function cellLabel(cell, a, b) { await text(cell, a, 'mono/12', 'meta'); if (b) await text(cell, b, 'mono/10', 'meta') }
const KIND = {
  async swatch(g, n) { const v = VN(n); if (!v) return; const c = AL('VERTICAL', { itemSpacing: 8 }); g.appendChild(c); const f = figma.createFrame(); f.resize(200, 96); f.cornerRadius = 4; f.fills = [paint(v)]; f.strokes = [paint(VAR.border)]; f.strokeWeight = 1; c.appendChild(f); await cellLabel(c, n) },
  async radius(g, n) { const v = VN(n); if (!v) return; const c = AL('VERTICAL', { itemSpacing: 8 }); g.appendChild(c); const f = figma.createFrame(); f.resize(200, 96); f.fills = [paint(VAR.plate)]; for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) f.setBoundVariable(k, v); c.appendChild(f); await cellLabel(c, n) },
  async shadow(g, n) { const e = ES.find(s => s.name === n); if (!e) return; const c = AL('VERTICAL', { itemSpacing: 12 }); g.appendChild(c); const f = figma.createFrame(); f.resize(200, 96); f.cornerRadius = 4; f.fills = [paint(VAR.surface)]; await f.setEffectStyleIdAsync(e.id); c.appendChild(f); await cellLabel(c, n) },
  async styles(g, n) { const s = TS.find(x => x.name === n); if (!s) return; const r = AL('HORIZONTAL', { itemSpacing: 32, counterAxisAlignItems: 'CENTER' }); g.appendChild(r); const l = AL('VERTICAL', { itemSpacing: 4 }); r.appendChild(l); await cellLabel(l, n, `${Math.round(s.fontSize)} · ${s.fontName.style}`); l.resize(280, l.height); l.primaryAxisSizingMode = 'AUTO'; l.counterAxisSizingMode = 'FIXED'; const t = figma.createText(); r.appendChild(t); t.characters = /mono|helper|code|eyebrow|caption|label/.test(n) ? 'kol-mono 0123' : 'Design tools'; await t.setTextStyleIdAsync(s.id); t.fills = [paint(VAR.emph)] },
  async prefix(g, p) { for (const s of TS.filter(x => x.name.startsWith(p + '/'))) await KIND.styles(g, s.name) },
  async bar(g, n) { const v = VN(n); if (!v) return; const r = AL('HORIZONTAL', { itemSpacing: 24, counterAxisAlignItems: 'CENTER' }); g.appendChild(r); const l = AL('VERTICAL'); r.appendChild(l); await cellLabel(l, n); l.resize(240, l.height); l.primaryAxisSizingMode = 'AUTO'; l.counterAxisSizingMode = 'FIXED'; const f = figma.createFrame(); f.resize(10, 16); f.fills = [paint(VN('fg/24'))]; r.appendChild(f); try { f.setBoundVariable('width', v) } catch (e) {} const val = Object.values(v.valuesByMode)[0]; await text(r, typeof val === 'number' ? String(val) : '—', 'mono/12', 'body') },
  async tones(g) { const col = cols.find(c => c.name === 'tone'); for (const m of col.modes) { const c = AL('VERTICAL', { itemSpacing: 8 }); g.appendChild(c); const f = AL('HORIZONTAL', { paddingTop: 32, paddingBottom: 32, paddingLeft: 24, paddingRight: 24, cornerRadius: 4 }); c.appendChild(f); f.setExplicitVariableModeForCollection(col, m.modeId); f.fills = [paint(VN('bg'))]; const t = await text(f, 'Aa label', 'mono/14', 'emph'); t.fills = [paint(VN('fg'))]; await cellLabel(c, m.name) } },
  async ink(g) { const col = cols.find(c => c.name === 'ink-roles'); for (const m of col.modes) { const r = AL('HORIZONTAL', { itemSpacing: 32, counterAxisAlignItems: 'CENTER' }); g.appendChild(r); const l = AL('VERTICAL'); r.appendChild(l); await cellLabel(l, m.name); l.resize(200, l.height); l.primaryAxisSizingMode = 'AUTO'; l.counterAxisSizingMode = 'FIXED'; const t = await text(r, 'The quick brown fox', 'doc/lede', 'emph'); t.setExplicitVariableModeForCollection(col, m.modeId); t.fills = [paint(VN('ink'))] } },
  async note(g, s) { await text(g, s, 'doc/body', 'meta', 1000) },
}
async function sheet(page, S, x) {
  const W = 2000
  const c = AL('VERTICAL', { name: S.name, itemSpacing: 48, paddingTop: 64, paddingBottom: 64, paddingLeft: 64, paddingRight: 64, cornerRadius: 4 }); page.appendChild(c)
  c.fills = [paint(VAR.surface)]; c.resize(W, c.height); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED'
  const h = AL('VERTICAL', { itemSpacing: 12 }); c.appendChild(h); await text(h, S.eyebrow, 'doc/eyebrow', 'meta'); await text(h, S.name, 'doc/heading', 'emph'); await text(h, S.lede, 'doc/lede', 'body', 1200)
  for (const sec of S.sections) {
    const b = AL('VERTICAL', { name: sec.title, itemSpacing: 24 }); c.appendChild(b); b.layoutSizingHorizontal = 'FILL'
    b.strokes = [paint(VAR.border)]; b.strokeTopWeight = 1; b.strokeLeftWeight = 0; b.strokeRightWeight = 0; b.strokeBottomWeight = 0; b.paddingTop = 32
    await text(b, sec.title, 'doc/section-title', 'emph')
    const listy = ['styles', 'prefix', 'bar', 'ink', 'note'].includes(sec.kind)
    const g = AL(listy ? 'VERTICAL' : 'HORIZONTAL', { name: 'items', itemSpacing: listy ? 16 : 24, counterAxisSpacing: 24, layoutWrap: listy ? 'NO_WRAP' : 'WRAP' }); b.appendChild(g); g.layoutSizingHorizontal = 'FILL'
    if (sec.kind === 'tones' || sec.kind === 'ink') await KIND[sec.kind](g)
    else for (const it of sec.items) await KIND[sec.kind](g, it)
  }
  const s = figma.createSection(); s.name = S.name; page.appendChild(s); s.appendChild(c); c.x = 200; c.y = 200; s.resizeWithoutConstraints(c.width + 400, c.height + 400); s.x = x; s.y = 0
  return s
}

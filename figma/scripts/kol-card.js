/* kol-card.js — THE card the KOL Figma library lays every master in (plan-2026-11-03-figma-mirrors-showcase W3).
 * Paste into a use_figma call after defining CARDS = { setId: [tier, pkg, description, [[prop, def]], usedBy[], textStyles[]] }
 * and TARGET = '<section id>'. It mirrors the showcase component page: eyebrow · name · lede · preview (a LABELLED grid,
 * never the raw set) · props · used by · nested text styles · and the master itself in "Component" at the bottom.
 * Right Grotesk cannot be loaded by a script: the page runs under the `type` collection's Schibsted mode while it
 * builds, and every node pinned to Right Grotesk is switched and restored (memory: figma-plugin-cannot-move-right-grotesk).
 * Radius 4, colours on fg/* and surface/primary so the card follows light and dark. */
const type = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'type')
const sch = type.modes.find(m => m.name === 'Schibsted').modeId
for (const st of ['Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Schibsted Grotesk', style: st })
for (const st of ['Regular', 'Medium']) await figma.loadFontAsync({ family: 'JetBrains Mono', style: st })
for (const f of [['Noto Sans', 'Regular'], ['Noto Sans', 'Medium'], ['Noto Sans Symbols', 'Regular'], ['Noto Sans Symbols', 'Medium'], ['Noto Sans Symbols2', 'Regular'], ['Public Sans', 'Light'], ['JetBrains Mono', 'Light'], ['Inter', 'Regular']]) { try { await figma.loadFontAsync({ family: f[0], style: f[1] }) } catch (e) {} }
const V = async (id) => figma.variables.getVariableByIdAsync(id)
const VAR = { surface: await V('VariableID:5:117'), border: await V('VariableID:5:30'), emph: await V('VariableID:5:41'), body: await V('VariableID:5:38'), meta: await V('VariableID:5:36') }
const paint = (v) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v)
const local = await figma.getLocalTextStylesAsync()
const STY = Object.fromEntries(Object.entries({ eyebrow: 'doc/eyebrow', heading: 'doc/heading', lede: 'doc/lede', section: 'doc/section-title', body: 'doc/body', code: 'doc/code-inline', mono12: 'mono/12', h10: 'helper/10' }).map(([k, n]) => [k, local.find(s => s.name === n).id]))
async function text(parent, chars, style, color, width) {
  const t = figma.createText(); parent.appendChild(t); t.characters = chars
  await t.setTextStyleIdAsync(STY[style]); t.fills = [paint(VAR[color])]
  if (width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height) }
  return t
}
const AL = (d, p) => { const f = figma.createAutoLayout(d, p); f.fills = []; return f }
const line = (f) => { f.strokes = [paint(VAR.border)]; f.strokeTopWeight = 0; f.strokeLeftWeight = 0; f.strokeRightWeight = 0; f.strokeBottomWeight = 1 }
const restore = []
const pin = (root) => { for (const d of [root, ...root.findAll(() => true)]) { if (!('explicitVariableModes' in d)) continue; const m = d.explicitVariableModes[type.id]; if ((m && m !== sch) || d.type === 'INSTANCE') { try { d.setExplicitVariableModeForCollection(type, sch); restore.push([d.id, m || null]) } catch (e) {} } } }
/* an instance is born on the CURRENT page: set the target's page current first, and switch the instance at birth */
const inst = (v) => { const i = v.createInstance(); try { i.setExplicitVariableModeForCollection(type, sch); restore.push([i.id, null]) } catch (e) {} return i } // restored (cleared) by unpin
const unpin = async () => { for (const [id, m] of restore) { const d = await figma.getNodeByIdAsync(id); if (!d) continue; if (m) d.setExplicitVariableModeForCollection(type, m); else d.clearExplicitVariableModeForCollection(type) } }

/* the labelled grid: rows = variant (else the axis with most values), columns = size; every other axis its own small block */
async function grid(stage, master, maxW) {
  const LW = 120
  if (master.type !== 'COMPONENT_SET') { const i = inst(master); stage.appendChild(i); const s = Math.min(1, maxW / i.width); if (s < 1) i.rescale(s); return }
  const axes = master.variantGroupProperties
  const base = master.defaultVariant ? master.defaultVariant.variantProperties : master.children[0].variantProperties
  const find = (must) => { let best = null, score = -1; for (const c of master.children) { const vp = c.variantProperties; if (!Object.entries(must).every(([k, v]) => vp[k] === v)) continue; const s = Object.entries(base).filter(([k, v]) => vp[k] === v).length; if (s > score) { score = s; best = c } } return best }
  const names = Object.keys(axes)
  const colAxis = names.find(n => /^size$/i.test(n)) || null
  const rowAxis = names.find(n => /^(variant|kind|role|style|type)$/i.test(n) && n !== colAxis) || names.filter(n => n !== colAxis).sort((a, b) => axes[b].values.length - axes[a].values.length)[0]
  const cols = colAxis ? axes[colAxis].values.map(v => ({ label: v, props: { [colAxis]: v } })) : [{ label: '', props: {} }]
  const colW = {}
  for (const c of cols) colW[c.label] = Math.max(40, ...master.children.filter(v => !colAxis || v.variantProperties[colAxis] === c.props[colAxis]).map(v => v.width)) + 24
  const total = LW + cols.reduce((a, c) => a + colW[c.label], 0)
  const scale = Math.min(1, maxW / total)
  const g = AL('VERTICAL', { name: 'grid', itemSpacing: 0 }); stage.appendChild(g)
  /* a set whose only axis is size has no row axis: one unlabelled row (Avatar, r4 W4) */
  const block = async (axis) => {
    const blk = AL('VERTICAL', { name: axis || 'size', paddingBottom: 24 }); g.appendChild(blk)
    const hdr = AL('HORIZONTAL', { paddingBottom: 8 }); blk.appendChild(hdr); line(hdr)
    await text(hdr, axis || ' ', 'mono12', 'meta', LW); for (const c of cols) await text(hdr, c.label || ' ', 'mono12', 'meta', colW[c.label] * scale)
    for (const val of axis ? axes[axis].values : [null]) {
      const row = AL('HORIZONTAL', { paddingTop: 10, paddingBottom: 10, counterAxisAlignItems: 'CENTER' }); blk.appendChild(row)
      await text(row, val ?? ' ', 'mono12', 'meta', LW)
      for (const c of cols) {
        const cell = AL('HORIZONTAL', { counterAxisAlignItems: 'CENTER' }); row.appendChild(cell); cell.resize(colW[c.label] * scale, cell.height); cell.primaryAxisSizingMode = 'FIXED'
        const v = find(axis ? { [axis]: val, ...c.props } : c.props)
        if (v) { const i = inst(v); cell.appendChild(i); if (scale < 1) i.rescale(scale) } else await text(cell, '—', 'mono12', 'meta')
      }
    }
  }
  await block(rowAxis)
  for (const n of names) if (n !== rowAxis && n !== colAxis) await block(n)
}

async function card(parent, master, d) {
  const [tier, pkg, desc, props, usedBy, textStyles] = d
  pin(master) // BEFORE the preview: instances copy the master's modes
  /* a drawn component replaces its placeholder (round-2 W5.3): same row, name + ' — placeholder' */
  for (const k of [...parent.children]) if (k.name === `${master.name} — placeholder`) k.remove()
  const inner = Math.min(1800, Math.max(864, master.width + 96))
  const W = inner + 96
  const c = AL('VERTICAL', { name: master.name, itemSpacing: 32, paddingTop: 48, paddingBottom: 48, paddingLeft: 48, paddingRight: 48, cornerRadius: 4 })
  parent.appendChild(c); c.fills = [paint(VAR.surface)]; c.resize(W, c.height); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED'
  const top = AL('VERTICAL', { name: 'header', itemSpacing: 12 }); c.appendChild(top)
  await text(top, `${tier.toUpperCase()} · ${pkg}`, 'eyebrow', 'meta'); await text(top, master.name, 'heading', 'emph'); await text(top, desc || '—', 'lede', 'body', inner)
  const box = AL('VERTICAL', { name: 'preview', cornerRadius: 4 }); c.appendChild(box); box.layoutSizingHorizontal = 'FILL'; box.strokes = [paint(VAR.border)]; box.strokeWeight = 1
  const head = AL('HORIZONTAL', { name: 'tabs', paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, itemSpacing: 16 }); box.appendChild(head); head.layoutSizingHorizontal = 'FILL'; line(head)
  await text(head, 'Preview', 'mono12', 'emph')
  const stage = AL('VERTICAL', { name: 'stage', paddingTop: 48, paddingBottom: 48, paddingLeft: 48, paddingRight: 48, counterAxisAlignItems: 'CENTER' }); box.appendChild(stage); stage.layoutSizingHorizontal = 'FILL'
  await grid(stage, master, inner - 96)
  const sec = async (title) => { const b = AL('VERTICAL', { name: title, itemSpacing: 16 }); c.appendChild(b); b.layoutSizingHorizontal = 'FILL'; await text(b, title, 'section', 'emph'); return b }
  if (props.length) {
    const b = await sec('Props'); const tbl = AL('VERTICAL', { name: 'props' }); b.appendChild(tbl); tbl.layoutSizingHorizontal = 'FILL'
    const row = async (cells, st, col) => { const r = AL('HORIZONTAL', { paddingTop: 10, paddingBottom: 10 }); tbl.appendChild(r); r.layoutSizingHorizontal = 'FILL'; line(r); await text(r, cells[0], st, col, 280); await text(r, cells[1], st, col, inner - 280) }
    await row(['PROP', 'DEFAULT'], 'h10', 'meta'); for (const p of props) await row([p[0], p[1] || '—'], 'mono12', 'body')
  }
  const ub = await sec('Used by'); const w = AL('HORIZONTAL', { itemSpacing: 16, counterAxisSpacing: 8, layoutWrap: 'WRAP' }); ub.appendChild(w); w.layoutSizingHorizontal = 'FILL'
  if (usedBy.length) for (const u of usedBy) { const t = await text(w, u, 'body', 'body'); t.textDecoration = 'UNDERLINE' } else await text(w, '—', 'body', 'meta')
  if (textStyles.length) { const tb = await sec('Nested text styles'); const ts = AL('HORIZONTAL', { itemSpacing: 8, counterAxisSpacing: 8, layoutWrap: 'WRAP' }); tb.appendChild(ts); ts.layoutSizingHorizontal = 'FILL'; for (const s of textStyles) { const chip = AL('HORIZONTAL', { paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8, cornerRadius: 4 }); ts.appendChild(chip); chip.fills = [paint(VAR.border)]; await text(chip, '.' + s, 'code', 'body') } }
  const mb = await sec('Component'); if (master.type === 'COMPONENT_SET') master.fills = []; mb.appendChild(master)
  return c
}

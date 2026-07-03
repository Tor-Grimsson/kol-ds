#!/usr/bin/env node
/**
 * kol-scrape — CLI.
 *
 *   kol-scrape <url> [<url> …] [--out file.json] [--compact]
 *       presence record(s) for the page(s)
 *
 *   kol-scrape catalog <url> [--download dir] [--out file.json] [--compact]
 *       Squarespace catalog via the ?format=json trick; --download saves each
 *       item's high-res image into dir, named by sanitized title
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { scrapeMany, squarespaceCatalog, safeName } from '../src/index.js'

const args = process.argv.slice(2)
const catalogMode = args[0] === 'catalog'
if (catalogMode) args.shift()

const urls = []
let out = null
let compact = false
let download = null

for (let i = 0; i < args.length; i++) {
  const a = args[i]
  if (a === '--out') out = args[++i]
  else if (a === '--compact') compact = true
  else if (a === '--download') download = args[++i]
  else if (a === '--help' || a === '-h') { urls.length = 0; break }
  else urls.push(a.includes('://') ? a : `https://${a}`)
}

if (!urls.length) {
  console.log('usage: kol-scrape <url> [<url> …] [--out file.json] [--compact]')
  console.log('       kol-scrape catalog <url> [--download dir] [--out file.json] [--compact]')
  process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1)
}

let payload
if (catalogMode) {
  const record = await squarespaceCatalog(urls[0])
  console.error(`${record.collection ?? urls[0]}: ${record.count} item(s)`)
  if (download) {
    mkdirSync(download, { recursive: true })
    for (const item of record.items) {
      if (!item.image) continue
      try {
        const bytes = Buffer.from(await (await fetch(item.image)).arrayBuffer())
        const file = join(download, `${safeName(item.title)}.jpg`)
        writeFileSync(file, bytes)
        console.error(`  saved ${file}`)
      } catch (e) {
        console.error(`  FAILED ${item.title}: ${e.message}`)
      }
    }
  }
  payload = record
} else {
  const records = await scrapeMany(urls)
  payload = records.length === 1 ? records[0] : records
  if (records.every((r) => r.error)) {
    console.log(JSON.stringify(payload, null, compact ? 0 : 2))
    process.exit(1)
  }
}

const json = JSON.stringify(payload, null, compact ? 0 : 2)
if (out) {
  writeFileSync(out, json + '\n')
  console.error(`wrote → ${out}`)
} else {
  console.log(json)
}

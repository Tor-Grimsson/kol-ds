// Embedded cover art: the ID3v2.3 / 2.4 `APIC` frame at the head of an MP3, read with one ranged fetch
// (`Range` with a single byte range is CORS-safelisted — no preflight; R2 and the B2 proxy honour it).
// ponytail: no ID3v2.2 (`PIC`), no unsynchronisation — add when a file in the buckets needs either.
const CHUNK = 1 << 20
const covers = new Map(); // url → Promise<string|null> object URL. ponytail: never revoked — a few hundred KB per file viewed.

const syncsafe = (b, i) => ((b[i] & 0x7f) << 21) | ((b[i + 1] & 0x7f) << 14) | ((b[i + 2] & 0x7f) << 7) | (b[i + 3] & 0x7f)
const be32 = (b, i) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0
const latin1 = (b) => String.fromCharCode(...b)

async function range(url, from, to) {
  const r = await fetch(url, { headers: { Range: `bytes=${from}-${to}` } })
  if (!r.ok) throw new Error(String(r.status))
  return new Uint8Array(await r.arrayBuffer())
}

function concat(a, b) { const out = new Uint8Array(a.length + b.length); out.set(a); out.set(b, a.length); return out; }

function apic(tag, version) {
  let i = 0
  let first = null; // Finder shows the FRONT cover (type 3) when a file carries several pictures
  while (i + 10 <= tag.length) {
    const id = latin1(tag.subarray(i, i + 4))
    if (!/^[A-Z0-9]{4}$/.test(id)) break; // padding
    const size = version === 4 ? syncsafe(tag, i + 4) : be32(tag, i + 4)
    if (id === 'APIC') {
      const body = tag.subarray(i + 10, i + 10 + size)
      const enc = body[0]
      let p = 1
      while (p < body.length && body[p] !== 0) p++
      const mime = latin1(body.subarray(1, p))
      const type = body[p + 1]
      p += 2; // mime terminator + picture type
      if (enc === 1 || enc === 2) { while (p + 1 < body.length && !(body[p] === 0 && body[p + 1] === 0)) p += 2; p += 2; } // UTF-16 description
      else { while (p < body.length && body[p] !== 0) p++; p++; }
      const blob = new Blob([body.subarray(p)], { type: mime || 'image/jpeg' })
      if (type === 3) return blob
      first ??= blob
    }
    i += 10 + size
  }
  return first
}

export function readCover(url) {
  if (!covers.has(url)) {
    covers.set(url, (async () => {
      try {
        let bytes = await range(url, 0, CHUNK - 1)
        if (latin1(bytes.subarray(0, 3)) !== 'ID3' || bytes[3] < 3) return null
        const version = bytes[3]
        const flags = bytes[5]
        const size = syncsafe(bytes, 6)
        if (bytes.length < 10 + size) bytes = concat(bytes, await range(url, bytes.length, 10 + size - 1))
        let tag = bytes.subarray(10, 10 + size)
        if (flags & 0x40) tag = tag.subarray(version === 4 ? syncsafe(tag, 0) : be32(tag, 0) + 4); // extended header
        const blob = apic(tag, version)
        return blob ? URL.createObjectURL(blob) : null
      } catch {
        return null
      }
    })())
  }
  return covers.get(url)
}

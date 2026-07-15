import { Chess } from 'chess.js'

/* chess.js v1 load() returns void and THROWS on invalid FENs — and it
 * validates playability (kings required), not renderability. Display
 * states like the cleared board are legitimate here, so on throw we
 * place the FEN's board portion piece-by-piece instead of reverting
 * to the start position. */
export const buildChessFromFen = (fen) => {
  const chess = new Chess()
  if (fen) {
    try {
      chess.load(fen)
    } catch {
      chess.clear()
      const ranks = fen.split(' ')[0].split('/')
      ranks.forEach((rank, r) => {
        let file = 0
        for (const ch of rank) {
          if (/\d/.test(ch)) { file += Number(ch); continue }
          const square = 'abcdefgh'[file] + (8 - r)
          try {
            chess.put({ type: ch.toLowerCase(), color: ch === ch.toLowerCase() ? 'b' : 'w' }, square)
          } catch { /* unplaceable char — leave square empty */ }
          file += 1
        }
      })
    }
  }
  return chess
}

export default buildChessFromFen

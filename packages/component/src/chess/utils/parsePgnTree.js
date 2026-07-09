const cleanPgn = (pgn = '') => {
  return pgn
    .replace(/\[[^\]]*\]/g, '') // remove headers
    .replace(/\{[^}]*\}/g, '') // remove comments
    .replace(/\$[0-9]+/g, '') // remove NAGs
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const tokenize = (pgn) => {
  if (!pgn) return []
  const prepared = cleanPgn(pgn)
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
  return prepared
    .split(/\s+/)
    .filter(Boolean)
}

const isMoveNumber = (token = '') => /^[0-9]+\.{1,3}$/.test(token)
const isResultToken = (token = '') => ['1-0', '0-1', '1/2-1/2', '*'].includes(token)

const createStackEntry = (startPly = 0) => ({
  moves: [],
  lastNode: null,
  currentPly: startPly
})

const pushMove = (entry, san) => {
  entry.currentPly += 1
  const ply = entry.currentPly
  const node = {
    id: `${ply}-${san}`,
    ply,
    san,
    color: ply % 2 === 1 ? 'white' : 'black',
    moveNumber: Math.ceil(ply / 2),
    variations: []
  }
  entry.moves.push(node)
  entry.lastNode = node
}

const attachVariation = (parentEntry, variationMoves) => {
  if (!parentEntry.lastNode) {
    return
  }
  parentEntry.lastNode.variations.push(variationMoves)
}

export const buildMoveTree = (pgn) => {
  const tokens = tokenize(pgn)
  if (!tokens.length) {
    return []
  }

  const root = createStackEntry(0)
  const stack = [root]

  tokens.forEach((tokenRaw) => {
    const token = tokenRaw.trim()
    const top = stack[stack.length - 1]

    if (token === '(') {
      const parent = stack[stack.length - 1]
      if (!parent.lastNode) {
        return
      }
      const variationEntry = createStackEntry(parent.lastNode.ply)
      attachVariation(parent, variationEntry.moves)
      stack.push(variationEntry)
      return
    }

    if (token === ')') {
      if (stack.length > 1) {
        stack.pop()
      }
      return
    }

    if (isMoveNumber(token) || isResultToken(token)) {
      return
    }

    if (!token) {
      return
    }

    pushMove(top, token)
  })

  return root.moves
}

export default buildMoveTree

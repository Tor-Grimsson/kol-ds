import React from 'react'

const CursorContext = React.createContext({
  position: { x: 0, y: 0 },
  visible: false,
  setVisible: () => {},
  cardHover: null,
  setCardHover: () => {},
  clearCardHover: () => {}
})

export function CursorProvider({ children }) {
  // Initialize cursor at center of viewport
  const [position, setPosition] = React.useState(() => ({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  }))
  const [visible, setVisible] = React.useState(false)
  const [cardHover, setCardHoverState] = React.useState(null)

  React.useEffect(() => {
    function handleMove(event) {
      setPosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  const setCardHover = React.useCallback((rect) => {
    setCardHoverState(rect)
  }, [])

  const clearCardHover = React.useCallback(() => {
    setCardHoverState(null)
  }, [])

  const value = React.useMemo(() => ({
    position,
    visible,
    setVisible,
    cardHover,
    setCardHover,
    clearCardHover
  }), [position, visible, cardHover, setCardHover, clearCardHover])

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
}

export function useCursor() {
  return React.useContext(CursorContext)
}

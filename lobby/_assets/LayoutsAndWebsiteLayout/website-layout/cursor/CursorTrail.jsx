import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useCursor } from './CursorContext'

const CursorTrail = () => {
  const { position } = useCursor()
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springConfig = { damping: 28, stiffness: 170 }

  // Chain followers: each follows the previous one
  const follower1X = useSpring(cursorX, springConfig)
  const follower1Y = useSpring(cursorY, springConfig)

  const follower2X = useSpring(follower1X, springConfig)
  const follower2Y = useSpring(follower1Y, springConfig)

  const follower3X = useSpring(follower2X, springConfig)
  const follower3Y = useSpring(follower2Y, springConfig)

  useEffect(() => {
    cursorX.set(position.x)
    cursorY.set(position.y)
  }, [position.x, position.y, cursorX, cursorY])

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed w-4 h-4 rounded-full pointer-events-none z-[9999]"
        style={{
          backgroundColor: 'var(--kol-color-absolute-white)',
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Follower 1 - closest */}
      <motion.div
        className="fixed w-8 h-8 rounded-full border-2 pointer-events-none z-[9998] opacity-50"
        style={{
          borderColor: 'var(--kol-color-absolute-white)',
          left: 0,
          top: 0,
          x: follower1X,
          y: follower1Y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Follower 2 - middle */}
      <motion.div
        className="fixed w-12 h-12 rounded-full border pointer-events-none z-[9997] opacity-30"
        style={{
          borderColor: 'var(--kol-color-absolute-white)',
          left: 0,
          top: 0,
          x: follower2X,
          y: follower2Y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Follower 3 - furthest */}
      <motion.div
        className="fixed w-16 h-16 rounded-full border pointer-events-none z-[9996] opacity-20"
        style={{
          borderColor: 'var(--kol-color-absolute-white)',
          left: 0,
          top: 0,
          x: follower3X,
          y: follower3Y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  )
}

export default CursorTrail

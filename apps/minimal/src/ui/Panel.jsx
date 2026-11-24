export default function Panel({ side = 'left', children }) {
  const edge = side === 'left' ? 'w-[240px] border-r' : 'w-[240px] border-l'
  return <aside className={`flex h-full shrink-0 flex-col bg-panel border-line ${edge}`}>{children}</aside>
}

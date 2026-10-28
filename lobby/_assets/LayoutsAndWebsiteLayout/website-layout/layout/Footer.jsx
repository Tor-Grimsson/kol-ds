function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative z-10 bg-surface-tertiary px-4 py-6 md:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <p className="kol-helper-12 uppercase">&copy; {new Date().getFullYear()} Kolkrabbi</p>
        <button
          type="button"
          onClick={scrollToTop}
          className="kol-helper-12 uppercase transition-opacity hover:opacity-70 cursor-pointer"
        >
          <span className="flex items-center gap-1">
            <span>↑</span>
            Back to top
          </span>
        </button>
      </div>
    </footer>
  )
}

export { Footer }

const KolLogomark = ({ className = '', title = 'Kolkrabbi logomark' }) => {
  return (
    <img
      src="/svg/logo.svg"
      alt={title}
      className={className ? `logomarkBrand ${className}` : "logomarkBrand"}
      aria-hidden={title ? undefined : true}
    />
  )
}

export default KolLogomark

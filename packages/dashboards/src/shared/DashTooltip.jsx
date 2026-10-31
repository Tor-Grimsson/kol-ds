const DashTooltip = ({ visible, children }) => {
  if (!visible) return null
  return <div className="dash-tooltip kol-tooltip">{children}</div>
}

export default DashTooltip

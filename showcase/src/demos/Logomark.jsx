import { Logomark } from '@kolkrabbi/kol-shell'

export default function LogomarkDemo() {
  return (
    <div className="flex items-center gap-6">
      <Logomark svgUrl="/svg/logo.svg" size={20} />
      <Logomark svgUrl="/svg/logo.svg" size={32} />
      <Logomark svgUrl="/svg/logo.svg" size={48} />
    </div>
  )
}

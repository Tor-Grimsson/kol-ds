/* the 13 float families, in 24-float-system.md's order (plan-2026-11-04-float-set W1) */
import Foundations from './Foundations.jsx'
import Controls from './Controls.jsx'
import Fields from './Fields.jsx'
import Menus from './Menus.jsx'
import Chrome from './Chrome.jsx'
import Windows from './Windows.jsx'
import Cards from './Cards.jsx'
import Lists from './Lists.jsx'
import Navigation from './Navigation.jsx'
import Charts from './Charts.jsx'
import Calendar from './Calendar.jsx'
import Timeline from './Timeline.jsx'
import Icons from './Icons.jsx'

export const PARTS = [
  { path: '/parts/foundations', label: 'Foundations', icon: 'palette', Component: Foundations },
  { path: '/parts/controls', label: 'Controls', icon: 'sliders-rows', Component: Controls },
  { path: '/parts/fields', label: 'Fields', icon: 'typewriter', Component: Fields },
  { path: '/parts/menus', label: 'Menus', icon: 'list-bullet', Component: Menus },
  { path: '/parts/chrome', label: 'Chrome', icon: 'layout', Component: Chrome },
  { path: '/parts/windows', label: 'Windows', icon: 'browser', Component: Windows },
  { path: '/parts/cards', label: 'Cards + tiles', icon: 'grid', Component: Cards },
  { path: '/parts/lists', label: 'Lists + tables', icon: 'table', Component: Lists },
  { path: '/parts/navigation', label: 'Navigation + layout', icon: 'navigation', Component: Navigation },
  { path: '/parts/charts', label: 'Charts', icon: 'bar-chart', Component: Charts },
  { path: '/parts/calendar', label: 'Calendar + reader', icon: 'calendar', Component: Calendar },
  { path: '/parts/timeline', label: 'Timeline', icon: 'film-strip', Component: Timeline },
  { path: '/parts/icons', label: 'Icons', icon: 'star', Component: Icons },
]

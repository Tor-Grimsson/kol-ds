// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1865-20365
// source=packages/component/src/organisms/ReadingContents.jsx
// component=ReadingContents
import figma from 'figma'

// RailFloat body content (plan-2026-11-12-float-rails-figma W4): book · LabeledControlSection of TocRows · progress.
// No sheet, title, status or collapse-v chevron of its own — the module draws those (the status line goes in its footer slot).

export default {
  example: figma.code`<ReadingContents book="The Waves" author="Virginia Woolf" count="9 interludes" chapters={chapters} current={at} onSelect={go} progress={42} />`,
  imports: ["import { ReadingContents } from \"@kolkrabbi/kol-component\""],
  id: 'ReadingContents',
}

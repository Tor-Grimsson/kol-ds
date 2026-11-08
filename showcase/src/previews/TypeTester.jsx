import { TypeTester } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* One rung of a type tester — the caller stacks them into a size ladder. */
const STYLES = [
  { label: 'Light', value: 300 },
  { label: 'Regular', value: 400 },
  { label: 'Medium', value: 500 },
  { label: 'Bold', value: 700 },
]

export default function TypeTesterPreview() {
  return (
    <div className="flex w-full flex-col">
      <TypeTester
        fontFamily="Inter, sans-serif"
        styles={STYLES}
        text="The quick brown fox jumps over the lazy dog"
        initialSize={48}
        lineClamp={2}
      />
    </div>
  )
}

import { ProsePreview } from '@kolkrabbi/kol-component'

export const Default = () => (
  <div className="w-[720px]">
    <ProsePreview
      h1="Page title"
      paragraph="Body paragraph — a run of long-form copy at reading size, long enough to wrap across several lines and show measure, rhythm, and paragraph spacing as the prose stylesheet renders them."
      code={`const sample = 'code block'\nexport default sample`}
      pullout="A short emphatic line set apart from the body"
      quote="A quotation set at blockquote scale."
    />
  </div>
)

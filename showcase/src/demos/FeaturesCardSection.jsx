import { FeaturesCardSection, Button } from '@kolkrabbi/kol-component'

export const stage = 'full'

const gradient = (from, to) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">' +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
      '</linearGradient></defs><rect width="320" height="200" fill="url(#g)"/></svg>'
  )

const features = [
  {
    title: 'Type foundry',
    icon: 'book-open',
    visual: gradient('#6C5CE7', '#00B894'),
    imageAspectRatio: '10/6',
    description: 'Original typefaces, variable and static.',
  },
  {
    title: 'Design systems',
    icon: 'grid',
    visual: gradient('#0984E3', '#6C5CE7'),
    imageAspectRatio: '10/6',
    description: 'Tokenised, themeable component kits.',
  },
  {
    title: 'Client work',
    icon: 'folder',
    visual: gradient('#E17055', '#FDCB6E'),
    imageAspectRatio: '10/6',
    description: 'Brand, editorial, and product design.',
  },
]

export default function FeaturesCardSectionDemo() {
  return (
    <FeaturesCardSection
      headerLabel="What we make"
      headerDescription="A small studio building typefaces, design systems, and brand work in the open."
      headerClassName="w-full"
      features={features}
      ctas={
        <>
          <Button>Explore projects</Button>
          <Button variant="ghost">Get in touch</Button>
        </>
      }
      ctasClassName="pt-8"
    />
  )
}

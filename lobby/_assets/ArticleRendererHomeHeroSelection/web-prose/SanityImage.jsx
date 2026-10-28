import imageUrlBuilder from '@sanity/image-url'
import { sanityClient as client } from '../../lib/sanityClient'

const builder = imageUrlBuilder(client)

function urlFor(source) {
  return builder.image(source)
}

export default function SanityImage({ image, alt = '', width, height, className = '', loading = 'eager' }) {
  if (!image || !image.asset) {
    return null
  }

  let imageUrl = urlFor(image)

  if (width) {
    imageUrl = imageUrl.width(width)
  }

  if (height) {
    imageUrl = imageUrl.height(height)
  }

  imageUrl = imageUrl.auto('format').url()

  return (
    <img
      src={imageUrl}
      alt={alt || image.alt || ''}
      className={className}
      loading={loading}
    />
  )
}

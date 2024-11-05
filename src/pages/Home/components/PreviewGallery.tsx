// utils
import type { Preview } from '../../../api/requests'
// components
import Loading from '../../../ui/Loading'
import { Card } from '../../../ui/Card'

interface PreviewGalleryProps {
  previews: Preview[] | null
  title: string
}

/**
 * PreviewGallery Component - takes title and an array of previews to render
 */
export default function PreviewGallery({
  previews,
  title,
}: PreviewGalleryProps) {
  if (!previews) {
    return (
      <div className="min-h-90 flex w-full justify-center">
        <Loading className="h-full w-auto" />
      </div>
    )
  }

  return (
    <div className="">
      <h2 className="text-2xl py-1 ">{title}</h2>
      <div className="flex flex-row flex-wrap justify-center gap-3 px-2">
        {previews.map((prev) => (
          <Card key={prev.id} {...prev} />
        ))}
      </div>
    </div>
  )
}

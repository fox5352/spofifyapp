import type { Preview } from '../../../api/requests'
import Loading from '../../../components/Loading'
import { Card } from '../../../components/Card'

export function PreviewGallery({
  previews,
  title,
}: {
  previews: Preview[] | null
  title: string
}) {
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

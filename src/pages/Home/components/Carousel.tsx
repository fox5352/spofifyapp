import { Link } from 'react-router-dom'
import type { Preview } from '../../../api/requests'
import { useEffect, useState } from 'react'
import Loading from '../../../ui/Loading'
import ErrorMessage from '../../../ui/ErrorMessage'
import { MdArrowLeft, MdArrowRight } from 'react-icons/md'
import { formatDate } from '../../../lib/utils'

export default function Carousel({
  previews,
  error,
}: {
  previews: Preview[] | null
  error: string | null
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    if (previews) {
      setIsLoading(false)
    }
  }, [previews])

  const prevSlide = () => {
    if (!previews) return
    setActiveImageIndex((prev) =>
      activeImageIndex > 0 ? prev - 1 : previews.length - 1
    )
  }

  const nextSlide = () => {
    if (!previews) return
    const newIndex = activeImageIndex + 1
    setActiveImageIndex(() => (newIndex >= previews.length ? 0 : newIndex))
  }

  return (
    <div className="flex justify-center w-full h-56 md:h-[420px]">
      {error && (
        <div className="w-full h-full text-red-500">
          <ErrorMessage message={error} size="text-2xl" />
        </div>
      )}

      {isLoading ? (
        <div className="w-full h-full flex justify-center">
          <Loading className="h-full w-auto" />
        </div>
      ) : (
        <div className="max-w-4xl w-full h-full md:m-2 bg-zinc-950 md:rounded-md relative overflow-hidden md:bg-gradient-to-r from-zinc-950 to-white">
          <button
            className="absolute z-10 left-0 h-full px-1 text-white bg-zinc-950 opacity-30 duration-200 transition-all ease-linear hover:opacity-65"
            onClick={prevSlide}
          >
            <MdArrowLeft className="h-8 w-auto" />
          </button>
          {previews &&
            previews.map((prev, index) => (
              <CarouselImage
                key={prev.id}
                {...prev}
                index={index}
                activeImageIndex={activeImageIndex}
              />
            ))}
          <button
            className="absolute z-10 right-0 h-full px-1 text-white bg-zinc-950 opacity-30 duration-200 transition-all ease-linear hover:opacity-65"
            onClick={nextSlide}
          >
            <MdArrowRight className="h-8 w-auto" />
          </button>
        </div>
      )}
    </div>
  )
}

export function CarouselImage({
  id,
  image,
  title,
  updated,
  description,
  index,
  activeImageIndex,
}: Preview & { index: number; activeImageIndex: number }) {
  return (
    <Link
      className={`flex basis-full w-full h-full overflow-hidden bg-transparent group/carousel duration-200 transition-all ease-linear absolute left-0 top-0 z-[${index}] ${index === activeImageIndex ? 'scale-100 ' : '-translate-x-full scale-0'} text-white bg-gradient-to-r from-zinc-950 via-zinc-800 to-white`}
      to={`/shows/${id}`}
    >
      <div className="pl-10 flex justify-center items-start flex-col w-full">
        <div className="mb-10">
          <h1 className="text-lg md:text-2xl">{title}</h1>
          <h3>Updated: {formatDate(updated)}</h3>
        </div>
        <div className="max-w-[90%] max-h-[100px]md:max-h-[220px] px-1 py-2 rounded-md bg-gray-500 bg-clip-padding backdrop-filter  backdrop-blur-sm bg-opacity-20 backdrop-saturate-150 backdrop-contrast-100 overflow-y-auto group-hover/carousel:bg-opacity-95 group-hover/carousel:bg-zinc-950 duration-200 transition-all ease-linear">
          <p>{description}</p>
        </div>
      </div>
      <div className="absolute -z-10 bottom-0 right-0 h-full">
        <img className="w-auto h-full" src={image} alt="" />
        <div className="absolute top-0 w-full h-full bg-zinc-950 opacity-60 md:opacity-0" />
      </div>
    </Link>
  )
}

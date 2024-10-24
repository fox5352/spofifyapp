import { Link } from 'react-router-dom'
import { getGenres, Preview } from '../api/requests'
import { useEffect, useState } from 'react'
import GenreTag from './GenreTag'

export function Card({
  id,
  title,
  description,
  seasons,
  image,
  genres,
  // updated,
}: Preview) {
  const [genreTitles, setGenresTitles] = useState<string[] | null>(null) // genre titles for reel

  // Gets the genre titles from api
  useEffect(() => {
    const getGenresTitles = async () => {
      const res = await getGenres(genres)

      if (!res) return

      setGenresTitles(res.map((genre) => genre.title))
    }

    getGenresTitles()
  }, [genres])

  return (
    <Link to={`post/${id}`}>
      <div className="max-w-xs w-full group/card relative">
        <div className="cursor-pointer relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4 bg-zinc-950">
          <div className="absolute w-full h-full top-0 left-0" />
          {/* header */}
          <div className="flex flex-row items-center space-x-4 z-10">
            <div className="flex flex-col">
              <p className="font-normal text-base text-gray-50 relative z-10">
                {title}
              </p>
              <p className="text-sm text-white">{seasons} seasons</p>
            </div>
          </div>
          {/* image */}
          <div className="absolute px-1.5 left-0 w-fit h-fit">
            <div className="absolute inset-0 bg-black opacity-45"></div>
            <img className="w-full h-auto" loading="lazy" src={image} alt="" />
          </div>
          {/* main content */}
          <div className="text content relative">
            <div className="relative z-20 flex gap-1">
              {genreTitles &&
                genreTitles.map((title) => (
                  <GenreTag key={title} variant="filled">
                    {title}
                  </GenreTag>
                ))}
            </div>
            <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
              {description.slice(0, 220)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import { getGenres, Preview } from '../api/requests'
import { useEffect, useState } from 'react'
import GenreTag from './GenreTag'

/**
 * Card Component
 *
 * Displays a preview card for a podcast show with image, title, description, and genres.
 * Links to the detailed view of the show when clicked.
 */
export function Card({
  id,
  title,
  description,
  seasons,
  image,
  genres,
  // updated,
}: Preview) {
  // State to store the fetched genre titles
  const [genreTitles, setGenresTitles] = useState<string[] | null>(null)

  // Fetch genre titles when genres array changes
  useEffect(() => {
    const fetchGenreTitles = async () => {
      try {
        const res = await getGenres(genres)
        if (res) {
          setGenresTitles(res.map((genre) => genre.title))
        }
      } catch (error) {
        console.error('Failed to fetch genre titles:', error)
      }
    }

    fetchGenreTitles()
  }, [genres])

  const truncatedDescription = description.slice(0, 220)

  return (
    <Link to={`/shows/${id}`}>
      <div className="max-w-xs w-full group/card relative">
        {/* Card Container */}
        <div className="cursor-pointer relative card h-96 rounded-md shadow-xl max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4 bg-[--bg-two]">
          {/* Overlay */}
          <div className="absolute w-full h-full top-0 left-0" />

          {/* Header Section */}
          <div className="flex flex-row items-center space-x-4 z-10">
            <div className="flex flex-col">
              <p className="font-normal text-base text-gray-50 relative z-10">
                {title}
              </p>
              <p className="text-sm text-[--text]">{seasons} seasons</p>
            </div>
          </div>

          {/* Show Image */}
          <div className="absolute px-1.5 left-0 w-fit h-fit">
            <div className="absolute inset-0 bg-[--bg-two] opacity-45" />
            <img
              className="w-full h-auto"
              loading="lazy"
              src={image}
              alt={`${title} show poster`}
            />
          </div>

          {/* Content Section */}
          <div className="text content relative">
            {/* Genre Tags */}
            <div className="relative z-20 flex gap-1 text-sm overflow-x-auto">
              {genreTitles?.map((title) => (
                <GenreTag key={title} variant="filled">
                  {title}
                </GenreTag>
              ))}
            </div>

            {/* Description */}
            <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
              {truncatedDescription}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

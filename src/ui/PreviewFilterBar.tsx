import { memo, useEffect, useState } from 'react'
//components
import TagButton from './TagButton'
import Loading from './Loading'

/**
 * Represents a genre category with its title and ID
 */
export interface GenreTag {
  title: string
  id: number
}

/**
 * PreviewFilterBar Component
 *
 * A navigation bar that displays genre filter buttons. Shows a loading state
 * while genres are being fetched.
 */
const PreviewFilterBar = memo(function PreviewFilterBar({
  genres,
}: {
  genres: GenreTag[]
}) {
  // Track loading state of genre data
  const [isLoading, setIsLoading] = useState(true)

  // Set loading to false once genres are available
  useEffect(() => {
    if (genres.length) {
      setIsLoading(false)
    }
  }, [genres])

  /**
   * Renders a single genre tag button
   * @param data - Genre tag data object
   * @returns JSX element for the tag button
   */
  const renderTag = (data: GenreTag) => {
    // Truncate genre title if longer than 12 characters
    const displayTitle = data.title.slice(0, 12)

    return (
      <TagButton key={data.id} param={data.title}>
        {displayTitle}
      </TagButton>
    )
  }

  return (
    <nav
      aria-label="Genre filters"
      className="flex justify-center items-center flex-wrap gap-x-1 gap-y-1.5 my-2 px-2 py-1 text-[--text-two] w-5/6 max-w-xl md:max-w-2xl rounded-md relative"
    >
      {isLoading ? (
        <div
          className="flex w-full justify-center"
          aria-live="polite"
          role="status"
        >
          <Loading className="text-4xl" />
        </div>
      ) : (
        <div
          role="group"
          aria-label="Genre filter buttons"
          className="flex flex-wrap justify-center items-center gap-x-1 gap-y-1.5 w-full"
        >
          {genres.map(renderTag)}
        </div>
      )}
    </nav>
  )
})

// Add display name for debugging purposes
PreviewFilterBar.displayName = 'PreviewFilterBar'

export default PreviewFilterBar

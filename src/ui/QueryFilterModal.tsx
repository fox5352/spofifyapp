import { useEffect, useRef } from 'react'
import { MdClose } from 'react-icons/md'
// components
import SelectMenu, { SelectMenuProps } from './SelectMenu'

/**
 * QueryFilterModalProps - Interface for the QueryFilterModal component's props.
 *
 * @property {boolean} isActive - Determines whether the modal is currently visible.
 * @property {() => void} toggleFunction - Function to toggle the modal's visibility.
 * @property {SelectMenuProps[]} filters - Array of filter options, each represented as a SelectMenu.
 */
interface QueryFilterModalProps {
  isActive: boolean
  toggleFunction: () => void
  filters: SelectMenuProps[]
}

/**
 * QueryFilterModal - A modal component for selecting and applying query filters.
 *
 * This component is displayed as a full-screen overlay modal when active.
 * It includes a close button, a title, and a list of filter options represented as
 * `SelectMenu` components, allowing users to configure query filters.
 *
 * - Supports click-outside-to-close functionality
 * - Animates the close button on hover for better UX
 * - Renders the `filters` list dynamically from `SelectMenuProps` array
 */
export default function QueryFilterModal({
  isActive,
  toggleFunction,
  filters,
}: QueryFilterModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)

  /**
   * Sets up and cleans up the outside click listener based on `isActive`.
   */
  useEffect(() => {
    /**
     * handleClickOutside - Closes the modal when clicking outside of it.
     *
     * This function listens for clicks outside the modal, and if detected,
     * it triggers the toggleFunction to close the modal.
     *
     * @param {MouseEvent} event - The mouse event triggered by a click.
     */
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (modalRef.current && !modalRef.current.contains(target)) {
        toggleFunction()
      }
    }

    if (isActive) {
      window.addEventListener('mousedown', handleClickOutside)
    } else {
      window.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isActive, toggleFunction])

  return (
    <div
      aria-hidden={!isActive}
      className={`${isActive ? '' : 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-1/2 left-0 z-50 flex justify-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div
          ref={modalRef}
          className="relative text-white bg-[--bg-two] rounded-lg shadow"
        >
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-[--ac-one] via-violet-500 to-purple-500 bg-clip-text text-transparent">
              Filter Menu
            </h3>
            <button
              type="button"
              className="text-inherit bg-transparent hover:bg-gradient-to-r from-[--ac-one] to-purple-500 hover:text-zinc-950 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center duration-200 transition-all ease-linear"
              onClick={toggleFunction}
            >
              <MdClose className="h-full w-auto" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="w-full max-w-xl h-1 mx-auto bg-gradient-to-r from-[--ac-one] via-violet-500 to-purple-500 rounded-full" />
          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">
            {filters.map((filter, idx) => (
              <SelectMenu key={idx} {...filter} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

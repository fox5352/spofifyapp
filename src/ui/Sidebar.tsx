import { useEffect, useRef, useState } from 'react'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import {
  MdFavorite,
  MdHeadphones,
  MdHome,
  MdMenu,
  MdSearch,
} from 'react-icons/md'

/**
 * SideBar - A component for navigation
 */
function SideBar() {
  //refs
  const SideBarRef = useRef<HTMLElement | null>(null)

  // local state
  const [isExpanded, setIsExpanded] = useState(false)

  /**
   * toggles focus to component when toggle
   */
  useEffect(() => {
    if (SideBarRef.current && isExpanded) {
      SideBarRef.current.focus()
    }
  }, [isExpanded])

  // toggle function for css styling
  const tf = function <T>(activeStyle: T, defaultStyle: T): T {
    return isExpanded ? activeStyle : defaultStyle
  }

  // toggle functoin for state
  const toggleMenu = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <div className="md:w-10">
      <button
        onClick={toggleMenu}
        className="fixed z-30 right-10 bottom-[100px] md:hidden p-0.5 h-12 w-12 text-4xl text-[--text-two] rounded-full duration-200 ease-in-out bg-gradient-to-r from-[--ac-one] to-[--ac-three] hover:animate-heartbeat active:text-opacity-60 transition-all"
      >
        {tf(
          <FaMinusCircle className="w-full h-full" />,
          <FaPlusCircle className="w-full h-full" />
        )}
      </button>

      <aside
        className={`z-40 h-fit my-1 mr-1 text-white bg-[--bg-two] rounded-tr-lg rounded-br-lg w-10 overflow-hidden group  ${tf('w-44 fixed', 'hidden md:flex fixed ')} transition-all ease-in-out duration-300`}
      >
        <nav
          ref={SideBarRef}
          className={`w-10 ${tf('w-40', '')} transition-all ease-in-out duration-300 p-2`}
        >
          {/*  */}
          <h3 className="flex items-center text-2xl mb-3">
            <button
              className="text-2xl hover:text-[--ac-three]"
              onClick={toggleMenu}
            >
              {isExpanded ? <MdHeadphones /> : <MdMenu />}
            </button>
            <span
              className={`text-transparent underline ${tf('text-white', '')}`}
            >
              Spofify
            </span>
          </h3>
          {/*  */}
          <div className="flex flex-col gap-2">
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-1 text-lg hover:text-[--ac-one] ${isActive ? 'text-[--ac-one]' : ''}`
              }
              to="/"
            >
              <span className="text-2xl">
                <MdHome />
              </span>
              <span className={`text-transparent ${tf('text-white', '')}`}>
                Home
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-1 text-lg hover:text-[--ac-three] ${isActive ? 'text-[--ac-three]' : ''}`
              }
              to="/shows"
            >
              <span className="text-2xl">
                <MdSearch />
              </span>
              <span className={`text-transparent ${tf('text-white', '')}`}>
                Search
              </span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-1 text-lg hover:text-[--ac-three] ${isActive ? 'text-[--ac-three]' : ''}`
              }
              to="dashboard"
            >
              <span className="text-2xl">
                <MdFavorite />
              </span>
              <span className={`text-transparent ${tf('text-white', '')}`}>
                Dashboard
              </span>
            </NavLink>
          </div>
        </nav>
      </aside>
    </div>
  )
}

export default SideBar

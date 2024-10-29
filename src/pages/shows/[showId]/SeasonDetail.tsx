import { useLocation } from "react-router-dom";
import { type Season } from "../../../api/requests";

import { MdPlayCircle } from "react-icons/md"
import { usePlaylist } from "../../../store/playlist";

export default function SeasonDetail() {
  const { state }: { state: Season } = useLocation()
  const { add, setTrack } = usePlaylist()

  const addAndPlay = () => {
    add(state)
    setTrack(0)
  }

  return (
    <div className="flex flex-col items-center w-full mt-2 text-white bg-zinc-950 rounded-md">
      <div className="max-w-4xl w-full px-1 py-2">
        <h2 className="text-2xl">{state.title}</h2>
        <div className="p-1 pt-1.5">
          <h4 className="text-xl text-indigo-500">Season: {state.season}</h4>
          <h5 className="text-xl text-purple-500">Episodes: {state.episodes.length}</h5>
        </div>
        <nav>
          <button
            className="w-auto p-[3px] relative"
            aria-controls="show-description"
            onClick={addAndPlay}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="flex items-center gap-1 px-2 py-0.5 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
              Play <MdPlayCircle />
            </div>
          </button>

        </nav>
      </div>
      <ul className="flex flex-col max-w-5xl w-full space-y-1 py-2">
        {state.episodes.map(episode => (<EpisodeButton {...episode} season={state} />))}
      </ul>
    </div >
  )
}

const EpisodeButton = ({ title, episode, season }: { title: string, episode: number, season: Season }) => {
  const { data, add, setTrack } = usePlaylist()

  const handleClick = () => {
    if (!data) {
      add(season)
    }
    setTrack(episode - 1)
  }

  return (
    <li className="w-full" key={title}>
      <button className="flex items-center gap-1.5 w-full p-1.5 text-start border-2 border-white rounded group hover:border-indigo-500 duration-200 transition-all ease-linear" onClick={handleClick}>
        <MdPlayCircle className="text-xl group-hover:bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:text-zinc-950 rounded-full duration-200 transition-all ease-linear" />
        {title}
      </button>
    </li>
  )
}

import { MouseEvent, useMemo } from 'react'
import { FavShow, useFavorite } from '../../../../../store/favorites'
import { MdFavorite } from 'react-icons/md'

export default function FavButton({
  showId,
  season,
  ep,
}: {
  showId: string
  ep: number
  season: number
}) {
  const { data, add, remove } = useFavorite()

  const isFaved: boolean = useMemo(() => {
    return data.find(
      (fav) =>
        fav.showId === showId && fav.season === season && fav.episode === ep
    )
      ? true
      : false
  }, [data])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    // create new fav item to add to faveplaylist

    const newFav: FavShow = {
      showId: showId,
      season: Number(season),
      episode: Number(ep),
      date: new Date(),
    }

    if (!isFaved) {
      add(newFav)
    } else {
      remove(newFav)
    }
  }

  return (
    <button
      className={`flex p-1.5 border-2 rounded-md duration-200 transition-all ease-linear ${isFaved ? 'text-rose-500 border-rose-500' : 'border-white'}`}
      onClick={handleClick}
    >
      <MdFavorite className="text-xl" />
    </button>
  )
}

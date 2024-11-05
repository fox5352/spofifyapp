import { create } from 'zustand'
// utils
import { getfromLocal, saveToLocal } from '../lib/utils'

export type FavShow = {
  showId: string
  season: number
  episode: number
  date: Date
}

type Favorite = {
  data: FavShow[]
  name: string
}

type Actions = {
  sync: () => void
  add: (data: FavShow) => void
  remove: (id: FavShow) => void
}

function compare(state: FavShow, newData: FavShow): boolean {
  return (
    state.showId === newData.showId &&
    state.season === newData.season &&
    state.episode === newData.episode
  )
}

export const useFavorite = create<Favorite & Actions>()((set) => ({
  data: [],
  name: 'favorites',
  sync: () =>
    set((state) => {
      // get data from localstorage
      if (state.data.length === 0) {
        const savedDataFromLocal = getfromLocal<FavShow[]>(state.name)
        if (savedDataFromLocal) {
          state.data = savedDataFromLocal
        } else {
          saveToLocal([], state.name)
        }
        return state
      }
      return state
    }),
  add: (newData) =>
    set((state) => {
      state.sync()

      if (!state.data.find((fav) => compare(fav, newData))) {
        const newList = [...state.data, newData]
        saveToLocal(newList, state.name)
        return {
          ...state,
          data: newList,
        }
      }
      return state
    }),
  remove: (newData) =>
    set((state) => {
      state.sync()

      const filteredList = state.data.filter((fav) => !compare(fav, newData))
      saveToLocal(filteredList, state.name)
      return {
        ...state,
        data: filteredList,
      }
    }),
}))

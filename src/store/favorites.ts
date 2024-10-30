import { create } from "zustand"
import { getfromLocal, saveToLocal } from "../lib/utils"

type FavShow = {
	id: string,
}

type Favorite = {
	data: FavShow[]
	name: string
}

type Actions = {
	sync: () => void
	add: (data: FavShow) => void
	remove: (id: string) => void
}


export const useFavorite = create<Favorite & Actions>()((set) => ({
	data: [],
	name: "favorites",
	sync: () => set((state) => {
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
	add: (newData) => set((state) => {
		state.sync()
		// check if the show is already in the favorites
		if (!state.data.find(fav => fav.id === newData.id)) {
			const newList = [...state.data, newData]
			saveToLocal(newList, state.name)
			return {
				...state,
				data: newList
			}
		}
		return state
	}),
	remove: (id) => set((state) => {
		state.sync()
		// remove the show from the favorites
		const newList = state.data = state.data.filter(fav => fav.id !== id)
		saveToLocal(newList, state.name)
		return {
			...state,
			data: newList
		}
	}),
}))

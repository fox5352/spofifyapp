import { create } from "zustand"
//
import type { Season } from "../api/requests"

type Playlist = {
  data: Season | null;
  index: number;
}

type Actions = {
  add: (data: Season) => void;
  setTrack: (episode: number) => void;
  next: () => void;
  previous: () => void;
}

export const usePlaylist = create<Playlist & Actions>()((set) => ({
  data: null,
  index: 0,
  add: (data) => {
    set((state) => ({ ...state, data }))
  },
  setTrack: (episode) => {
    set((state) => {
      if (state.data && episode > 0 && episode < state.data.episodes.length) {
        return {
          ...state,
          index: episode
        }
      } else {
        return state
      }
    })
  },
  next: () => {
    set(state => {
      if (state.data && state.index < state.data.episodes.length - 1) {
        return { ...state, index: state.index + 1 }
      } else {
        return state
      }
    })
  },
  previous: () => {
    set((state) => {
      if (state.index > 0) {
        return { ...state, index: state.index - 1 }
      } else {
        return state
      }
    })
    return ""
  }
}))

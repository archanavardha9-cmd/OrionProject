import { create } from 'zustand'

export const useMallStore = create((set) => ({
  sceneScrollProgress: 0,
  setSceneScrollProgress: (sceneScrollProgress) => set({ sceneScrollProgress }),
}))

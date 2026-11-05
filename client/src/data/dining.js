import { stores, searchStores } from './stores'

export const dining = stores.filter((store) => store.type === 'Dining')
export const diningCategories = ['All', ...new Set(dining.map((store) => store.category))]

export const searchDining = (query) =>
  searchStores(query).filter((store) => store.type === 'Dining')

export const diningByFloor = (floor) =>
  dining.filter((store) => store.floor === Number(floor))

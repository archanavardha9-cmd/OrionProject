import { stores, searchStores } from './stores'

export const entertainment = stores.filter((store) => store.type === 'Entertainment')
export const entertainmentCategories = ['All', ...new Set(entertainment.map((store) => store.category))]

export const searchEntertainment = (query) =>
  searchStores(query).filter((store) => store.type === 'Entertainment')

export const entertainmentByFloor = (floor) =>
  entertainment.filter((store) => store.floor === Number(floor))

// Orion Mall Gorakhpur — dining & food destinations
//
// NOTE: Venue names and details are illustrative conceptual content for this
// frontend preview. They are NOT verified tenant information. isVerified: false
// marks conceptual/demo content.

import { stores } from './stores'

export const dining = stores.filter(
  (s) => ['Restaurant', 'Cafe', 'Food Court', 'Dessert', 'Beverage'].includes(s.category)
)

export const diningCategories = [
  'All',
  'Restaurant',
  'Cafe',
  'Food Court',
  'Dessert',
  'Beverage',
]

export const searchDining = (query) => {
  const term = query.trim().toLowerCase()
  if (!term) return dining
  return dining.filter(
    (s) =>
      s.name.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term) ||
      s.tags.some((t) => t.toLowerCase().includes(term))
  )
}

export const diningByFloor = (floor) => dining.filter((s) => s.floor === Number(floor))

// Orion Mall Gorakhpur — entertainment & leisure destinations
//
// NOTE: Destination names and details are illustrative conceptual content for this
// frontend preview. They are NOT verified tenant information. isVerified: false
// marks conceptual/demo content.

import { stores } from './stores'

export const entertainment = stores.filter(
  (s) => ['Cinema', 'Gaming', 'Entertainment', 'Family Leisure', 'Events'].includes(s.category)
)

export const entertainmentCategories = [
  'All',
  'Cinema',
  'Gaming',
  'Entertainment',
  'Family Leisure',
  'Events',
]

export const searchEntertainment = (query) => {
  const term = query.trim().toLowerCase()
  if (!term) return entertainment
  return entertainment.filter(
    (s) =>
      s.name.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term) ||
      s.tags.some((t) => t.toLowerCase().includes(term))
  )
}

export const entertainmentByFloor = (floor) =>
  entertainment.filter((s) => s.floor === Number(floor))

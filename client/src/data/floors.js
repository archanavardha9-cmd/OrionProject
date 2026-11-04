// Orion Mall Gorakhpur — mall directory data
// NOTE: Store names, floors, units, and descriptions are illustrative conceptual
// content for this frontend preview. They are NOT verified tenant information
// for Orion Mall Gorakhpur. Replace with verified data before public use.

export const FLOOR_HEIGHT = 4.25

export const floors = [
  {
    id: 'lg',
    name: 'Lower Ground',
    label: 'LG',
    number: -1,
    description: 'Arrival, parking access, daily essentials and visitor services.',
    wing: 'Lower Ground Level',
    image: '/images/mall/lower-ground.webp',
  },
  {
    id: 'g',
    name: 'Ground Floor',
    label: 'G',
    number: 0,
    description: 'Main entrance, flagship retail, beauty, accessories and customer service.',
    wing: 'Grand Atrium',
    image: '/images/mall/ground-floor.webp',
  },
  {
    id: 'f1',
    name: 'First Floor',
    label: 'F1',
    number: 1,
    description: 'Fashion, footwear, lifestyle, cosmetics and specialty stores.',
    wing: 'Fashion Promenade',
    image: '/images/mall/first-floor.webp',
  },
  {
    id: 'f2',
    name: 'Second Floor',
    label: 'F2',
    number: 2,
    description: 'Restaurants, cafes, food court and family dining destinations.',
    wing: 'Dining Terrace',
    image: '/images/mall/second-floor.webp',
  },
  {
    id: 'f3',
    name: 'Third Floor',
    label: 'F3',
    number: 3,
    description: 'Cinema, gaming, family entertainment and leisure destinations.',
    wing: 'Entertainment Block',
    image: '/images/mall/third-floor.webp',
  },
]

export const floorLabel = (index) => {
  const floor = floors.find((f) => f.number === Number(index))
  return floor ? floor.label : `F${index}`
}

export const floorName = (index) => {
  const floor = floors.find((f) => f.number === Number(index))
  return floor ? floor.name : `Floor ${index}`
}

export const floorByNumber = (number) => floors.find((f) => f.number === Number(number))

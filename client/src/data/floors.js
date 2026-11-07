export const FLOOR_HEIGHT = 4.25

export const floors = [
  {
    id: 'g',
    name: 'Ground Floor',
    label: 'G',
    number: 0,
    description: 'Anchor fashion, premium menswear and official technology experiences.',
    wing: 'Anchor Fashion & Premium Tech',
    image: '/images/mall/ground-floor.webp',
  },
  {
    id: 'f1',
    name: 'First Floor',
    label: 'F1',
    number: 1,
    description: 'Youth casuals, denim, fast fashion and lifestyle gifts.',
    wing: 'Youth Casuals, Denims & Lifestyle Gifts',
    image: '/images/mall/first-floor.webp',
  },
  {
    id: 'f2',
    name: 'Second Floor',
    label: 'F2',
    number: 2,
    description: "Women's ethnic and western wear, kids' essentials, footwear and personal care.",
    wing: "Women's Ethnic Wear, Footwear & Kids' Essentials",
    image: '/images/mall/second-floor.webp',
  },
  {
    id: 'f4',
    name: 'Fourth Floor',
    label: 'F4',
    number: 4,
    description: 'Cinema, lounge cafes and entertainment.',
    wing: 'Cinema, Lounge Cafes & Entertainment',
    image: '/images/entertainment/cinema.webp',
  },
]

export const floorLabel = (index) => {
  const floor = floors.find((item) => item.number === Number(index))
  return floor ? floor.label : `F${index}`
}

export const floorName = (index) => {
  const floor = floors.find((item) => item.number === Number(index))
  return floor ? floor.name : `Floor ${index}`
}

export const floorByNumber = (number) => floors.find((item) => item.number === Number(number))

export const adjacentFloorNumber = (number) => {
  const index = floors.findIndex((floor) => floor.number === Number(number))
  if (index < 0 || floors.length < 2) return Number(number)
  const adjacentIndex = index === floors.length - 1 ? index - 1 : index + 1
  return floors[adjacentIndex].number
}

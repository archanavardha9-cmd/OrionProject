export const demoFloors = [
  { name: 'Basement', label: 'B1', number: -1, description: 'Arrival, essentials & parking' },
  { name: 'Ground', label: 'G', number: 0, description: 'The grand arrival' },
  { name: 'First floor', label: 'F1', number: 1, description: 'Fashion & living' },
  { name: 'Second floor', label: 'F2', number: 2, description: 'Dining & discovery' },
  { name: 'Third floor', label: 'F3', number: 3, description: 'Entertainment & play' },
]

export const floorLabel = (index) => demoFloors.find((floor) => floor.number === Number(index))?.label ?? `F${index}`

export const demoStores = [
  { _id: 'atelier', slug: 'the-atelier', name: 'The Atelier', category: 'Fashion', floor: 0, description: 'A considered edit of contemporary essentials, selected for everyday expression.', location: 'East wing', color: '#b98861' },
  { _id: 'form', slug: 'form-and-field', name: 'Form & Field', category: 'Lifestyle', floor: 0, description: 'Thoughtful objects and small details for a more considered home.', location: 'West wing', color: '#788477' },
  { _id: 'maison', slug: 'maison-edit', name: 'Maison Edit', category: 'Fashion', floor: 1, description: 'New-season silhouettes with a point of view all their own.', location: 'East wing', color: '#a88077' },
  { _id: 'glow', slug: 'glow-studio', name: 'Glow Studio', category: 'Beauty', floor: 1, description: 'A quiet moment for your daily ritual, from skin to scent.', location: 'West wing', color: '#c4a66f' },
  { _id: 'golden-hour', slug: 'golden-hour', name: 'Golden Hour', category: 'Jewellery', floor: 1, description: 'Modern keepsakes and timeless pieces for every occasion.', location: 'Atrium side', color: '#b59a61' },
  { _id: 'pixel', slug: 'pixel-house', name: 'Pixel House', category: 'Electronics', floor: 1, description: 'A hands-on destination for the ideas shaping what comes next.', location: 'North wing', color: '#74808c' },
  { _id: 'table', slug: 'the-long-table', name: 'The Long Table', category: 'Dining', floor: 2, description: 'A welcoming place to gather, share, and stay a little longer.', location: 'Atrium side', color: '#9e735b' },
  { _id: 'cafe', slug: 'little-window-cafe', name: 'Little Window Café', category: 'Café', floor: 2, description: 'A sunny corner for a slow coffee and something sweet.', location: 'South terrace', color: '#a97d5a' },
  { _id: 'spice', slug: 'spice-and-stone', name: 'Spice & Stone', category: 'Dining', floor: 2, description: 'Comforting favourites, brought together around the table.', location: 'Food hall', color: '#b67553' },
  { _id: 'play', slug: 'playhouse', name: 'Playhouse', category: 'Entertainment', floor: 3, description: 'A bright, easy-going place for the whole family to play.', location: 'North wing', color: '#74808c' },
  { _id: 'screen', slug: 'the-picture-house', name: 'The Picture House', category: 'Entertainment', floor: 3, description: 'Make an evening of it with the latest stories on the big screen.', location: 'East wing', color: '#8f6c68' },
  { _id: 'market', slug: 'the-market-room', name: 'The Market Room', category: 'Lifestyle', floor: -1, description: 'A changing edit of useful finds and thoughtful gifts.', location: 'Arrival level', color: '#879078' },
]

export const demoServices = [
  { _id: 'wayfinding', name: 'Mall wayfinding', description: 'Find your way between floors and destinations.' },
  { _id: 'guest-help', name: 'Guest assistance', description: 'Visitor support information to be confirmed.' },
  { _id: 'accessibility', name: 'Accessibility', description: 'Accessibility details to be confirmed before your visit.' },
  { _id: 'parking', name: 'Parking', description: 'Parking information to be confirmed before your visit.' },
]

export const demoEvents = [
  { _id: 'weekend', slug: 'the-weekend-edit', title: 'The Weekend Edit', type: 'At the atrium', dateLabel: 'A little something for Saturday', date: 'Coming soon', location: 'The Grand Atrium', floor: 0, description: 'Discover a changing edit of local makers, thoughtful finds and small moments worth staying for.' },
  { _id: 'table-talk', slug: 'gather-around', title: 'Gather Around', type: 'Food & friends', dateLabel: 'An evening at the table', date: 'Coming soon', location: 'The Market Room', floor: 2, description: 'A relaxed celebration of good food, familiar faces and new favourites.' },
  { _id: 'light', slug: 'a-season-of-light', title: 'A Season of Light', type: 'Seasonal moments', dateLabel: 'Made for making memories', date: 'Coming soon', location: 'The Grand Atrium', floor: 0, description: 'Step into a warm, luminous celebration designed to bring the season together.' },
]

export const demoOffers = [
  { _id: 'slow-mornings', slug: 'slow-mornings-made-better', title: 'Slow mornings, made better', category: 'Dining', description: 'A little extra with your first coffee. Participating venues and offer terms to be confirmed.', valid: 'Offer details to be confirmed' },
  { _id: 'new-season', slug: 'a-fresh-point-of-view', title: 'A fresh point of view', category: 'Fashion', description: 'Explore a considered selection of new-season arrivals.', valid: 'Participating stores and offer terms to be confirmed' },
  { _id: 'movie-night', slug: 'make-it-a-movie-night', title: 'Make it a movie night', category: 'Entertainment', description: 'Pair a good story with a little something before or after the show.', valid: 'Offer details to be confirmed' },
]

export const demoMall = {
  name: 'Orion Mall Gorakhpur',
  address: 'Gorakhpur, Uttar Pradesh, India — exact address to be confirmed.',
  hours: 'Opening hours to be confirmed.',
  phone: 'Contact number to be confirmed.',
  parking: 'Parking information to be confirmed before your visit.',
  note: 'Store names, floor labels, offers, and event information are illustrative placeholders for this frontend preview.',
}

export const slugify = (value = '') => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

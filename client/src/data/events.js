// Orion Mall Gorakhpur — events & promotions
//
// NOTE: Events and offers are illustrative conceptual content for this frontend
// preview. Dates, participating venues and terms are NOT verified. isVerified:
// false marks conceptual/demo content.

export const events = [
  {
    id: 'evt-weekend-edit',
    slug: 'the-weekend-edit',
    title: 'The Weekend Edit',
    type: 'Local makers market',
    dateLabel: 'Every Saturday',
    date: 'Coming soon',
    location: 'The Grand Atrium',
    floor: 0,
    description: 'A changing edit of local makers, thoughtful finds and small moments worth staying for.',
    image: '/images/events/weekend-edit.webp',
    isVerified: false,
  },
  {
    id: 'evt-gather-around',
    slug: 'gather-around',
    title: 'Gather Around',
    type: 'Food & friends',
    dateLabel: 'An evening at the table',
    date: 'Coming soon',
    location: 'The Market Room',
    floor: 2,
    description: 'A relaxed celebration of good food, familiar faces and new favourites.',
    image: '/images/events/gather-around.webp',
    isVerified: false,
  },
  {
    id: 'evt-season-of-light',
    slug: 'a-season-of-light',
    title: 'A Season of Light',
    type: 'Seasonal celebration',
    dateLabel: 'Made for making memories',
    date: 'Coming soon',
    location: 'The Grand Atrium',
    floor: 0,
    description: 'A warm, luminous celebration designed to bring the season together.',
    image: '/images/events/season-of-light.webp',
    isVerified: false,
  },
  {
    id: 'evt-cinema-night',
    slug: 'cinema-under-stars',
    title: 'Cinema Under the Stars',
    type: 'Open-air screening',
    dateLabel: 'Friday evenings',
    date: 'Coming soon',
    location: 'Third Floor Terrace',
    floor: 3,
    description: 'Classic films under the open sky with popcorn and cosy seating.',
    image: '/images/events/cinema-night.webp',
    isVerified: false,
  },
]

export const findEvent = (slug) => events.find((e) => e.slug === slug)

export const offers = [
  {
    id: 'off-slow-mornings',
    slug: 'slow-mornings-made-better',
    title: 'Slow mornings, made better',
    category: 'Dining',
    description: 'A little extra with your first coffee at participating cafés.',
    valid: 'Offer details to be confirmed',
    image: '/images/offers/slow-mornings.webp',
    isVerified: false,
  },
  {
    id: 'off-new-season',
    slug: 'a-fresh-point-of-view',
    title: 'A fresh point of view',
    category: 'Fashion',
    description: 'Explore a considered selection of new-season arrivals.',
    valid: 'Participating stores and offer terms to be confirmed',
    image: '/images/offers/new-season.webp',
    isVerified: false,
  },
  {
    id: 'off-movie-night',
    slug: 'make-it-a-movie-night',
    title: 'Make it a movie night',
    category: 'Entertainment',
    description: 'Pair a good story with a little something before or after the show.',
    valid: 'Offer details to be confirmed',
    image: '/images/offers/movie-night.webp',
    isVerified: false,
  },
]

export const findOffer = (slug) => offers.find((o) => o.slug === slug)

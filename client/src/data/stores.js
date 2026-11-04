// Orion Mall Gorakhpur — store & destination directory
//
// NOTE: All tenant names, floors, unit numbers and descriptions are illustrative
// conceptual content for this frontend preview. They are NOT verified tenant
// information for Orion Mall Gorakhpur. Replace with verified data before public
// use. isVerified: false marks conceptual/demo content.

import { FLOOR_HEIGHT, floorLabel } from './floors'
export { floorLabel }

const categoryImage = {
  Fashion: '/images/fashion/storefront-a.svg',
  Footwear: '/images/stores/footwear-a.svg',
  Accessories: '/images/stores/accessories-a.svg',
  Jewellery: '/images/stores/jewellery-a.svg',
  Beauty: '/images/stores/beauty-a.svg',
  Health: '/images/stores/health-a.svg',
  Electronics: '/images/stores/electronics-a.svg',
  Lifestyle: '/images/stores/lifestyle-a.svg',
  'Department Store': '/images/stores/department-a.svg',
  Supermarket: '/images/stores/supermarket-a.svg',
  Restaurant: '/images/dining/restaurant.svg',
  Cafe: '/images/dining/cafe.svg',
  'Food Court': '/images/dining/foodcourt.svg',
  Dessert: '/images/dining/dessert.svg',
  Beverage: '/images/dining/dessert.svg',
  Cinema: '/images/entertainment/cinema.svg',
  Gaming: '/images/entertainment/gaming.svg',
  Entertainment: '/images/entertainment/bowling.svg',
  'Family Leisure': '/images/entertainment/gaming.svg',
  Events: '/images/stores/events-a.svg',
  'Customer Service': '/images/stores/services-a.svg',
  Services: '/images/stores/services-a.svg',
  Facilities: '/images/stores/facilities-a.svg',
  Parking: '/images/stores/parking-a.svg',
}

const baseStores = [
  // ---------------- Lower Ground (-1) ----------------
  { id: 'lg-parking-a', slug: 'parking-entry-a', name: 'Parking Entry A', category: 'Parking', floor: -1, unit: 'LG-P01', description: 'Main vehicle access to the lower-ground parking levels.', tags: ['Parking', 'Access'], isVerified: false },
  { id: 'lg-parking-b', slug: 'parking-entry-b', name: 'Parking Entry B', category: 'Parking', floor: -1, unit: 'LG-P02', description: 'Secondary vehicle access to the lower-ground parking levels.', tags: ['Parking', 'Access'], isVerified: false },
  { id: 'lg-supermarket', slug: 'freshmart-grocery', name: 'FreshMart Grocery', category: 'Supermarket', floor: -1, unit: 'LG-001', description: 'Daily essentials, fresh produce and household staples under one roof.', tags: ['Supermarket', 'Groceries', 'Essentials'], isVerified: false },
  { id: 'lg-pharmacy', slug: 'city-care-pharmacy', name: 'City Care Pharmacy', category: 'Health', floor: -1, unit: 'LG-002', description: 'Prescription medicines, wellness products and everyday health supplies.', tags: ['Pharmacy', 'Health', 'Wellness'], isVerified: false },
  { id: 'lg-atm', slug: 'atm-lobby', name: '24x7 ATM Lobby', category: 'Services', floor: -1, unit: 'LG-003', description: 'Round-the-clock cash withdrawal and banking services.', tags: ['ATM', 'Banking', 'Services'], isVerified: false },
  { id: 'lg-service-desk', slug: 'guest-services-desk', name: 'Guest Services Desk', category: 'Customer Service', floor: -1, unit: 'LG-004', description: 'Visitor assistance, lost & found and mall information.', tags: ['Customer Service', 'Help Desk'], isVerified: false },
  { id: 'lg-restrooms', slug: 'restrooms-lg', name: 'Restrooms & Nursing Room', category: 'Facilities', floor: -1, unit: 'LG-005', description: 'Accessible restrooms and a private nursing room for parents.', tags: ['Restrooms', 'Nursing', 'Accessibility'], isVerified: false },
  { id: 'lg-electronics', slug: 'tech-hub-gorakhpur', name: 'Tech Hub Gorakhpur', category: 'Electronics', floor: -1, unit: 'LG-006', description: 'Mobiles, accessories, gadgets and everyday electronics.', tags: ['Electronics', 'Mobiles', 'Gadgets'], isVerified: false },
  { id: 'lg-click-collect', slug: 'click-collect', name: 'Click & Collect', category: 'Services', floor: -1, unit: 'LG-007', description: 'Collect online orders and returns at the mall desk.', tags: ['Services', 'Logistics'], isVerified: false },
  { id: 'lg-baby-care', slug: 'baby-care-room', name: 'Baby Care Room', category: 'Facilities', floor: -1, unit: 'LG-008', description: 'Feeding, changing and quiet space for families with infants.', tags: ['Facilities', 'Family'], isVerified: false },
  { id: 'lg-fashion-outlet', slug: 'value-style-outlet', name: 'Value Style Outlet', category: 'Fashion', floor: -1, unit: 'LG-009', description: 'Everyday fashion and essentials at outlet prices.', tags: ['Fashion', 'Outlet'], isVerified: false },
  { id: 'lg-footwear-outlet', slug: 'sole-mate-outlet', name: 'Sole Mate Outlet', category: 'Footwear', floor: -1, unit: 'LG-010', description: 'Shoes, sandals and casual footwear for the whole family.', tags: ['Footwear', 'Outlet'], isVerified: false },
  { id: 'lg-accessories', slug: 'quick-accessories', name: 'Quick Accessories', category: 'Accessories', floor: -1, unit: 'LG-011', description: 'Bags, belts, wallets and small travel essentials.', tags: ['Accessories', 'Bags'], isVerified: false },
  { id: 'lg-cafe', slug: 'bean-crumb-kiosk', name: 'Bean & Crumb Kiosk', category: 'Cafe', floor: -1, unit: 'LG-012', description: 'Quick coffee, sandwiches and baked bites for shoppers on the move.', tags: ['Cafe', 'Coffee', 'Snacks'], isVerified: false },
  { id: 'lg-lockers', slug: 'parcel-lockers', name: 'Parcel Lockers', category: 'Services', floor: -1, unit: 'LG-013', description: 'Self-service parcel pickup and drop-off lockers.', tags: ['Services', 'Lockers'], isVerified: false },

  // ---------------- Ground Floor (0) ----------------
  { id: 'g-entrance', slug: 'main-entrance-plaza', name: 'Main Entrance Plaza', category: 'Facility', floor: 0, unit: 'G-000', description: 'Grand arrival atrium and main mall entrance.', tags: ['Entrance', 'Atrium'], isVerified: false },
  { id: 'g-flagship', slug: 'orion-threads', name: 'Orion Threads', category: 'Fashion', floor: 0, unit: 'G-001', description: 'Flagship fashion store with contemporary everyday and occasion wear.', tags: ['Fashion', 'Flagship'], isVerified: false },
  { id: 'g-beauty', slug: 'glow-co-beauty', name: 'Glow & Co. Beauty', category: 'Beauty', floor: 0, unit: 'G-002', description: 'Skincare, fragrance and beauty essentials in a calm setting.', tags: ['Beauty', 'Skincare', 'Fragrance'], isVerified: false },
  { id: 'g-accessories', slug: 'accessory-edit', name: 'The Accessory Edit', category: 'Accessories', floor: 0, unit: 'G-003', description: 'Curated bags, scarves, belts and small leather goods.', tags: ['Accessories', 'Bags', 'Scarves'], isVerified: false },
  { id: 'g-jewellery', slug: 'golden-hours-jewellery', name: 'Golden Hours Jewellery', category: 'Jewellery', floor: 0, unit: 'G-004', description: 'Modern keepsakes and timeless pieces for every occasion.', tags: ['Jewellery', 'Gold', 'Diamond'], isVerified: false },
  { id: 'g-info', slug: 'information-desk', name: 'Information Desk', category: 'Customer Service', floor: 0, unit: 'G-005', description: 'Mall directory, wayfinding and visitor assistance.', tags: ['Customer Service', 'Wayfinding'], isVerified: false },
  { id: 'g-restrooms', slug: 'restrooms-g', name: 'Restrooms', category: 'Facilities', floor: 0, unit: 'G-006', description: 'Accessible public restrooms near the grand atrium.', tags: ['Restrooms', 'Accessibility'], isVerified: false },
  { id: 'g-elevator', slug: 'central-elevator', name: 'Central Elevator', category: 'Facilities', floor: 0, unit: 'G-007', description: 'Visitor elevator connecting all mall floors.', tags: ['Elevator', 'Accessibility'], isVerified: false },
  { id: 'g-escalator', slug: 'escalator-f1', name: 'Escalator to First Floor', category: 'Facilities', floor: 0, unit: 'G-008', description: 'Escalator access from Ground to First Floor.', tags: ['Escalator', 'Access'], isVerified: false },
  { id: 'g-department', slug: 'orion-emporium', name: 'The Orion Emporium', category: 'Department Store', floor: 0, unit: 'G-009', description: 'Multi-brand department store spanning fashion, home and lifestyle.', tags: ['Department Store', 'Lifestyle'], isVerified: false },
  { id: 'g-footwear', slug: 'step-in-footwear', name: 'Step In Footwear', category: 'Footwear', floor: 0, unit: 'G-010', description: 'Formal, casual and festive footwear for men and women.', tags: ['Footwear', 'Shoes'], isVerified: false },
  { id: 'g-watches', slug: 'timepiece-corner', name: 'Timepiece Corner', category: 'Jewellery', floor: 0, unit: 'G-011', description: 'Watches and fine timepieces from leading brands.', tags: ['Watches', 'Accessories'], isVerified: false },
  { id: 'g-sunglasses', slug: 'shade-studio', name: 'Shade Studio', category: 'Accessories', floor: 0, unit: 'G-012', description: 'Sunglasses and eyewear for every season.', tags: ['Sunglasses', 'Eyewear'], isVerified: false },
  { id: 'g-cafe', slug: 'morning-roast-cafe', name: 'Morning Roast Café', category: 'Cafe', floor: 0, unit: 'G-013', description: 'Specialty coffee and light bites near the entrance.', tags: ['Cafe', 'Coffee'], isVerified: false },
  { id: 'g-convenience', slug: 'quick-stop-convenience', name: 'Quick Stop Convenience', category: 'Supermarket', floor: 0, unit: 'G-014', description: 'Convenience store for last-minute essentials and snacks.', tags: ['Convenience', 'Snacks'], isVerified: false },

  // ---------------- First Floor (1) ----------------
  { id: 'f1-women', slug: 'elle-co-womens-wear', name: 'Elle & Co. Women’s Wear', category: 'Fashion', floor: 1, unit: 'F1-001', description: 'Contemporary women’s clothing for work, weekends and occasions.', tags: ['Fashion', "Women's Wear"], isVerified: false },
  { id: 'f1-men', slug: 'gentlemans-edit', name: "The Gentleman's Edit", category: 'Fashion', floor: 1, unit: 'F1-002', description: "Curated men's shirts, trousers and smart-casual wardrobe staples.", tags: ['Fashion', "Men's Wear"], isVerified: false },
  { id: 'f1-kids', slug: 'little-sprouts-kids', name: 'Little Sprouts Kids', category: 'Fashion', floor: 1, unit: 'F1-003', description: 'Playful, comfortable clothing for infants and growing children.', tags: ['Fashion', "Kids' Wear"], isVerified: false },
  { id: 'f1-footwear', slug: 'stride-co', name: 'Stride & Co.', category: 'Footwear', floor: 1, unit: 'F1-004', description: 'Leather footwear, loafers and everyday shoes.', tags: ['Footwear', 'Leather'], isVerified: false },
  { id: 'f1-sports', slug: 'pace-sports-footwear', name: 'Pace Sports Footwear', category: 'Footwear', floor: 1, unit: 'F1-005', description: 'Running shoes, trainers and sportswear for active lifestyles.', tags: ['Footwear', 'Sports'], isVerified: false },
  { id: 'f1-beauty', slug: 'bloom-beauty-lounge', name: 'Bloom Beauty Lounge', category: 'Beauty', floor: 1, unit: 'F1-006', description: 'Makeup, skincare and beauty services in a relaxed lounge.', tags: ['Beauty', 'Makeup', 'Salon'], isVerified: false },
  { id: 'f1-cosmetics', slug: 'hue-cosmetics', name: 'Hue Cosmetics', category: 'Beauty', floor: 1, unit: 'F1-007', description: 'Color cosmetics, palettes and beauty tools.', tags: ['Beauty', 'Cosmetics'], isVerified: false },
  { id: 'f1-lifestyle', slug: 'living-edit', name: 'The Living Edit', category: 'Lifestyle', floor: 1, unit: 'F1-008', description: 'Home décor, candles and thoughtful lifestyle objects.', tags: ['Lifestyle', 'Home Décor'], isVerified: false },
  { id: 'f1-home', slug: 'hearth-home', name: 'Hearth & Home', category: 'Lifestyle', floor: 1, unit: 'F1-009', description: 'Kitchenware, textiles and home essentials.', tags: ['Lifestyle', 'Home'], isVerified: false },
  { id: 'f1-gift', slug: 'curated-gift', name: 'The Curated Gift', category: 'Lifestyle', floor: 1, unit: 'F1-010', description: 'Gifts, stationery and small celebrations for every occasion.', tags: ['Lifestyle', 'Gifts'], isVerified: false },
  { id: 'f1-electronics', slug: 'digital-bazaar', name: 'Digital Bazaar', category: 'Electronics', floor: 1, unit: 'F1-011', description: 'Laptops, headphones, smart devices and accessories.', tags: ['Electronics', 'Computing'], isVerified: false },
  { id: 'f1-mobile', slug: 'connect-mobile', name: 'Connect Mobile', category: 'Electronics', floor: 1, unit: 'F1-012', description: 'Mobiles, cases, chargers and network services.', tags: ['Electronics', 'Mobiles'], isVerified: false },
  { id: 'f1-watches-lux', slug: 'prestige-watches', name: 'Prestige Watches', category: 'Jewellery', floor: 1, unit: 'F1-013', description: 'Luxury watches and fine jewellery pieces.', tags: ['Jewellery', 'Luxury'], isVerified: false },
  { id: 'f1-salon', slug: 'style-chair-salon', name: 'The Style Chair Salon', category: 'Beauty', floor: 1, unit: 'F1-014', description: 'Haircuts, styling and personal grooming services.', tags: ['Beauty', 'Salon'], isVerified: false },
  { id: 'f1-restrooms', slug: 'restrooms-f1', name: 'Restrooms', category: 'Facilities', floor: 1, unit: 'F1-015', description: 'Public restrooms on the fashion promenade.', tags: ['Restrooms'], isVerified: false },

  // ---------------- Second Floor (2) ----------------
  { id: 'f2-indian', slug: 'spice-saag', name: 'Spice & Saag', category: 'Restaurant', floor: 2, unit: 'F2-001', description: 'North Indian favourites and regional thalis in a warm setting.', tags: ['Restaurant', 'Indian'], isVerified: false },
  { id: 'f2-continental', slug: 'olive-table', name: 'The Olive Table', category: 'Restaurant', floor: 2, unit: 'F2-002', description: 'Continental and Mediterranean plates for lunch and dinner.', tags: ['Restaurant', 'Continental'], isVerified: false },
  { id: 'f2-cafe', slug: 'daily-grind', name: 'The Daily Grind', category: 'Cafe', floor: 2, unit: 'F2-003', description: 'All-day café with coffee, sandwiches and salads.', tags: ['Cafe', 'Coffee'], isVerified: false },
  { id: 'f2-tea', slug: 'leaf-pot-tea-house', name: 'Leaf & Pot Tea House', category: 'Cafe', floor: 2, unit: 'F2-004', description: 'Tea blends, scones and quiet afternoon breaks.', tags: ['Cafe', 'Tea'], isVerified: false },
  { id: 'f2-foodcourt-north', slug: 'north-bites', name: 'North Bites', category: 'Food Court', floor: 2, unit: 'F2-005', description: 'Quick-service counter with street-food favourites.', tags: ['Food Court', 'Quick Bites'], isVerified: false },
  { id: 'f2-foodcourt-south', slug: 'south-street-eats', name: 'South Street Eats', category: 'Food Court', floor: 2, unit: 'F2-006', description: 'South Indian dosas, idlis and filter coffee.', tags: ['Food Court', 'South Indian'], isVerified: false },
  { id: 'f2-dessert', slug: 'sugar-spice-desserts', name: 'Sugar & Spice Desserts', category: 'Dessert', floor: 2, unit: 'F2-007', description: 'Cakes, pastries and handmade sweets.', tags: ['Dessert', 'Bakery'], isVerified: false },
  { id: 'f2-juice', slug: 'juice-junction', name: 'Juice Junction', category: 'Beverage', floor: 2, unit: 'F2-008', description: 'Fresh juices, smoothies and coolers.', tags: ['Beverage', 'Juice'], isVerified: false },
  { id: 'f2-icecream', slug: 'scoops-ice-cream', name: 'Scoops Ice Cream', category: 'Dessert', floor: 2, unit: 'F2-009', description: 'Ice cream, sundaes and milkshakes.', tags: ['Dessert', 'Ice Cream'], isVerified: false },
  { id: 'f2-bakery', slug: 'butter-crumb-bakery', name: 'Butter Crumb Bakery', category: 'Cafe', floor: 2, unit: 'F2-010', description: 'Fresh bread, cookies and artisanal bakes.', tags: ['Bakery', 'Cafe'], isVerified: false },
  { id: 'f2-lounge', slug: 'atrium-lounge', name: 'The Atrium Lounge', category: 'Restaurant', floor: 2, unit: 'F2-011', description: 'Relaxed all-day dining with views over the atrium.', tags: ['Restaurant', 'Lounge'], isVerified: false },
  { id: 'f2-work-cafe', slug: 'work-sip-cafe', name: 'Work & Sip Café', category: 'Cafe', floor: 2, unit: 'F2-012', description: 'Coffee and light meals with work-friendly seating.', tags: ['Cafe', 'Co-working'], isVerified: false },
  { id: 'f2-restrooms', slug: 'restrooms-f2', name: 'Restrooms', category: 'Facilities', floor: 2, unit: 'F2-013', description: 'Public restrooms on the dining terrace.', tags: ['Restrooms'], isVerified: false },
  { id: 'f2-elevator', slug: 'dining-elevator', name: 'Dining Floor Elevator', category: 'Facilities', floor: 2, unit: 'F2-014', description: 'Elevator access to the dining floor.', tags: ['Elevator', 'Access'], isVerified: false },
  { id: 'f2-terrace', slug: 'terrace-seating', name: 'Terrace Seating Area', category: 'Facilities', floor: 2, unit: 'F2-015', description: 'Open seating area overlooking the mall atrium.', tags: ['Seating', 'Terrace'], isVerified: false },

  // ---------------- Third Floor (3) ----------------
  { id: 'f3-cinema', slug: 'orion-multiplex', name: 'Orion Multiplex', category: 'Cinema', floor: 3, unit: 'F3-001', description: 'Multiple screens with the latest releases and comfortable seating.', tags: ['Cinema', 'Movies'], isVerified: false },
  { id: 'f3-screen-lounge', slug: 'screen-lounge', name: 'Screen Lounge', category: 'Entertainment', floor: 3, unit: 'F3-002', description: 'Pre-show lounge and bar beside the cinema.', tags: ['Entertainment', 'Lounge'], isVerified: false },
  { id: 'f3-gaming', slug: 'pixel-play-zone', name: 'Pixel Play Zone', category: 'Gaming', floor: 3, unit: 'F3-003', description: 'Arcade games, simulators and interactive play zones.', tags: ['Gaming', 'Arcade'], isVerified: false },
  { id: 'f3-bowling', slug: 'strike-lane-bowling', name: 'Strike Lane Bowling', category: 'Entertainment', floor: 3, unit: 'F3-004', description: 'Bowling lanes for families and groups.', tags: ['Entertainment', 'Bowling'], isVerified: false },
  { id: 'f3-arcade', slug: 'arcade-alley', name: 'Arcade Alley', category: 'Gaming', floor: 3, unit: 'F3-005', description: 'Classic and modern arcade machines.', tags: ['Gaming', 'Arcade'], isVerified: false },
  { id: 'f3-kids', slug: 'tiny-tots-playland', name: 'Tiny Tots Playland', category: 'Family Leisure', floor: 3, unit: 'F3-006', description: 'Soft play area for young children.', tags: ['Family Leisure', 'Kids'], isVerified: false },
  { id: 'f3-vr', slug: 'vr-realm', name: 'VR Realm', category: 'Entertainment', floor: 3, unit: 'F3-007', description: 'Virtual reality experiences and motion rides.', tags: ['Entertainment', 'VR'], isVerified: false },
  { id: 'f3-events', slug: 'events-hall', name: 'Events Hall', category: 'Events', floor: 3, unit: 'F3-008', description: 'Flexible hall for exhibitions, workshops and mall events.', tags: ['Events', 'Hall'], isVerified: false },
  { id: 'f3-cafe', slug: 'reel-roll-cafe', name: 'Reel & Roll Café', category: 'Cafe', floor: 3, unit: 'F3-009', description: 'Cinema snacks, coffee and casual bites.', tags: ['Cafe', 'Cinema'], isVerified: false },
  { id: 'f3-snack', slug: 'popcorn-co', name: 'Popcorn & Co.', category: 'Dessert', floor: 3, unit: 'F3-010', description: 'Popcorn, nachos and movie-time treats.', tags: ['Dessert', 'Snacks'], isVerified: false },
  { id: 'f3-restrooms', slug: 'restrooms-f3', name: 'Restrooms', category: 'Facilities', floor: 3, unit: 'F3-011', description: 'Public restrooms on the entertainment floor.', tags: ['Restrooms'], isVerified: false },
  { id: 'f3-elevator', slug: 'entertainment-elevator', name: 'Entertainment Floor Elevator', category: 'Facilities', floor: 3, unit: 'F3-012', description: 'Elevator access to the entertainment block.', tags: ['Elevator', 'Access'], isVerified: false },
  { id: 'f3-lockers', slug: 'cloak-locker', name: 'Cloak & Locker', category: 'Services', floor: 3, unit: 'F3-013', description: 'Cloakroom and luggage lockers for visitors.', tags: ['Services', 'Lockers'], isVerified: false },
  { id: 'f3-lounge', slug: 'lounge-seating', name: 'Lounge Seating', category: 'Facilities', floor: 3, unit: 'F3-014', description: 'Comfortable lounge seating between shows.', tags: ['Seating', 'Lounge'], isVerified: false },
  { id: 'f3-info', slug: 'entertainment-info', name: 'Entertainment Information Desk', category: 'Customer Service', floor: 3, unit: 'F3-015', description: 'Show timings, bookings and visitor help.', tags: ['Customer Service', 'Help Desk'], isVerified: false },
]

// Deterministic positions along both sides of the corridor on every floor.
// Keep service destinations beside the retail units so the central walkway stays clear.
function assignPositions(stores) {
  return stores.map((store) => {
    const floorStores = stores.filter((s) => s.floor === store.floor)
    const sameFloorIndex = floorStores.findIndex((s) => s.id === store.id)
    const side = sameFloorIndex % 2 === 0 ? -1 : 1
    const slot = Math.floor(sameFloorIndex / 2)
    const z = -12 + slot * 3.4
    const x = side * 4.4
    const y = store.floor * FLOOR_HEIGHT
    return { ...store, image: store.image ?? categoryImage[store.category], position: { x, y, z } }
  })
}

export const stores = assignPositions(baseStores)

export const findStore = (slug) => stores.find((s) => s.slug === slug)

export const storesByFloor = (floor) => stores.filter((s) => s.floor === Number(floor))

export const storesByCategory = (category) => stores.filter((s) => s.category === category)

export const categories = [
  'All',
  ...Array.from(new Set(stores.map((s) => s.category))),
]

export const searchStores = (query) => {
  const term = query.trim().toLowerCase()
  if (!term) return stores
  return stores.filter(
    (s) =>
      s.name.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term) ||
      s.tags.some((t) => t.toLowerCase().includes(term)) ||
      s.unit.toLowerCase().includes(term)
  )
}

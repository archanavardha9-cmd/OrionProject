import { floorLabel } from './floors'
export { floorLabel }

const directoryGroups = [
  {
    floor: 0,
    categories: [
      {
        name: 'Family Fashion & Apparel',
        type: 'Shopping',
        stores: [
          ['max-fashion', 'Max Fashion', 'Large-format anchor department store offering budget-friendly clothing and apparel for men, women, and kids.'],
          ['united-colors-of-benetton', 'United Colors of Benetton (UCB)', "Casual, premium western wear spanning men's, women's, and kids' collections."],
          ['being-human', 'Being Human', 'Casual lifestyle and streetwear clothing.'],
        ],
      },
      {
        name: "Premium Men's Styling",
        type: 'Shopping',
        stores: [
          ['louis-philippe', 'Louis Philippe', "High-end men's formal attire, wedding suits, and smart casuals."],
          ['colorplus', 'ColorPlus', 'Sophisticated, smart-casual wardrobe choices and tailored fits.'],
          ['van-heusen-men', 'Van Heusen (Men)', 'Sharp executive formal wear and premium office clothing.'],
        ],
      },
      {
        name: 'Electronics & Gadgets',
        type: 'Shopping',
        stores: [
          ['idelta-apple-authorized-reseller', 'iDelta (Apple Authorized Reseller)', 'Official showroom providing authorized purchase and live tech demos for iPhones, MacBooks, iPads, and original Apple accessories.'],
          ['samsung-experience-store', 'Samsung Experience Store', 'Brand outlet featuring live hands-on experiences for Galaxy smartphones, Z, S, and A series, Galaxy Watches, Buds, and high-end Galaxy Book laptops.'],
        ],
      },
    ],
  },
  {
    floor: 1,
    categories: [
      {
        name: "Men's & Casual Clothing",
        type: 'Shopping',
        stores: [
          ['allen-solly', 'Allen Solly', 'Smart casuals, vibrant office wear, and lifestyle apparel.'],
          ['peter-england', 'Peter England', "Value-driven, formal and casual men's clothing lines."],
          ['pepe-jeans-london', 'Pepe Jeans London', 'Premium denim jeans, jackets, and casual youth streetwear.'],
          ['spykar', 'Spykar', 'Edgy, youth-centric denim collections and casual fashion.'],
          ['mufti', 'Mufti', 'Expressive, alternative smart-casual shirts, trousers, and outer layers.'],
        ],
      },
      {
        name: 'Gifts, Accessories & Novelties',
        type: 'Shopping',
        stores: [
          ['miniso', 'Miniso', 'Globally recognized Korean-themed retail outlet featuring affordable home decor, innovative lifestyle items, plush toys, stationery, and beauty accessories.'],
        ],
      },
    ],
  },
  {
    floor: 2,
    categories: [
      {
        name: "Women's Ethnic & Fusion Wear",
        type: 'Shopping',
        stores: [
          ['soch', 'Soch', 'Premium ethnic gowns, traditional sarees, tunics, and dress materials.'],
          ['w', 'W', 'Contemporary, trendy ethnic fusion outfits and everyday kurtas for women.'],
          ['aurelia', 'Aurelia', 'Comfortable, everyday ethnic Indian wear and classic kurtis.'],
          ['sabhyata', 'Sabhyata', 'Deeply traditional ethnic wear, celebratory lehengas, and tailored suits.'],
          ['shree-she-is-special', 'Shree (She is Special)', 'Modern, comfort-driven ethnic choices for the everyday working woman.'],
          ['peachmode', 'Peachmode', 'High-end, designer ethnic choices and occasion wear.'],
        ],
      },
      {
        name: "Women's Western Wear & Leggings",
        type: 'Shopping',
        stores: [
          ['van-heusen-woman', 'Van Heusen Woman', 'Premium executive wear, western formals, and elite evening apparel.'],
          ['easybuy', 'EasyBuy', 'Highly economical value-fashion outlet featuring multi-category family wear.'],
          ['go-colors', 'Go Colors', 'Dedicated boutique hosting leggings, joggers, palazzo pants, and lower-wear configurations in every color imaginable.'],
        ],
      },
      {
        name: "Kids' Fashion & Gear",
        type: 'Shopping',
        stores: [
          ['mi-arcus', 'Mi Arcus', 'Premium infant boutique specializing in sustainable BCI-cotton baby clothing, bedding accessories, nursery essentials, and mother-care utilities.'],
          ['us-polo-assn-kids', 'U.S. Polo Assn. Kids', 'Sporty casuals, polo t-shirts, and everyday smart clothing for children.'],
          ['ruff', 'Ruff', "Durable, trendy, and playful kids' western wear options."],
        ],
      },
      {
        name: 'Footwear, Bags & Personal Care',
        type: 'Shopping',
        stores: [
          ['crocs', 'Crocs', 'Standalone brand store selling iconic, comfortable clogs, sandals, and customizable Jibbitz charms.'],
          ['lavie', 'Lavie', 'Luxury handbags, clutches, purses, and premium utility cases for women.'],
          ['the-jawed-habib', 'The Jawed Habib', 'Comprehensive unisex hair styling salon, luxury spa, and cosmetic care center.'],
        ],
      },
    ],
  },
  {
    floor: 3,
    categories: [
      {
        name: 'Home Decor & Essentials',
        type: 'Shopping',
        stores: [
          ['market99', 'Market99', 'Budget-friendly variety megastore filled with affordable kitchenware, dining accessories, organizational boxes, and low-cost home decor.'],
        ],
      },
      {
        name: 'Entertainment & Sports',
        type: 'Entertainment',
        stores: [
          ['fun-unlimited-india-game-zone', 'Fun Unlimited India / Game Zone', 'Massive family entertainment center hosting a professional multi-lane bowling alley, arcade simulator machines, virtual reality (VR) entertainment zones, and indoor cricket tunnels.'],
        ],
      },
      {
        name: 'Dining & Fast Food Outlets',
        type: 'Dining',
        stores: [
          ['kfc', 'KFC', 'Globally renowned quick-service fried chicken and burger combos.'],
          ['burger-king', 'Burger King', 'Globally renowned quick-service burger combos.'],
          ['dominos-pizza', "Domino's Pizza", 'Popular dine-in and takeaway pizza hub.'],
          ['subway', 'Subway', 'Health-focused customizable submarine sandwiches, salads, and wraps.'],
          ['wow-momo', 'Wow! Momo', 'Varieties of steamed, fried, and sizzler pan-Asian momos.'],
          ['dosa-plaza', 'Dosa Plaza', 'Specializing in over 100 variations of South Indian dosas and snacks.'],
          ['bikaners-kitchen', "Bikaner's Kitchen", 'Clean, quick-service Italian snacks, coffee, and traditional desserts.'],
          ['ni-hao', 'Ni Hao', 'Authentic quick-service Indo-Chinese delicacies and dumplings.'],
          ['chaat-ka-chaska', 'Chaat Ka Chaska', 'Premium street-food counter providing clean, hygienic pani puri, raj kachoris, and jalebi-rabri.'],
        ],
      },
    ],
  },
  {
    floor: 4,
    categories: [
      {
        name: 'Cinema & Entertainment',
        type: 'Entertainment',
        stores: [
          ['pvr-inox-cinemas-multiplex', 'PVR INOX Cinemas Multiplex', 'State-of-the-art multi-screen theater showing Hollywood, Bollywood, and regional screenings with luxury reclining seats.'],
        ],
      },
      {
        name: 'Cafes & Quick Bites',
        type: 'Dining',
        stores: [
          ['the-london-shakes', 'The London Shakes', 'Premium beverage counter dealing in thick milkshakes, cold coffees, and accompanying quick bites.'],
          ['devil-drink', 'Devil Drink', 'Specialty kiosk for fresh fruit mocktails, local chilled lassis, and hot kadak chai.'],
          ['rowdy-momos', 'Rowdy Momos', 'Specialized youth corner crafting trendy momo variants, Korean spicy ramyun, and bubble tea configurations.'],
        ],
      },
    ],
  },
  {
    floor: 5,
    categories: [
      {
        name: 'Fine Dining & Lounge',
        type: 'Dining',
        stores: [
          ['boombox-bar-and-cafe', 'Boombox Bar and Cafe', "The mall's premier multi-cuisine fine-dining lounge featuring a lively bar, wood-fired chimney pizzas, signature cocktails, and indoor/outdoor social seating overlooking the city landscape."],
        ],
      },
    ],
  },
]

export const stores = directoryGroups.flatMap(({ floor, categories: groups }) =>
  groups.flatMap(({ name: category, type, stores: entries }) =>
    entries.map(([slug, name, description]) => ({
      id: slug,
      slug,
      name,
      brand: name,
      floor,
      category,
      type,
      description,
    }))
  )
)

export const findStore = (slug) => stores.find((store) => store.slug === slug)

export const storesByFloor = (floor) =>
  stores.filter((store) => store.floor === Number(floor))

export const storesByCategory = (category) =>
  stores.filter((store) => store.category === category)

export const categories = ['All', ...new Set(stores.map((store) => store.category))]

export const searchStores = (query) => {
  const term = query.trim().toLocaleLowerCase()
  if (!term) return stores
  return stores.filter((store) =>
    [
      store.name,
      store.brand,
      store.category,
      store.description,
      `floor ${store.floor}`,
      `f${store.floor}`,
      floorLabel(store.floor),
    ].some((value) => value.toLocaleLowerCase().includes(term))
  )
}

import { floorLabel } from './floors'
export { floorLabel }

const directoryGroups = [
  {
    "floor": 0,
    "categories": [
      {
        "name": "Fashion & Apparel",
        "type": "Shopping",
        "stores": [
          [
            "max-fashion",
            "MAX Fashion",
            "Budget-friendly clothing and apparel."
          ],
          [
            "ucb",
            "UCB",
            "Casual, premium western wear."
          ],
          [
            "levis",
            "Levi's",
            "Denim jeans, jackets and casualwear."
          ],
          [
            "being-human",
            "Being Human",
            "Casual lifestyle and streetwear clothing."
          ]
        ]
      },
      {
        "name": "Men's Styling",
        "type": "Shopping",
        "stores": [
          [
            "van-heusen-men",
            "Van Heusen",
            "Sharp executive formal wear and premium office clothing."
          ],
          [
            "louis-philippe",
            "Louis Philippe",
            "High-end men's formal attire, wedding suits, and smart casuals."
          ],
          [
            "colorplus",
            "ColorPlus",
            "Sophisticated, smart-casual wardrobe choices and tailored fits."
          ]
        ]
      },
      {
        "name": "Electronics & Footwear",
        "type": "Shopping",
        "stores": [
          [
            "samsung-experience-store",
            "Samsung Experience Store",
            "Brand outlet for Galaxy smartphones, wearables and laptops."
          ],
          [
            "crocs",
            "Crocs",
            "Iconic, comfortable clogs, sandals and charms."
          ]
        ]
      }
    ]
  },
  {
    "floor": 1,
    "categories": [
      {
        "name": "Men's & Casual Clothing",
        "type": "Shopping",
        "stores": [
          [
            "allen-solly",
            "Allen Solly",
            "Smart casuals, vibrant office wear, and lifestyle apparel."
          ],
          [
            "peter-england",
            "Peter England",
            "Value-driven, formal and casual men's clothing lines."
          ],
          [
            "pepe-jeans-london",
            "Pepe Jeans London",
            "Premium denim jeans, jackets, and casual youth streetwear."
          ],
          [
            "spykar",
            "Spykar",
            "Edgy, youth-centric denim collections and casual fashion."
          ],
          [
            "mufti",
            "Mufti",
            "Expressive, alternative smart-casual shirts, trousers, and outer layers."
          ]
        ]
      },
      {
        "name": "Footwear",
        "type": "Shopping",
        "stores": [
          [
            "skechers",
            "Skechers",
            "Performance and lifestyle footwear for men, women and kids."
          ],
          [
            "reebok",
            "Reebok",
            "Athletic footwear, apparel and accessories."
          ]
        ]
      }
    ]
  },
  {
    "floor": 2,
    "categories": [
      {
        "name": "Women's Ethnic & Fusion Wear",
        "type": "Shopping",
        "stores": [
          [
            "soch",
            "Soch",
            "Premium ethnic gowns, traditional sarees, tunics, and dress materials."
          ],
          [
            "w",
            "W",
            "Contemporary, trendy ethnic fusion outfits and everyday kurtas for women."
          ],
          [
            "aurelia",
            "Aurelia",
            "Comfortable, everyday ethnic Indian wear and classic kurtis."
          ]
        ]
      },
      {
        "name": "Women's Western Wear",
        "type": "Shopping",
        "stores": [
          [
            "van-heusen-woman",
            "Van Heusen Woman",
            "Premium executive wear, western formals, and elite evening apparel."
          ]
        ]
      },
      {
        "name": "Kids' Fashion",
        "type": "Shopping",
        "stores": [
          [
            "us-polo-assn-kids",
            "U.S. Polo Assn. Kids",
            "Sporty casuals, polo t-shirts, and everyday smart clothing for children."
          ]
        ]
      },
      {
        "name": "Bags",
        "type": "Shopping",
        "stores": [
          [
            "lavie",
            "Lavie",
            "Luxury handbags, clutches, purses, and premium utility cases for women."
          ]
        ]
      }
    ]
  },
  {
    "floor": 3,
    "categories": [
      {
        "name": "Dining & Fast Food",
        "type": "Dining",
        "stores": [
          [
            "kfc",
            "KFC",
            "Globally renowned quick-service fried chicken and burger combos."
          ],
          [
            "burger-king",
            "Burger King",
            "Globally renowned quick-service burger combos."
          ],
          [
            "dominos-pizza",
            "Domino’s Pizza",
            "Popular dine-in and takeaway pizza hub."
          ]
        ]
      },
      {
        "name": "Personal Care",
        "type": "Shopping",
        "stores": [
          [
            "jawed-habib",
            "Jawed Habib",
            "Comprehensive unisex hair styling salon."
          ]
        ]
      }
    ]
  },
  {
    "floor": 4,
    "categories": [
      {
        "name": "Cinema",
        "type": "Entertainment",
        "stores": [
          [
            "pvr-inox",
            "PVR INOX",
            "State-of-the-art multi-screen theater."
          ]
        ]
      }
    ]
  }
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

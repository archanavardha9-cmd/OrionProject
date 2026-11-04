import 'dotenv/config'
import mongoose from 'mongoose'
import { models } from './models.js'

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required to seed sample content.')
await mongoose.connect(process.env.MONGODB_URI)

const sampleFloors = [
  { name: 'Ground Floor', number: 0, description: 'Illustrative sample floor configuration; verify before publishing.' },
  { name: 'First Floor', number: 1, description: 'Illustrative sample floor configuration; verify before publishing.' },
  { name: 'Second Floor', number: 2, description: 'Illustrative sample floor configuration; verify before publishing.' },
]
const sampleStores = [
  { name: '[Sample] The Atelier', category: 'Fashion', description: 'Sample listing — replace with confirmed store information.', floor: 0, location: 'Illustrative east wing', color: '#b98861' },
  { name: '[Sample] Form & Field', category: 'Lifestyle', description: 'Sample listing — replace with confirmed store information.', floor: 0, location: 'Illustrative west wing', color: '#788477' },
  { name: '[Sample] Maison Edit', category: 'Fashion', description: 'Sample listing — replace with confirmed store information.', floor: 1, location: 'Illustrative east wing', color: '#a88077' },
  { name: '[Sample] Glow Studio', category: 'Beauty', description: 'Sample listing — replace with confirmed store information.', floor: 1, location: 'Illustrative west wing', color: '#c4a66f' },
  { name: '[Sample] The Long Table', category: 'Dining', description: 'Sample listing — replace with confirmed restaurant information.', floor: 2, location: 'Illustrative atrium side', color: '#9e735b' },
  { name: '[Sample] Playhouse', category: 'Leisure', description: 'Sample listing — replace with confirmed amenity information.', floor: 2, location: 'Illustrative north wing', color: '#74808c' },
]
const sampleEvents = [
  { title: '[Sample] The Weekend Edit', type: 'At the atrium', description: 'Sample event — verify dates, location and details before publishing.', status: 'upcoming' },
  { title: '[Sample] Gather Around', type: 'Food & friends', description: 'Sample event — verify dates, location and details before publishing.', status: 'upcoming' },
]
const sampleOffers = [
  { title: '[Sample] Slow mornings, made better', category: 'Dining', description: 'Sample offer — terms, dates and participating venues must be confirmed.', status: 'upcoming' },
  { title: '[Sample] A fresh point of view', category: 'Fashion', description: 'Sample offer — terms and dates must be confirmed.', status: 'upcoming' },
]
const sampleServices = [
  { name: 'Mall wayfinding', description: 'Sample service information; verify the available navigation assistance.', category: 'Navigation', active: true },
  { name: 'Guest assistance', description: 'Visitor-support information to be confirmed by the mall.', category: 'Visitor support', active: true },
  { name: 'Accessibility', description: 'Accessibility details must be confirmed before publishing.', category: 'Accessibility', active: true },
  { name: 'Parking', description: 'Parking information must be confirmed before publishing.', category: 'Parking', active: true },
]

async function seed() {
  await models.mall.updateOne(
    { name: 'Orion Mall' },
    { $setOnInsert: { name: 'Orion Mall', config: { contentNotice: 'Unverified sample content only.' } } },
    { upsert: true },
  )
  for (const [Model, records, key] of [
    [models.floors, sampleFloors, 'number'],
    [models.stores, sampleStores, 'name'],
    [models.events, sampleEvents, 'title'],
    [models.offers, sampleOffers, 'title'],
    [models.services, sampleServices, 'name'],
  ]) {
    for (const record of records) {
      await Model.updateOne({ [key]: record[key] }, { $setOnInsert: record }, { upsert: true })
    }
  }
  console.log('Illustrative sample content inserted (existing content was not overwritten).')
}

try {
  await seed()
} finally {
  await mongoose.disconnect()
}

import mongoose from 'mongoose'

const { Schema, model } = mongoose

const commonOptions = { timestamps: true, versionKey: false }
const mallSchema = new Schema({
  name: { type: String, required: true, default: 'Orion Mall' },
  address: { type: String, default: '' },
  description: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  openingHours: { type: Schema.Types.Mixed, default: {} },
  socialLinks: { type: Schema.Types.Mixed, default: {} },
  config: { type: Schema.Types.Mixed, default: {} },
}, commonOptions)

const floorSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  number: { type: Number, required: true, min: -2, max: 30, unique: true },
  description: { type: String, default: '', maxlength: 1000 },
  sceneConfig: { type: Schema.Types.Mixed, default: {} },
  navigationMeta: { type: Schema.Types.Mixed, default: {} },
}, commonOptions)

const storeSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, default: '', trim: true, maxlength: 80 },
  description: { type: String, default: '', maxlength: 2000 },
  floor: { type: Number, default: 0 },
  location: { type: String, default: '', maxlength: 160 },
  logo: { type: String, default: '' },
  images: { type: [String], default: [] },
  openingHours: { type: Schema.Types.Mixed, default: {} },
  contact: { type: Schema.Types.Mixed, default: {} },
  coordinates: { type: Schema.Types.Mixed, default: {} },
  storefront: { type: Schema.Types.Mixed, default: {} },
  color: { type: String, default: '#9b8268', match: /^#[0-9a-fA-F]{6}$/ },
}, commonOptions)

const eventSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, default: '', maxlength: 3000 },
  startDate: { type: Date },
  endDate: { type: Date },
  location: { type: String, default: '', maxlength: 200 },
  floor: { type: Number },
  images: { type: [String], default: [] },
  status: { type: String, enum: ['draft', 'upcoming', 'active', 'ended'], default: 'draft' },
  type: { type: String, default: '', maxlength: 100 },
}, commonOptions)

const offerSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, default: '', maxlength: 3000 },
  store: { type: String, default: '', maxlength: 120 },
  category: { type: String, default: '', maxlength: 80 },
  startDate: { type: Date },
  endDate: { type: Date },
  promotionDetails: { type: String, default: '', maxlength: 2000 },
  status: { type: String, enum: ['draft', 'upcoming', 'active', 'ended'], default: 'draft' },
}, commonOptions)

const serviceSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', maxlength: 1500 },
  category: { type: String, default: '', maxlength: 80 },
  location: { type: String, default: '', maxlength: 200 },
  floor: { type: Number },
  active: { type: Boolean, default: true },
}, commonOptions)

const enquirySchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, default: '', trim: true, maxlength: 40 },
  category: { type: String, default: 'general', trim: true, maxlength: 80 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['new', 'in-progress', 'closed'], default: 'new' },
}, commonOptions)

const newsletterSchema = new Schema({
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, unique: true },
  subscribedAt: { type: Date, default: Date.now },
}, commonOptions)

export const models = {
  mall: model('Mall', mallSchema),
  floors: model('Floor', floorSchema),
  stores: model('Store', storeSchema),
  events: model('Event', eventSchema),
  offers: model('Offer', offerSchema),
  services: model('Service', serviceSchema),
  enquiries: model('Enquiry', enquirySchema),
  newsletter: model('NewsletterSubscription', newsletterSchema),
}

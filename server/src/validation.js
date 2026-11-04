import { z } from 'zod'

const shortText = z.string().trim().max(160)
const longText = z.string().trim().max(3000)
const flexibleObject = z.record(z.string(), z.unknown()).optional()
const imageList = z.array(z.string().max(2048)).max(30).optional()

const schemas = {
  mall: z.object({
    name: z.string().trim().min(1).max(120),
    address: z.string().trim().max(500).optional(),
    description: longText.optional(),
    contactEmail: z.string().email().max(254).or(z.literal('')).optional(),
    contactPhone: z.string().max(40).optional(),
    openingHours: flexibleObject,
    socialLinks: flexibleObject,
    config: flexibleObject,
  }).strict(),
  floors: z.object({
    name: z.string().trim().min(1).max(80),
    number: z.number().int().min(-2).max(30),
    description: z.string().trim().max(1000).optional(),
    sceneConfig: flexibleObject,
    navigationMeta: flexibleObject,
  }).strict(),
  stores: z.object({
    name: z.string().trim().min(1).max(120),
    category: shortText.optional(),
    description: longText.optional(),
    floor: z.number().min(-2).max(30).optional(),
    location: z.string().max(160).optional(),
    logo: z.string().max(2048).optional(),
    images: imageList,
    openingHours: flexibleObject,
    contact: flexibleObject,
    coordinates: flexibleObject,
    storefront: flexibleObject,
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  }).strict(),
  events: z.object({
    title: z.string().trim().min(1).max(160),
    description: longText.optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    location: z.string().max(200).optional(),
    floor: z.number().min(-2).max(30).optional(),
    images: imageList,
    status: z.enum(['draft', 'upcoming', 'active', 'ended']).optional(),
    type: z.string().max(100).optional(),
  }).strict(),
  offers: z.object({
    title: z.string().trim().min(1).max(160),
    description: longText.optional(),
    store: z.string().max(120).optional(),
    category: z.string().max(80).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    promotionDetails: z.string().max(2000).optional(),
    status: z.enum(['draft', 'upcoming', 'active', 'ended']).optional(),
  }).strict(),
  services: z.object({
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().max(1500).optional(),
    category: z.string().max(80).optional(),
    location: z.string().max(200).optional(),
    floor: z.number().min(-2).max(30).optional(),
    active: z.boolean().optional(),
  }).strict(),
  enquiries: z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().max(40).optional(),
    category: z.string().trim().max(80).optional(),
    message: z.string().trim().min(1).max(2000),
  }).strict(),
  newsletter: z.object({
    email: z.string().trim().email().max(254),
  }).strict(),
}

export function validateBody(resource, body, { partial = false } = {}) {
  const schema = schemas[resource]
  if (!schema) throw new Error('Unsupported resource.')
  const selectedSchema = partial ? schema.partial() : schema
  const parsed = selectedSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`).join('; ')
    const error = new Error(message)
    error.status = 400
    throw error
  }
  return parsed.data
}

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { models } from './models.js'
import { errorHandler, requireAdmin } from './middleware.js'
import { validateBody } from './validation.js'
import { uploadAsset, uploadsDirectory, verifyUploadedAsset } from './uploads.js'

const app = express()
const publicResources = ['floors', 'stores', 'events', 'offers', 'services']
const adminResources = [...publicResources, 'mall', 'enquiries', 'newsletter']
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('This origin is not allowed by the API CORS policy.'))
  },
}))
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
}, express.static(uploadsDirectory, { fallthrough: false, maxAge: '1d', immutable: true }))
app.use(express.json({ limit: '1mb', type: 'application/json' }))
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many enquiries from this connection. Please try again later.' },
})
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 6,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Please try again later.' },
})
const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many subscription requests. Please try again later.' },
})

app.get('/healthz', (req, res) => res.json({ status: 'ok' }))

app.get('/api/mall', async (req, res, next) => {
  try {
    const mall = await models.mall.findOne().sort({ updatedAt: -1 }).lean()
    return res.json({ data: mall })
  } catch (error) {
    return next(error)
  }
})

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

app.get('/api/:resource', async (req, res, next) => {
  const { resource } = req.params
  if (!publicResources.includes(resource)) return next()
  try {
    const Model = models[resource]
    const query = {}
    if (resource === 'events' || resource === 'offers') query.status = { $in: ['upcoming', 'active'] }
    if (resource === 'services') query.active = true
    if (req.query.category && resource === 'stores') query.category = String(req.query.category).slice(0, 80)
    if (req.query.floor && resource === 'stores') {
      const floor = Number(req.query.floor)
      if (!Number.isFinite(floor)) return res.status(400).json({ message: 'Floor must be a number.' })
      query.floor = floor
    }
    if (req.query.search) {
      const search = escapeRegex(String(req.query.search).slice(0, 80))
      query[resource === 'events' || resource === 'offers' ? 'title' : 'name'] = { $regex: search, $options: 'i' }
    }
    const page = Math.max(1, Math.min(10000, Number.parseInt(req.query.page, 10) || 1))
    const limit = Math.max(1, Math.min(100, Number.parseInt(req.query.limit, 10) || 100))
    const [data, total] = await Promise.all([
      Model.find(query).sort({ name: 1, title: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Model.countDocuments(query),
    ])
    return res.json({ data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (error) {
    return next(error)
  }
})

app.post('/api/enquiries', enquiryLimiter, async (req, res, next) => {
  try {
    const body = validateBody('enquiries', req.body)
    const enquiry = await models.enquiries.create(body)
    return res.status(201).json({ data: { id: enquiry.id, message: 'Enquiry received.' } })
  } catch (error) {
    return next(error)
  }
})

app.post('/api/newsletter', newsletterLimiter, async (req, res, next) => {
  try {
    const body = validateBody('newsletter', req.body)
    const subscription = await models.newsletter.create(body)
    return res.status(201).json({ data: { id: subscription.id, message: 'Subscription confirmed.' } })
  } catch (error) {
    return next(error)
  }
})

const adminRouter = express.Router()
adminRouter.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    const configuredEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const passwordHash = process.env.ADMIN_PASSWORD_HASH || ''
    if (!configuredEmail || !passwordHash || !process.env.JWT_SECRET) {
      return res.status(503).json({ message: 'Admin sign-in is not configured on the server.' })
    }
    const passwordMatches = await bcrypt.compare(password, passwordHash)
    if (email !== configuredEmail || !passwordMatches) {
      return res.status(401).json({ message: 'Email or password is incorrect.' })
    }
    const token = jwt.sign({ role: 'admin', email: configuredEmail }, process.env.JWT_SECRET, { expiresIn: '8h' })
    return res.json({ data: { token, expiresIn: 28800 } })
  } catch (error) {
    return next(error)
  }
})

adminRouter.use(requireAdmin)
adminRouter.post('/uploads', uploadAsset.single('file'), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: 'Choose an image or GLB file to upload.' })
  try {
    const assetPath = await verifyUploadedAsset(req.file)
    const baseUrl = (process.env.API_PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
    return res.status(201).json({ data: { url: `${baseUrl}${assetPath}` } })
  } catch (error) {
    return next(error)
  }
})
adminRouter.get('/:resource', async (req, res, next) => {
  const { resource } = req.params
  if (!adminResources.includes(resource)) return res.status(404).json({ message: 'Resource not found.' })
  try {
    const Model = models[resource]
    const data = resource === 'mall'
      ? await Model.findOne().sort({ updatedAt: -1 }).lean()
      : await Model.find().sort({ createdAt: -1 }).limit(200).lean()
    return res.json({ data })
  } catch (error) {
    return next(error)
  }
})

adminRouter.post('/:resource', async (req, res, next) => {
  const { resource } = req.params
  if (!adminResources.includes(resource)) return res.status(404).json({ message: 'Resource not found.' })
  if (resource === 'enquiries') return res.status(405).json({ message: 'Enquiries are read-only.' })
  try {
    const body = validateBody(resource, req.body)
    const record = resource === 'mall'
      ? await models.mall.findOneAndUpdate({}, body, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true })
      : await models[resource].create(body)
    return res.status(201).json({ data: record })
  } catch (error) {
    return next(error)
  }
})

adminRouter.put('/:resource/:id', async (req, res, next) => {
  const { resource, id } = req.params
  if (!adminResources.includes(resource)) return res.status(404).json({ message: 'Resource not found.' })
  if (resource === 'enquiries') return res.status(405).json({ message: 'Enquiries are read-only.' })
  try {
    const body = validateBody(resource, req.body, { partial: true })
    if (!Object.keys(body).length) return res.status(400).json({ message: 'Provide at least one field to update.' })
    const record = resource === 'mall'
      ? await models.mall.findOneAndUpdate({}, body, { new: true, upsert: true, runValidators: true })
      : await models[resource].findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!record) return res.status(404).json({ message: 'Record not found.' })
    return res.json({ data: record })
  } catch (error) {
    return next(error)
  }
})

adminRouter.delete('/:resource/:id', async (req, res, next) => {
  const { resource, id } = req.params
  if (!adminResources.includes(resource)) return res.status(404).json({ message: 'Resource not found.' })
  if (resource === 'enquiries' || resource === 'mall') return res.status(405).json({ message: 'This resource cannot be deleted here.' })
  try {
    const record = await models[resource].findByIdAndDelete(id)
    if (!record) return res.status(404).json({ message: 'Record not found.' })
    return res.json({ data: { deleted: true } })
  } catch (error) {
    return next(error)
  }
})

app.use('/api/admin', adminRouter)
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found.' }))
app.use(errorHandler)

export default app

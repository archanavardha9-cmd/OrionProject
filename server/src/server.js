import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

const port = Number(process.env.PORT) || 5000

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required to start the Orion Mall API.')
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET is required and must be at least 32 characters.')
}

await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
})

const server = app.listen(port, () => {
  console.log(`Orion Mall API listening on http://localhost:${port}`)
})

async function shutdown(signal) {
  console.log(`${signal} received; closing API server.`)
  server.close(async () => {
    await mongoose.disconnect()
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

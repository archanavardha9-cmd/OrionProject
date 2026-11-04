import jwt from 'jsonwebtoken'

export function requireAdmin(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Administrator sign-in is required.' })
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Administrator access is required.' })
    req.admin = payload
    return next()
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or has expired. Please sign in again.' })
  }
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)
  if (error.name === 'MulterError') {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'The uploaded file exceeds the 100 MB size limit.'
      : 'The uploaded file could not be accepted.'
    return res.status(status).json({ message })
  }
  if (error.code === 11000) return res.status(409).json({ message: 'A record with that unique value already exists.' })
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message })
  }
  const status = Number.isInteger(error.status) ? error.status : 500
  if (status >= 500) console.error(error)
  return res.status(status).json({
    message: status >= 500 ? 'An unexpected server error occurred.' : error.message,
  })
}

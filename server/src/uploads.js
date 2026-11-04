import { randomUUID } from 'node:crypto'
import { mkdir, open, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'

const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads')
const allowedTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['model/gltf-binary', '.glb'],
  ['application/octet-stream', '.glb'],
])

await mkdir(directory, { recursive: true })

export const uploadsDirectory = directory
export const uploadAsset = multer({
  storage: multer.diskStorage({
    destination: directory,
    filename(req, file, callback) {
      callback(null, `${randomUUID()}${allowedTypes.get(file.mimetype)}`)
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024, files: 1, fields: 0 },
  fileFilter(req, file, callback) {
    if (!allowedTypes.has(file.mimetype)) {
      const error = new Error('Upload a JPEG, PNG, WebP image or binary GLB model.')
      error.status = 400
      return callback(error)
    }
    return callback(null, true)
  },
})

export async function verifyUploadedAsset(file) {
  const handle = await open(file.path, 'r')
  const signature = Buffer.alloc(12)
  let valid
  try {
    const { bytesRead } = await handle.read(signature, 0, signature.length, 0)
    valid = file.mimetype === 'image/jpeg'
      ? bytesRead >= 3 && signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff
      : file.mimetype === 'image/png'
        ? bytesRead >= 8 && signature.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : file.mimetype === 'image/webp'
          ? bytesRead >= 12 && signature.toString('ascii', 0, 4) === 'RIFF' && signature.toString('ascii', 8, 12) === 'WEBP'
          : bytesRead >= 12 && signature.toString('ascii', 0, 4) === 'glTF' && signature.readUInt32LE(4) === 2 && signature.readUInt32LE(8) === file.size
  } finally {
    await handle.close()
  }
  if (!valid) {
    await unlink(file.path)
    const error = new Error('The uploaded file does not match an allowed image or GLB format.')
    error.status = 400
    throw error
  }
  return `/uploads/${path.basename(file.filename)}`
}

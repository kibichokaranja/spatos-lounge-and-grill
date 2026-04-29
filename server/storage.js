import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, 'data')
const dataFile = path.join(dataDir, 'forms.json')

const initialData = {
  subscriptions: [],
  bookings: [],
}

export async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(dataFile)
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(initialData, null, 2), 'utf8')
  }
}

export async function readStore() {
  await ensureStore()
  const raw = await fs.readFile(dataFile, 'utf8')
  return JSON.parse(raw)
}

export async function writeStore(data) {
  await ensureStore()
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8')
}

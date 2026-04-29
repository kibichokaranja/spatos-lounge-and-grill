import cors from 'cors'
import express from 'express'
import twilio from 'twilio'
import { ensureStore, readStore, writeStore } from './storage.js'

const app = express()
const port = globalThis.process?.env?.PORT || 4000
const DEPOSIT_RATE = 0.4
const env = globalThis.process?.env || {}
const roomOptions = [
  { code: 'deluxe-room', name: 'Deluxe Room', type: 'room', price: 15000 },
  { code: 'executive-suite', name: 'Executive Suite', type: 'room', price: 24000 },
  { code: 'family-suite', name: 'Family Suite', type: 'room', price: 28000 },
]
const serviceOptions = [
  { code: 'airport-transfer', name: 'Airport Transfer', type: 'service', price: 3500 },
  { code: 'dinner-package', name: 'Dinner Package', type: 'service', price: 4500 },
  { code: 'conference-package', name: 'Conference Package', type: 'service', price: 12000 },
]

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'spatos-forms-api' })
})

function hasDateOverlap(startA, endA, startB, endB) {
  return new Date(startA) < new Date(endB) && new Date(endA) > new Date(startB)
}

function getWhatsAppReply(message) {
  const text = String(message || '').toLowerCase()
  if (text.includes('room') || text.includes('suite')) {
    return 'Rooms: Deluxe KES 15,000, Executive Suite KES 24,000, Family Suite KES 28,000. Book at our website Book page.'
  }
  if (text.includes('deposit') || text.includes('40%') || text.includes('payment')) {
    return 'For online reservations we require a 40% deposit before confirmation.'
  }
  if (text.includes('location') || text.includes('where') || text.includes('address')) {
    return 'Spatos Lounge&Grill is located along the Bypass at Corner Estate, Nairobi.'
  }
  if (text.includes('contact') || text.includes('call') || text.includes('phone')) {
    return 'Call us on 0755 088 024 / 0738 187 465 or email spatosplace@gmail.com.'
  }
  if (text.includes('event') || text.includes('conference') || text.includes('wedding')) {
    return 'We host conferences, weddings, and private events. Share your date and we will assist planning.'
  }
  if (text.includes('dining') || text.includes('menu') || text.includes('grill')) {
    return 'Our Lounge & Grill serves Kenyan favorites and signature grill dishes daily from 6:30 AM.'
  }
  return 'Welcome to Spatos Lounge&Grill. Ask about rooms, bookings, deposit policy, events, dining, or location.'
}

function createTwilioClient() {
  const sid = env.TWILIO_ACCOUNT_SID
  const token = env.TWILIO_AUTH_TOKEN
  if (!sid || !token) {
    return null
  }
  return twilio(sid, token)
}

app.get('/booking-options', async (_req, res) => {
  const data = await readStore()
  const allResources = [...roomOptions, ...serviceOptions]
  const options = allResources.map((resource) => {
    const hasFutureBooking = data.bookings.some(
      (booking) => booking.resourceCode === resource.code && new Date(booking.checkOut) > new Date(),
    )
    return {
      ...resource,
      availability: hasFutureBooking ? 'booked' : 'available',
    }
  })
  res.json({ ok: true, options, depositRate: DEPOSIT_RATE })
})

app.get('/whatsapp/webhook', (req, res) => {
  const verifyToken = env.WHATSAPP_VERIFY_TOKEN || 'spatos-verify-token'
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === verifyToken) {
    return res.status(200).send(challenge)
  }
  return res.sendStatus(403)
})

app.post('/whatsapp/webhook', async (req, res) => {
  const incomingText = req.body.Body || req.body.message || ''
  const fromNumber = req.body.From || req.body.from
  const reply = getWhatsAppReply(incomingText)

  if (!fromNumber) {
    return res.status(400).json({ ok: false, error: 'Missing sender number' })
  }

  const client = createTwilioClient()
  const twilioFrom = env.TWILIO_WHATSAPP_NUMBER

  if (client && twilioFrom) {
    try {
      await client.messages.create({
        body: reply,
        from: twilioFrom,
        to: fromNumber,
      })
      return res.json({ ok: true, delivered: true })
    } catch {
      return res.status(502).json({ ok: false, error: 'Twilio delivery failed' })
    }
  }

  return res.json({ ok: true, delivered: false, previewReply: reply })
})

app.post('/subscriptions', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  if (!valid) {
    return res.status(400).json({ ok: false, error: 'Invalid email' })
  }

  const data = await readStore()
  if (data.subscriptions.some((item) => item.email === email)) {
    return res.status(409).json({ ok: false, error: 'Email already subscribed' })
  }

  data.subscriptions.push({
    email,
    createdAt: new Date().toISOString(),
  })
  await writeStore(data)
  return res.status(201).json({ ok: true })
})

app.post('/bookings', async (req, res) => {
  const payload = req.body || {}
  const fullName = String(payload.fullName || '').trim()
  const email = String(payload.email || '').trim().toLowerCase()
  const resourceCode = String(payload.resourceCode || '').trim()
  const checkIn = String(payload.checkIn || '')
  const checkOut = String(payload.checkOut || '')
  const requests = String(payload.requests || '')
  const totalAmount = Number(payload.totalAmount || 0)
  const depositAmount = Number(payload.depositAmount || 0)

  if (!fullName || !email || !resourceCode || !checkIn || !checkOut || !totalAmount) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' })
  }
  if (new Date(checkOut) <= new Date(checkIn)) {
    return res.status(400).json({ ok: false, error: 'Check-out must be after check-in' })
  }

  const selectedResource = [...roomOptions, ...serviceOptions].find((item) => item.code === resourceCode)
  if (!selectedResource) {
    return res.status(400).json({ ok: false, error: 'Invalid room or service selection' })
  }
  if (depositAmount < totalAmount * DEPOSIT_RATE) {
    return res.status(400).json({ ok: false, error: 'Minimum 40% deposit is required' })
  }

  const data = await readStore()
  const hasConflict = data.bookings.some(
    (booking) =>
      booking.resourceCode === resourceCode && hasDateOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut),
  )
  if (hasConflict) {
    return res.status(409).json({ ok: false, error: 'Selected room or service is unavailable for those dates' })
  }

  data.bookings.push({
    fullName,
    email,
    resourceCode,
    resourceName: selectedResource.name,
    totalAmount,
    depositAmount,
    checkIn,
    checkOut,
    requests,
    createdAt: new Date().toISOString(),
  })
  await writeStore(data)
  return res.status(201).json({ ok: true })
})

ensureStore().then(() => {
  app.listen(port, () => {
    console.log(`Spatos forms API running on port ${port}`)
  })
})

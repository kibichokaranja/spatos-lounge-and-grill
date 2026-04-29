const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

async function postJson(endpoint, payload) {
  if (!API_BASE) {
    return { ok: false, reason: 'no_api_base' }
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const body = await response.json().catch(() => ({}))
    return { ok: response.ok, status: response.status, body }
  } catch {
    return { ok: false, reason: 'network_error' }
  }
}

export async function fetchBookingOptions() {
  try {
    const response = await fetch(`${API_BASE}/booking-options`)
    if (!response.ok) {
      return { ok: false, options: [], depositRate: 0.4 }
    }
    const body = await response.json()
    return { ok: true, options: body.options || [], depositRate: body.depositRate || 0.4 }
  } catch {
    return {
      ok: false,
      options: [
        { code: 'deluxe-room', name: 'Deluxe Room', type: 'room', price: 15000, availability: 'available' },
        { code: 'executive-suite', name: 'Executive Suite', type: 'room', price: 24000, availability: 'available' },
        { code: 'family-suite', name: 'Family Suite', type: 'room', price: 28000, availability: 'available' },
      ],
      depositRate: 0.4,
    }
  }
}

export async function submitSubscription(email) {
  const normalized = email.trim().toLowerCase()
  const existingSubscriptions = JSON.parse(localStorage.getItem('spatos_subscribers') || '[]')

  if (existingSubscriptions.includes(normalized)) {
    return { ok: false, duplicate: true }
  }

  const remoteResult = await postJson('/subscriptions', { email: normalized })
  existingSubscriptions.push(normalized)
  localStorage.setItem('spatos_subscribers', JSON.stringify(existingSubscriptions))

  return { ok: true, remoteSynced: remoteResult.ok }
}

export async function submitBooking(payload) {
  const remoteResult = await postJson('/bookings', payload)
  if (!remoteResult.ok) {
    return {
      ok: false,
      remoteSynced: false,
      error: remoteResult.body?.error || 'Booking submission failed',
    }
  }
  const localBookings = JSON.parse(localStorage.getItem('spatos_bookings') || '[]')
  localBookings.push({ ...payload, createdAt: new Date().toISOString() })
  localStorage.setItem('spatos_bookings', JSON.stringify(localBookings))
  return { ok: true, remoteSynced: true }
}

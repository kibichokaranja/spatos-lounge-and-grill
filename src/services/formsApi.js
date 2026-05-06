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
        { code: 'restaurant-services', name: 'Restaurant Services', type: 'service', price: 2000, availability: 'available' },
        { code: 'bar-services', name: 'Bar Services', type: 'service', price: 1800, availability: 'available' },
        { code: 'carwash-services', name: 'Carwash Services', type: 'service', price: 1200, availability: 'available' },
        { code: 'barbershop-spa', name: 'Barbershop & Spa', type: 'service', price: 2500, availability: 'available' },
        { code: 'indoor-games', name: 'Indoor Games', type: 'service', price: 1000, availability: 'available' },
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

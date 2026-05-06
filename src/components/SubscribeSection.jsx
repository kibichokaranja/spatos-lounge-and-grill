import { useState } from 'react'
import { submitSubscription } from '../services/formsApi'

export function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const normalized = email.trim().toLowerCase()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    if (!valid) {
      setMessage('Please enter a valid email address.')
      return
    }

    const result = await submitSubscription(normalized)
    if (result.duplicate) {
      setMessage('This email is already subscribed. Thank you for staying with us.')
      return
    }

    setMessage(
      result.remoteSynced
        ? 'Thank you for subscribing. Your email was securely saved.'
        : 'Thank you for subscribing. Saved locally and ready to sync to backend.',
    )
    setEmail('')
  }

  return (
    <section className="subscribe-section">
      <div className="container subscribe-inner">
        <div>
          <p className="eyebrow">Stay Updated</p>
          <h3>Service updates from Spatos Lounge</h3>
          <p>
            Get updates on restaurant offers, bar specials, carwash slots, barbershop & spa sessions, and indoor
            games events.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="subscribe-form">
          <label htmlFor="subscribe-email" className="sr-only">
            Email Address
          </label>
          <input
            id="subscribe-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby="subscribe-feedback"
            required
          />
          <button type="submit" className="btn btn-primary">
            Subscribe
          </button>
        </form>
      </div>
      {message ? (
        <p id="subscribe-feedback" className="subscribe-message" aria-live="polite">
          {message}
        </p>
      ) : null}
    </section>
  )
}

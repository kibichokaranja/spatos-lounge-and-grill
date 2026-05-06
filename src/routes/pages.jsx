import { useEffect, useRef, useState } from 'react'
import { ActionButton } from '../components/ActionButton'
import { usePageMeta } from '../hooks/usePageMeta'
import { fetchBookingOptions, submitBooking } from '../services/formsApi'

const heroImages = {
  home: '/assets/images/home-hero.jpg',
  rooms: '/assets/images/rooms-hero.jpg',
  dining: '/assets/images/dining-hero.jpg',
  events: '/assets/images/events-hero.jpg',
  gallery: '/assets/images/gallery-hero.jpg',
  about: '/assets/images/about-hero.jpg',
  contact: '/assets/images/contact-hero.jpg',
  book: '/assets/images/book-hero.jpg',
}

const testimonials = [
  {
    quote: 'Great food, relaxing ambience, and excellent team support every time we visit.',
    author: 'Grace M., Nairobi',
  },
  {
    quote: 'From bar services to indoor games, Spatos is now our weekend go-to spot.',
    author: 'Brian K., Kiambu',
  },
]

function RevealSection({ children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
      },
      { threshold: 0.2 },
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className={`scroll-reveal ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </section>
  )
}

function PageTemplate({ title, subtitle, image, cards, cta, galleryImages, heroScroll = false, heroSlides = null }) {
  usePageMeta(`Spatos Lounge&Grill | ${title}`, subtitle)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    if (!heroScroll) {
      return undefined
    }
    const onScroll = () => setScrollOffset(window.scrollY * 0.22)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [heroScroll])

  useEffect(() => {
    if (!heroSlides || heroSlides.length < 2) {
      return undefined
    }
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 4200)
    return () => clearInterval(timer)
  }, [heroSlides])

  const currentHero = heroSlides?.[activeSlide] || null
  const heroTitle = currentHero?.title || title
  const heroSubtitle = currentHero?.subtitle || subtitle
  const heroImage = currentHero?.image || image

  return (
    <>
      <section className={`hero-section ${heroScroll ? 'hero-scroll' : ''}`}>
        <img
          key={heroImage}
          className={heroSlides?.length ? 'hero-slide-image' : ''}
          src={heroImage}
          alt={heroTitle}
          style={heroScroll ? { transform: `translateY(${scrollOffset}px)` } : {}}
        />
        <div className="hero-copy container">
          <p className="eyebrow">Spatos Lounge&Grill</p>
          <h2>{heroTitle}</h2>
          <p>{heroSubtitle}</p>
          {cta}
          {heroSlides?.length ? (
            <div className="hero-dots" role="tablist" aria-label="Homepage slides">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={index === activeSlide ? 'is-active' : ''}
                  aria-label={`Show slide ${index + 1}`}
                  aria-pressed={index === activeSlide}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <RevealSection className="content-section container">
        <div className="image-strip">
          {galleryImages.map((galleryImage) => (
            <img key={galleryImage} src={galleryImage} alt={title} />
          ))}
        </div>
        <div className="card-grid">
          {cards.map((card) => (
            <article key={card.title} className="content-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </RevealSection>
      <RevealSection className="trust-section container">
        <article className="trust-panel">
          <p className="eyebrow">Guest Trust</p>
          <h3>Trusted by local and international guests</h3>
          <p>
            4.8 average rating with consistent praise for hospitality quality, safety standards, and attentive
            guest care.
          </p>
          <div className="award-row">
            <span>Kenya Hospitality Excellence</span>
            <span>Preferred Business Stay</span>
            <span>Top Lounge Dining Pick</span>
          </div>
        </article>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.author} className="content-card">
              <p>"{item.quote}"</p>
              <p className="testimonial-author">{item.author}</p>
            </article>
          ))}
        </div>
      </RevealSection>
    </>
  )
}

export function HomePage() {
  return (
    <>
      <PageTemplate
        title="Activities At Spatos Lounge & Grill"
        subtitle="Enjoy restaurant, bar, carwash, barbershop & spa, and indoor games in one premium destination."
        image={heroImages.home}
        cta={<ActionButton to="/contact">Plan Your Visit</ActionButton>}
        heroSlides={[
          {
            title: 'Restaurant Services',
            subtitle: 'Fresh meals and signature grill options served all day in a relaxed setting.',
            image: '/assets/images/hero-restaurant.svg',
          },
          {
            title: 'Bar Services',
            subtitle: 'Premium drinks, cocktails, and lounge ambience for evening relaxation.',
            image: '/assets/images/hero-bar.svg',
          },
          {
            title: 'Carwash Services',
            subtitle: 'Fast and careful carwash while you enjoy food, drinks, or indoor activities.',
            image: '/assets/images/hero-carwash.svg',
          },
          {
            title: 'Barbershop & Spa',
            subtitle: 'Professional grooming and wellness care tailored to your schedule.',
            image: '/assets/images/hero-spa.svg',
          },
          {
            title: 'Indoor Games',
            subtitle: 'Pool table, drinking ludo, chess mat, jenga classic, lyrical correct, and do or drink.',
            image: '/assets/images/hero-games.svg',
          },
        ]}
        cards={[
          {
            title: 'Restaurant Services',
            description: 'Local and international dishes, grilled favorites, and daily specials for lunch and dinner.',
          },
          {
            title: 'Bar Services',
            description: 'Classic cocktails, premium spirits, and chilled beverages served in a vibrant lounge space.',
          },
          {
            title: 'Carwash Services',
            description: 'Exterior and interior cleaning handled by a dependable team while you relax on-site.',
          },
          {
            title: 'Barbershop & Spa',
            description: 'Haircuts, grooming, and spa treatments designed for comfort and personal style.',
          },
          {
            title: 'Indoor Games',
            description: 'Pool Table, Drinking Ludo, Chess Mat, Jenga Classic, Lyrical Correct, and Do Or Drink.',
          },
        ]}
        galleryImages={[
          '/assets/images/service-restaurant.svg',
          '/assets/images/service-bar.svg',
          '/assets/images/service-carwash.svg',
          '/assets/images/service-spa.svg',
          '/assets/images/service-games.svg',
        ]}
      />
      <RevealSection className="content-section container home-extra">
        <div className="card-grid">
          <article className="content-card">
            <h3>Food and Drink Experience</h3>
            <p>Pair restaurant favorites with bar specials for group hangouts, date nights, and casual meetups.</p>
          </article>
          <article className="content-card">
            <h3>Convenience While You Wait</h3>
            <p>Get your car cleaned or enjoy a quick grooming session while spending time in the lounge.</p>
          </article>
          <article className="content-card">
            <h3>Social Gaming Zone</h3>
            <p>Compete with friends using indoor games designed to keep the energy high and the fun going.</p>
          </article>
        </div>
      </RevealSection>
      <RevealSection className="content-section container home-extra">
        <div className="trust-panel">
          <p className="eyebrow">Why Guests Return</p>
          <h3>Five premium services in one destination</h3>
          <p>
            Spatos Lounge & Grill now focuses on restaurant, bar, carwash, barbershop & spa, and indoor games
            so every visit gives you more value and convenience in one place.
          </p>
          <ActionButton to="/contact">Contact Spatos</ActionButton>
        </div>
      </RevealSection>
    </>
  )
}

export function RoomsPage() {
  return (
    <PageTemplate
      title="Rooms & Suites"
      subtitle="Spacious accommodation designed for business leaders, couples, and family travelers."
      image={heroImages.rooms}
      cta={<ActionButton to="/book">Check Availability</ActionButton>}
      cards={[
        { title: 'Deluxe Room', description: 'King bed, smart TV, fast Wi-Fi, and ensuite rain shower.' },
        { title: 'Executive Suite', description: 'Private lounge area, city views, and premium in-room dining.' },
        { title: 'Family Suite', description: 'Expanded layout and connecting options for family comfort.' },
      ]}
      galleryImages={[
        '/assets/images/strip-1.jpg',
        '/assets/images/strip-2.jpg',
        '/assets/images/strip-3.jpg',
      ]}
    />
  )
}

export function DiningPage() {
  return (
    <PageTemplate
      title="Lounge & Grill"
      subtitle="Fine dining with Kenyan favorites, grilled specialties, and handcrafted beverages."
      image={heroImages.dining}
      cta={<ActionButton to="/contact">Reserve a Table</ActionButton>}
      cards={[
        { title: 'Breakfast Selection', description: 'Healthy starts, local teas, fresh fruits, and bakery options.' },
        { title: 'Signature Grill', description: 'Premium meats, seafood, and vegetarian grill creations.' },
        { title: 'Evening Lounge', description: 'Live ambiance, curated playlists, and chef tasting pairings.' },
      ]}
      galleryImages={[
        '/assets/images/strip-1.jpg',
        '/assets/images/strip-2.jpg',
        '/assets/images/strip-3.jpg',
      ]}
    />
  )
}

export function EventsPage() {
  return (
    <PageTemplate
      title="Events & Conferences"
      subtitle="Host business meetings, weddings, and private celebrations in elegant spaces."
      image={heroImages.events}
      cta={<ActionButton to="/contact">Plan an Event</ActionButton>}
      cards={[
        { title: 'Conference Halls', description: 'Audio-visual support, staging, and high-speed connectivity.' },
        { title: 'Wedding Packages', description: 'Venue styling, catering, and dedicated event coordination.' },
        { title: 'Corporate Catering', description: 'Custom menus for conferences, launches, and VIP receptions.' },
      ]}
      galleryImages={[
        '/assets/images/strip-1.jpg',
        '/assets/images/strip-2.jpg',
        '/assets/images/strip-3.jpg',
      ]}
    />
  )
}

export function GalleryPage() {
  return (
    <PageTemplate
      title="Gallery"
      subtitle="A visual tour of our hotel, dining, and guest experiences across Spatos spaces."
      image={heroImages.gallery}
      cta={<ActionButton to="/book">Start Your Experience</ActionButton>}
      cards={[
        { title: 'Interiors', description: 'Contemporary decor blending African warmth with premium comfort.' },
        { title: 'Guest Moments', description: 'Memorable dining and leisure moments with local hospitality.' },
        { title: 'Event Highlights', description: 'Celebrations and conferences delivered with precision and style.' },
      ]}
      galleryImages={[
        '/assets/images/strip-1.jpg',
        '/assets/images/strip-2.jpg',
        '/assets/images/strip-3.jpg',
      ]}
    />
  )
}

export function AboutPage() {
  return (
    <PageTemplate
      title="About Spatos"
      subtitle="Spatos Lounge&Grill celebrates Kenyan excellence in hospitality, service, and culinary craft."
      image={heroImages.about}
      cta={<ActionButton to="/contact">Meet Our Team</ActionButton>}
      cards={[
        { title: 'Our Vision', description: 'To become East Africa’s most trusted destination for premium stays.' },
        { title: 'Our People', description: 'A diverse Kenyan team committed to warm, professional service.' },
        { title: 'Our Promise', description: 'Consistency, elegance, and value from check-in to departure.' },
      ]}
      galleryImages={[
        '/assets/images/strip-1.jpg',
        '/assets/images/strip-2.jpg',
        '/assets/images/strip-3.jpg',
      ]}
    />
  )
}

export function ContactPage() {
  usePageMeta(
    'Spatos Lounge&Grill | Contact & Location',
    'Contact Spatos Lounge&Grill in Nairobi for bookings, dining reservations, and event support.',
  )

  return (
    <>
      <PageTemplate
        title="Contact & Location"
        subtitle="Visit us in Nairobi or connect with our front desk for reservations and concierge support."
        image={heroImages.contact}
        cta={<ActionButton to="/book">Make a Reservation</ActionButton>}
        cards={[
          { title: 'Front Desk', description: 'Call: 0755 088 024 / 0738 187 465 | Email: spatosplace@gmail.com' },
          { title: 'Address', description: 'Located along the Bypass at Corner Estate' },
          { title: 'Hours', description: 'Hotel and reception open 24/7, dining opens from 6:30 AM daily.' },
        ]}
        galleryImages={[
          '/assets/images/strip-1.jpg',
          '/assets/images/strip-2.jpg',
          '/assets/images/strip-3.jpg',
        ]}
      />
      <section className="content-section container">
        <div className="contact-actions">
          <a className="btn btn-primary" href="tel:+254755088024">
            Call Front Desk
          </a>
          <a className="btn" href="mailto:spatosplace@gmail.com">
            Email Reservations
          </a>
          <a className="btn" href="https://wa.me/254755088024" target="_blank" rel="noreferrer">
            WhatsApp Concierge
          </a>
        </div>
        <iframe
          className="map-embed"
          title="Spatos Lounge and Grill location map"
          src="https://maps.google.com/maps?q=Nairobi%20CBD&t=&z=13&ie=UTF8&iwloc=&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </>
  )
}

export function BookPage() {
  usePageMeta(
    'Spatos Lounge&Grill | Book Now',
    'Reserve your room, dining table, or event package at Spatos Lounge&Grill in Nairobi.',
  )

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    resourceCode: '',
    checkIn: '',
    checkOut: '',
    requests: '',
  })
  const [bookingOptions, setBookingOptions] = useState([])
  const [depositRate, setDepositRate] = useState(0.4)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const loadOptions = async () => {
      const result = await fetchBookingOptions()
      setBookingOptions(result.options)
      setDepositRate(result.depositRate || 0.4)
    }
    loadOptions()
  }, [])

  const selectedOption = bookingOptions.find((option) => option.code === form.resourceCode)
  const totalAmount = selectedOption?.price || 0
  const depositAmount = Math.ceil(totalAmount * depositRate)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.fullName.trim() || !form.email.trim() || !form.resourceCode || !form.checkIn || !form.checkOut) {
      setFeedback('Please complete all required booking fields.')
      return
    }
    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      setFeedback('Check-out date must be after check-in date.')
      return
    }
    const result = await submitBooking({
      ...form,
      totalAmount,
      depositAmount,
    })
    if (!result.ok) {
      setFeedback(result.error || 'Booking could not be completed. Please try different dates.')
      return
    }
    setFeedback(
      'Booking request submitted successfully. Your selected room or service is now marked unavailable for those dates.',
    )
    setForm({
      fullName: '',
      email: '',
      resourceCode: '',
      checkIn: '',
      checkOut: '',
      requests: '',
    })
  }

  return (
    <section className="content-section container booking-panel">
      <p className="eyebrow">Book Now</p>
      <h2>Reserve your Spatos experience</h2>
      <p>
        Tell us your dates and preferences. Our team will respond promptly with room options and curated
        packages.
      </p>
      <form className="booking-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <select name="resourceCode" value={form.resourceCode} onChange={handleChange} required>
          <option value="">Select room or service</option>
          {bookingOptions.map((option) => (
            <option key={option.code} value={option.code} disabled={option.availability === 'booked'}>
              {option.name} - KES {option.price.toLocaleString()} ({option.availability})
            </option>
          ))}
        </select>
        <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} required />
        <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} required />
        <textarea
          name="requests"
          placeholder="Special requests"
          value={form.requests}
          onChange={handleChange}
        ></textarea>
        <button type="submit" className="btn btn-primary">
          Submit Booking Request
        </button>
      </form>
      <div className="deposit-panel">
        <p>
          Total Amount: <strong>KES {totalAmount.toLocaleString()}</strong>
        </p>
        <p>
          Required 40% Deposit: <strong>KES {depositAmount.toLocaleString()}</strong>
        </p>
      </div>
      {feedback ? <p className="subscribe-message">{feedback}</p> : null}
      <div className="booking-links">
        <ActionButton to="/contact" className="btn">
          Speak to Reservations
        </ActionButton>
      </div>
    </section>
  )
}

export function PrivacyPage() {
  usePageMeta(
    'Spatos Lounge&Grill | Privacy Policy',
    'Read how Spatos Lounge&Grill handles guest data, booking information, and communication preferences.',
  )

  return (
    <section className="content-section container legal-page">
      <p className="eyebrow">Legal</p>
      <h2>Privacy Policy</h2>
      <p>
        We collect only the personal information needed to process bookings, communicate service updates, and
        improve guest experience. Your information is never sold and is stored with restricted access.
      </p>
      <p>
        Email subscriptions are used for offers and announcements only. You can unsubscribe anytime by
        contacting our reservations desk.
      </p>
    </section>
  )
}

export function TermsPage() {
  usePageMeta(
    'Spatos Lounge&Grill | Terms of Service',
    'Review terms for bookings, cancellations, room usage, and guest responsibilities at Spatos Lounge&Grill.',
  )

  return (
    <section className="content-section container legal-page">
      <p className="eyebrow">Legal</p>
      <h2>Terms of Service</h2>
      <p>
        Booking requests are confirmed after availability checks. Cancellations and modifications are governed
        by the selected rate conditions communicated at confirmation.
      </p>
      <p>
        Guests are expected to follow hotel safety and conduct guidelines. The hotel reserves the right to
        refuse service where required by law and security policy.
      </p>
    </section>
  )
}

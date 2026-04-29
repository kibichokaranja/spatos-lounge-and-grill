import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useLanding } from './useLanding'
import { LandingOverlay } from './LandingOverlay'
import { OfferPopup } from './OfferPopup'
import { SubscribeSection } from './SubscribeSection'
import { AIChatbot } from './AIChatbot'
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6'

const navItems = [
  ['/', 'Home'],
  ['/rooms', 'Rooms'],
  ['/dining', 'Dining'],
  ['/events', 'Events'],
  ['/gallery', 'Gallery'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
  ['/book', 'Book'],
]

export function SiteLayout() {
  const { isLandingVisible, setIsLandingVisible, setPendingPath, landingMode, setLandingMode } = useLanding()
  const navigate = useNavigate()
  const location = useLocation()
  const [showOffer, setShowOffer] = useState(false)
  const routeTransitionRef = useRef(null)
  const isRouteTransitioningRef = useRef(false)

  useEffect(() => {
    setLandingMode('initialDrop')
    setIsLandingVisible(true)
    const initialTimer = setTimeout(() => {
      setIsLandingVisible(false)
    }, 1300)

    return () => clearTimeout(initialTimer)
  }, [setIsLandingVisible, setLandingMode])

  useEffect(() => {
    return () => {
      if (routeTransitionRef.current) {
        clearTimeout(routeTransitionRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const firstVisit = sessionStorage.getItem('spatos_offer_seen')
    if (!firstVisit) {
      const offerTimer = setTimeout(() => {
        setShowOffer(true)
        sessionStorage.setItem('spatos_offer_seen', 'true')
      }, 2200)
      return () => clearTimeout(offerTimer)
    }
    return undefined
  }, [])

  const openRouteWithLanding = (path) => {
    if (path !== location.pathname && !isRouteTransitioningRef.current) {
      isRouteTransitioningRef.current = true
      setLandingMode('routeBack')
      setPendingPath(path)
      setIsLandingVisible(true)
      routeTransitionRef.current = setTimeout(() => {
        navigate(path)
        setPendingPath(null)
        setIsLandingVisible(false)
        isRouteTransitioningRef.current = false
      }, 520)
    }
  }

  return (
    <div className="site-shell">
      {isLandingVisible ? <LandingOverlay mode={landingMode} /> : null}
      {showOffer ? <OfferPopup onClose={() => setShowOffer(false)} /> : null}
      <header className="site-header">
        <div className="container nav-row nav-container">
          <div className="brand-wrap">
            <div className="brand-badge" aria-hidden="true">
              S
            </div>
            <p className="brand">Spatos Lounge&Grill</p>
          </div>
          <nav aria-label="Primary navigation">
            {navItems.map(([path, label]) => (
              <button
                key={path}
                type="button"
                className={location.pathname === path ? 'active' : ''}
                aria-current={location.pathname === path ? 'page' : undefined}
                aria-label={`Go to ${label}`}
                onClick={() => {
                  if (path !== location.pathname) {
                    openRouteWithLanding(path)
                  }
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main key={location.pathname} className="route-transition">
        <Outlet />
      </main>

      <SubscribeSection />
      <AIChatbot />
      <footer className="site-footer">
        <div className="container footer-row">
          <div>
            <p>Spatos Lounge&Grill</p>
            <p>Located along the Bypass at Corner Estate</p>
            <p>0755 088 024 / 0738 187 465 | spatosplace@gmail.com</p>
          </div>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
              <FaTiktok />
              <span className="sr-only">TikTok</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
              <FaXTwitter />
              <span className="sr-only">X</span>
            </a>
          </div>
          <div className="footer-legal">
            <button type="button" onClick={() => openRouteWithLanding('/privacy')}>
              Privacy Policy
            </button>
            <button type="button" onClick={() => openRouteWithLanding('/terms')}>
              Terms of Service
            </button>
          </div>
          <p className="copyright">© {new Date().getFullYear()} Spatos Lounge&Grill. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

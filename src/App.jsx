import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LandingProvider } from './components/LandingContext'
import { SiteLayout } from './components/SiteLayout'
import {
  AboutPage,
  BookPage,
  ContactPage,
  DiningPage,
  EventsPage,
  GalleryPage,
  HomePage,
  PrivacyPage,
  RoomsPage,
  TermsPage,
} from './routes/pages'

function App() {
  return (
    <BrowserRouter>
      <LandingProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/dining" element={<DiningPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </LandingProvider>
    </BrowserRouter>
  )
}

export default App

import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './components/Layout'
import About from './pages/About'
import Contact from './pages/Contact'
import Donate from './pages/Donate'
import EventDetail from './pages/EventDetail'
import Events from './pages/Events'
import FAQ from './pages/FAQ'
import FirstVisit from './pages/FirstVisit'
import Guidelines2026 from './pages/Guidelines2026'
import Home from './pages/Home'
import Johrei from './pages/Johrei'
import LocationDetail from './pages/LocationDetail'
import Locations from './pages/Locations'
import MeishuSama from './pages/MeishuSama'
import MeishuSamaLegacy from './pages/MeishuSamaLegacy'
import ParadiseOnEarth from './pages/ParadiseOnEarth'
import ResourceDetail from './pages/ResourceDetail'
import Resources from './pages/Resources'
import TestimonialDetail from './pages/TestimonialDetail'
import Testimonials from './pages/Testimonials'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="johrei" element={<Johrei />} />
        <Route path="meishu-sama" element={<MeishuSama />} />
        <Route path="meishu-sama/legacy" element={<MeishuSamaLegacy />} />
        <Route path="paradise-on-earth" element={<ParadiseOnEarth />} />
        <Route path="first-visit" element={<FirstVisit />} />
        <Route path="locations" element={<Locations />} />
        <Route path="locations/:id" element={<LocationDetail />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="resources" element={<Resources />} />
        <Route path="resources/:id" element={<ResourceDetail />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="testimonials/:id" element={<TestimonialDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="donate" element={<Donate />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="guidelines-2026" element={<Guidelines2026 />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App

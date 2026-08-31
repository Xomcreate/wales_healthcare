import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'

import Header from './MainComponets/Header'
import Home from './MainComponets/Home'
import Contact from './MainComponets/Contact'
import Career from './MainComponets/Career'
import HomeCare from './HomeComponets/HomeCare'
import PersonalCare from './PersonalComponets/PersonalCare'
import Dementia from './DementiaComponets/Dementia'
import Hospice from './HospiceComponets/Hospice'
import Daily from './DailySupportComponets/Daily'
import Nursing from './NursingComponets/Nursing'
import Facility from './FacilityComponets/Facility'
import Temporary from './TemporaryCoverageComponets/Temporary'
import LongTerm from './LongTermComponets/LongTerm'
import Emergency from './EmergencyComponets/Emergency'
import About from './AboutComponets/About'
import Testimonial from './TestimonialsComponets/Testimonial'
import Caregiver from './CaregiverComponets/Caregiver'
import Service from './ServiceAreaComponets/Service'
import Resources from './ResourcesComponets/Resources'
import Faq from './FaqComponets/Faq'
import Register from './MainComponets/Register'
import Login from './MainComponets/Login'
import Footer from './MainComponets/Footer'
import Consultation from './MainComponets/Consultation'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Homecare */}
        <Route path="/homecare" element={<HomeCare />} />
        <Route path="/homecare/personal-care" element={<PersonalCare/>} />
        <Route path="/homecare/dementia-care" element={<Dementia/>} />
        <Route path="/homecare/hospice-care" element={<Hospice/>} />
        <Route path="/homecare/companionship" element={<Daily/>} />
        <Route path="/homecare/nursing" element={<Nursing/>} />

        {/* Facility */}
        <Route path="/facility" element={<Facility />} />
        <Route path="facility/temporary-coverage" element={<Temporary />} />
        <Route path="facility/long-term-placement" element={<LongTerm/>} />
        <Route path="facility/emergency-staffing" element={<Emergency/>} />
             
        {/* About */}
        <Route path="/about" element={<About/>} />
        <Route path="/about/testimonials" element={<Testimonial/>} />
        <Route path="about/stories" element={<Caregiver/>} />
        <Route path="about/service-areas" element={<Service/>} />

        {/* Resource */}
        <Route path="/resources" element={<Resources/>} />
        <Route path="/resources/faq" element={<Faq/>} />

        {/* Main Pages */}
        <Route path="/careers" element={<Career />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/consultation" element={<Consultation />} />
      </Routes>

      {/* Floating Bottom-Right Consultation Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/consultation"
          className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 px-6 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-teal-500/30 backdrop-blur-md"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <span className="text-sm sm:text-base">Get a Consultation</span>
        </Link>
      </div>

      <Footer />
    </BrowserRouter>
  </StrictMode>,
)
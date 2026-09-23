import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet
} from 'react-router-dom'

import './index.css'

// ========================================
// MAIN COMPONENTS
// ========================================

import Header from './MainComponets/Header'
import Home from './MainComponets/Home'
import Contact from './MainComponets/Contact'
import Career from './MainComponets/Career'
import Register from './MainComponets/Register'
import Login from './MainComponets/Login'
import Footer from './MainComponets/Footer'
import Consultation from './MainComponets/Consultation'
import ScrollToTop from './MainComponets/ScrollToTop'
import CareerForm from './MainComponets/CareerForm'
import Privacy from './MainComponets/Privacy'


// ========================================
// HOMECARE COMPONENTS
// ========================================

import HomeCare from './HomeComponets/HomeCare'
import PersonalCare from './PersonalComponets/PersonalCare'
import Dementia from './DementiaComponets/Dementia'
import Hospice from './HospiceComponets/Hospice'
import Daily from './DailySupportComponets/Daily'
import Nursing from './NursingComponets/Nursing'


// ========================================
// FACILITY COMPONENTS
// ========================================

import Facility from './FacilityComponets/Facility'
import Temporary from './TemporaryCoverageComponets/Temporary'
import LongTerm from './LongTermComponets/LongTerm'
import Emergency from './EmergencyComponets/Emergency'


// ========================================
// ABOUT COMPONENTS
// ========================================

import About from './AboutComponets/About'
import Testimonial from './TestimonialsComponets/Testimonial'
import Caregiver from './CaregiverComponets/Caregiver'
import Service from './ServiceAreaComponets/Service'


// ========================================
// RESOURCE COMPONENTS
// ========================================

import Resources from './ResourcesComponets/Resources'
import Faq from './FaqComponets/Faq'


// ========================================
// GUIDE COMPONENTS
// ========================================

import DevelopmentalSupport from './GuideComponets/DevelopmentalSupport'
import PersonalSupportWorker from './GuideComponets/PersonalSupportWorker'
import CaregiverRole from './GuideComponets/CaregiverRole'
import Caregivertips from './GuideComponets/Caregivertips'
import IntroducingHomeCare from './GuideComponets/IntroducingHomeCare'
import FundingOptions from './GuideComponets/FundingOptions'
import MemoryLoss from './GuideComponets/MemoryLoss'
import ParentCaregiver from './GuideComponets/ParentCaregiver'
import LongTime from './GuideComponets/LongTime'
import SafeSpace from './GuideComponets/SafeSpace'
import RespiteCare from './GuideComponets/RespiteCare'
import AlzheimerGuide from './GuideComponets/AlzheimerGuide'


// ========================================
// DASHBOARDS
// ========================================

// Franchise Partner Dashboard
import FranchisePartnerPortalDashboard from './DashboardComponets/FranchisePartnerPortalDashboard'

// Head Office Dashboard
import HeadOfficePortalDashboard from './DashboardComponets/HeadOfficePortalDashboard'

// Customer Dashboard
import CustomerDashboard from './DashboardComponets/CustomerDashboard'

// Employee Dashboard
import EmployeeDashboard from './DashboardComponets/EmployeeDashboard'


// ========================================
// PROTECTED ROUTE
// ========================================

import ProtectedRoute from './MainComponets/ProtectedRoute'
import SetPassword from './MainComponets/SetPassword'
import ResetPassword from './MainComponets/ResetPassword'
import ForgotPassword from './MainComponets/ForgotPassword'


// ========================================
// PUBLIC WEBSITE LAYOUT
// ========================================

function PublicLayout() {
  return (
    <>
      <Header />

      <Outlet />

      {/* Floating Consultation Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/consultation"
          className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 px-6 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-teal-500/30 backdrop-blur-md"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />

          <span className="text-sm sm:text-base">
            Get a Consultation
          </span>
        </Link>
      </div>

      <Footer />
    </>
  )
}


// ========================================
// APP
// ========================================

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>

      {/* Automatically scroll to top whenever page changes */}
      <ScrollToTop />

      <Routes>

        {/* ========================================
            PUBLIC WEBSITE
        ======================================== */}

        <Route element={<PublicLayout />}>

          {/* Landing Page */}
          <Route
            path="/"
            element={<Home />}
          />


          {/* ========================================
              HOMECARE
          ======================================== */}

          <Route
            path="/homecare"
            element={<HomeCare />}
          />

          <Route
            path="/homecare/personal-care"
            element={<PersonalCare />}
          />

          <Route
            path="/homecare/dementia-care"
            element={<Dementia />}
          />

          <Route
            path="/homecare/hospice-care"
            element={<Hospice />}
          />

          <Route
            path="/homecare/companionship"
            element={<Daily />}
          />

          <Route
            path="/homecare/nursing"
            element={<Nursing />}
          />


          {/* ========================================
              FACILITY
          ======================================== */}

          <Route
            path="/facility"
            element={<Facility />}
          />

          <Route
            path="/facility/temporary-coverage"
            element={<Temporary />}
          />

          <Route
            path="/facility/long-term-placement"
            element={<LongTerm />}
          />

          <Route
            path="/facility/emergency-staffing"
            element={<Emergency />}
          />


          {/* ========================================
              ABOUT
          ======================================== */}

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/about/testimonials"
            element={<Testimonial />}
          />

          <Route
            path="/about/stories"
            element={<Caregiver />}
          />

          <Route
            path="/about/service-areas"
            element={<Service />}
          />


          {/* ========================================
              RESOURCES
          ======================================== */}

          <Route
            path="/resources"
            element={<Resources />}
          />

          <Route
            path="/resources/faq"
            element={<Faq />}
          />


          {/* ========================================
              GUIDES
          ======================================== */}

          <Route
            path="/guides/developmental-support"
            element={<DevelopmentalSupport />}
          />

          <Route
            path="/guides/personal-support-worker"
            element={<PersonalSupportWorker />}
          />

          <Route
            path="/guides/caregiver-role"
            element={<CaregiverRole />}
          />

          <Route
            path="/guides/caregivertips"
            element={<Caregivertips />}
          />

          <Route
            path="/guides/introducing-at-home-care"
            element={<IntroducingHomeCare />}
          />

          <Route
            path="/guides/funding-options"
            element={<FundingOptions />}
          />

          <Route
            path="/guides/memory-loss"
            element={<MemoryLoss />}
          />

          <Route
            path="/guides/parentgiver"
            element={<ParentCaregiver />}
          />

          <Route
            path="/guides/longtime"
            element={<LongTime />}
          />

          <Route
            path="/guides/safespace"
            element={<SafeSpace />}
          />

          <Route
            path="/guides/respitecare"
            element={<RespiteCare />}
          />

          <Route
            path="/guides/alzheimer-guide"
            element={<AlzheimerGuide />}
          />


          {/* ========================================
              MAIN PUBLIC PAGES
          ======================================== */}

          <Route
            path="/careers"
            element={<Career />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />

          <Route
  path="/set-password"
  element={<SetPassword />}
/>

          <Route
            path="/apply"
            element={<CareerForm />}
          />

          <Route
            path="/privacy"
            element={<Privacy />}
          />

          <Route
            path="/consultation"
            element={<Consultation />}
          />

        </Route>


        {/* ========================================
            PROTECTED DASHBOARDS
        ======================================== */}


        {/* ========================================
            FRANCHISE PARTNER DASHBOARD
        ======================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["franchise_manager"]}
            />
          }
        >
          <Route
            path="/franchise-partner-dashboard/*"
            element={<FranchisePartnerPortalDashboard />}
          />
        </Route>


        {/* ========================================
            EMPLOYEE DASHBOARD
        ======================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["employee"]}
            />
          }
        >
          <Route
            path="/employee-dashboard"
            element={<EmployeeDashboard />}
          />
        </Route>


        {/* ========================================
            HEAD OFFICE PORTAL DASHBOARD
        ======================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "head_office",
                "super_admin"
              ]}
            />
          }
        >
          <Route
            path="/head-office-portal-dashboard"
            element={<HeadOfficePortalDashboard />}
          />
        </Route>


        {/* ========================================
            CUSTOMER DASHBOARD
        ======================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["customer"]}
            />
          }
        >
          <Route
            path="/customer-dashboard"
            element={<CustomerDashboard />}
          />
        </Route>

      </Routes>

    </BrowserRouter>
  </StrictMode>
)
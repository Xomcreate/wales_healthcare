import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const NAV = [
  {
    label: 'Homecare',
    href: '/homecare',
    items: [
      { label: 'Nursing Care', href: '/homecare/nursing' },
      { label: 'Personal Care', href: '/homecare/personal-care' },
      { label: 'Dementia Care', href: '/homecare/dementia-care' },
      { label: 'Hospice / End-of-Life Care', href: '/homecare/hospice-care' },
      { label: 'Companionship / Daily Support', href: '/homecare/companionship' },
    ],
  },
  {
    label: 'Facility Care',
    href: '/facility',
    items: [
      { label: 'Temporary Coverage', href: '/facility/temporary-coverage' },
      { label: 'Long-Term Placement Support', href: '/facility/long-term-placement' },
      { label: 'Emergency Staffing', href: '/facility/emergency-staffing' },
    ],
  },
  {
    label: 'About',
    href: '/about',
    items: [
      { label: 'Family Testimonials', href: '/about/testimonials' },
      { label: 'Caregiver Stories', href: '/about/stories' },
      { label: 'Service Areas', href: '/about/service-areas' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    items: [
      { label: 'Frequently Asked Questions', href: '/resources/faq' },
    ],
  },
]

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${
        open ? 'rotate-180' : ''
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  )
}

function DesktopDropdown({ item }) {
  return (
    <div className="relative group py-2">
      <Link
        to={item.href}
        className="flex items-center text-slate-700 group-hover:text-teal-600 font-medium text-sm transition-colors"
      >
        {item.label}
        <ChevronIcon open={false} />
      </Link>

      <div className="absolute left-0 top-full w-64 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
        {item.items.map((sub) => (
          <Link
            key={sub.href}
            to={sub.href}
            className="block px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors"
          >
            {sub.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function MobileAccordionItem({
  item,
  isOpen,
  onToggle,
  setMobileMenuOpen,
  setOpenSection,
}) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <div className="flex items-center justify-between">
        <Link
          to={item.href}
          className="py-3 text-left text-sm font-semibold text-slate-800 hover:text-teal-600"
          onClick={() => {
            setOpenSection(null)
            setMobileMenuOpen(false)
          }}
        >
          {item.label}
        </Link>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={`Toggle ${item.label} submenu`}
          className="p-2 text-slate-700 hover:text-teal-600 focus:outline-none"
        >
          <ChevronIcon open={isOpen} />
        </button>
      </div>

      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isOpen
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-2 pl-3 space-y-1">
            {item.items.map((sub) => (
              <Link
                key={sub.href}
                to={sub.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-slate-600 hover:text-teal-600 transition-colors"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const navigate = useNavigate()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSection, setOpenSection] = useState(null)

  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const checkAuth = async () => {
    const accessToken = localStorage.getItem('access_token')

    if (!accessToken) {
      setUser(null)
      setAuthLoading(false)
      return
    }

    try {
      const { data } = await api.get('auth/me/')
      setUser(data)
    } catch (error) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }

      setUser(null)
    } finally {
      setAuthLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const handleAuthChanged = () => {
      checkAuth()
    }

    window.addEventListener('authChanged', handleAuthChanged)

    return () => {
      window.removeEventListener('authChanged', handleAuthChanged)
    }
  }, [])

  const getDashboardRoute = () => {
    const role = user?.role

    const ROLE_DASHBOARDS = {
      customer: '/customer-dashboard',
      employee: '/employee-dashboard',
      franchise_manager: '/franchise-partner-dashboard',
      head_office: '/head-office-portal-dashboard',
      super_admin: '/head-office-portal-dashboard',
    }

    return ROLE_DASHBOARDS[role] || '/'
  }

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')

    try {
      if (refreshToken) {
        await api.post('auth/logout/', {
          refresh: refreshToken,
        })
      }
    } catch (error) {
      // Intentionally silent.
      // Local session will still be cleared below.
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')

      setUser(null)

      closeMobileMenu()

      window.dispatchEvent(new Event('authChanged'))

      navigate('/', {
        replace: true,
      })
    }
  }

  const toggleSection = (label) => {
    setOpenSection((prev) =>
      prev === label ? null : label
    )
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setOpenSection(null)
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 font-sans shadow-xs">

      <div className="bg-slate-50 border-b border-slate-200 text-xs py-2 px-4 sm:px-6 lg:px-12 flex flex-wrap gap-y-1 justify-between items-center">

        <div className="flex items-center space-x-1.5 sm:space-x-2 text-slate-600 font-medium min-w-0">

          <svg
            className="w-3.5 h-3.5 text-teal-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a2 2 0 011.21-.502l4.493 1.498a2 2 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>

          <span className="truncate">
            <span className="hidden sm:inline">
              Need Help?{' '}
            </span>

            <a
              href="tel:09076084515"
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              09076084515
            </a>
          </span>

        </div>

        {!authLoading && (
          <>
            {user ? (
              <div className="flex items-center space-x-3 sm:space-x-4">

                <Link
                  to={getDashboardRoute()}
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  Dashboard
                </Link>

                <span className="text-slate-300">
                  |
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-slate-900 text-white px-3 sm:px-3.5 py-1 rounded-md hover:bg-slate-800 font-medium transition-colors shadow-xs whitespace-nowrap"
                >
                  Logout
                </button>

              </div>
            ) : (
              <div className="flex items-center space-x-3 sm:space-x-4">

                <Link
                  to="/login"
                  className="text-slate-600 hover:text-teal-600 font-medium transition-colors"
                >
                  Login
                </Link>

                <span className="text-slate-300">
                  |
                </span>

                <Link
                  to="/register"
                  className="bg-slate-900 text-white px-3 sm:px-3.5 py-1 rounded-md hover:bg-slate-800 font-medium transition-colors shadow-xs whitespace-nowrap"
                >
                  Register
                </Link>

              </div>
            )}
          </>
        )}

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3.5 lg:py-4 flex items-center justify-between">

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer shrink-0"
        >

          <img
            src="/walescares.png"
            alt="Wales Healthcare logo"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
          />

          <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Wales{' '}
            <span className="text-teal-600">
              Healthcare
            </span>
          </span>

        </Link>

        <nav className="hidden lg:flex items-center space-x-7">

          {NAV.map((item) => (
            <DesktopDropdown
              key={item.label}
              item={item}
            />
          ))}

          <Link
            to="/careers"
            className="text-slate-700 hover:text-teal-600 font-medium text-sm transition-colors"
          >
            Careers
          </Link>

          <Link
            to="/contact"
            className="text-slate-700 hover:text-teal-600 font-medium text-sm transition-colors"
          >
            Contact
          </Link>

        </nav>

        <div className="lg:hidden flex items-center">

          <button
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            aria-label={
              mobileMenuOpen
                ? 'Close menu'
                : 'Open menu'
            }
            aria-expanded={mobileMenuOpen}
            className="text-slate-700 hover:text-teal-600 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md p-1.5"
          >

            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >

              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}

            </svg>

          </button>

        </div>

      </div>

      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out border-t border-slate-200 ${
          mobileMenuOpen
            ? 'max-h-[80vh] overflow-y-auto'
            : 'max-h-0 border-t-0'
        }`}
      >

        <div className="px-4 sm:px-6 py-2 bg-white">

          {NAV.map((item) => (
            <MobileAccordionItem
              key={item.label}
              item={item}
              isOpen={openSection === item.label}
              onToggle={() => toggleSection(item.label)}
              setMobileMenuOpen={setMobileMenuOpen}
              setOpenSection={setOpenSection}
            />
          ))}

          <div className="py-1">

            <Link
              to="/careers"
              onClick={closeMobileMenu}
              className="block py-3 text-sm font-semibold text-slate-800 hover:text-teal-600 border-b border-slate-100"
            >
              Careers
            </Link>

            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="block py-3 text-sm font-semibold text-slate-800 hover:text-teal-600 border-b border-slate-100"
            >
              Contact
            </Link>

            {!authLoading && (
              <>
                {user ? (
                  <>

                    <Link
                      to={getDashboardRoute()}
                      onClick={closeMobileMenu}
                      className="block py-3 text-sm font-semibold text-teal-600 hover:text-teal-700 border-b border-slate-100"
                    >
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full text-left py-3 text-sm font-semibold text-slate-800 hover:text-teal-600"
                    >
                      Logout
                    </button>

                  </>
                ) : (
                  <>

                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block py-3 text-sm font-semibold text-slate-800 hover:text-teal-600 border-b border-slate-100"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="block py-3 text-sm font-semibold text-teal-600 hover:text-teal-700"
                    >
                      Register
                    </Link>

                  </>
                )}
              </>
            )}

          </div>

        </div>

      </div>

    </header>
  )
}

export default Header
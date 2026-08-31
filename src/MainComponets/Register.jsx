import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Slideshow images showcasing premium medical healthcare facilities and professional care staff
const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    title: 'Advanced Medical & Nursing Care',
    subtitle: 'Providing professional health services, specialized personal assistance, and clinical excellence directly to patients and families.',
  },
  {
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    title: 'Trusted Facility Staffing Solutions',
    subtitle: 'Connecting certified practitioners, nurses, and care specialists with high-standard medical facilities across the region.',
  },
  {
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    title: 'Compassionate Home Healthcare Support',
    subtitle: 'Dedicated daily caregiving, dementia support, and holistic health services tailored to individual needs.',
  },
]

function Register() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Standard patient/client or staff registration form state
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    accountType: 'Patient / Family Client',
    serviceInterest: 'Homecare Services',
    agreeTerms: false,
  })

  // Automatic slideshow ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Account registration successful!')
  }

  return (
    <div className="relative min-h-screen bg-white font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      
      {/* Background Animated/Stroke Heart SVG Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="outline-heart-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Hand-drawn style heart paths */}
              <path
                d="M60 35 C52 20, 25 20, 18 35 C11 50, 30 65, 60 90 C90 65, 109 50, 102 35 C95 20, 68 20, 60 35 Z"
                fill="none"
                stroke="#0d9488"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.3"
                transform="scale(0.5) translate(20, 20)"
              />
              <path
                d="M60 35 C52 20, 25 20, 18 35 C11 50, 30 65, 60 90 C90 65, 109 50, 102 35 C95 20, 68 20, 60 35 Z"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.15"
                transform="scale(0.35) translate(180, 120)"
              />
              <path
                d="M50 25 C43 12, 20 12, 14 25 C8 38, 24 50, 50 70 C76 50, 92 38, 86 25 C80 12, 57 12, 50 25 Z"
                fill="#f0fdfa"
                fillOpacity="0.6"
                stroke="#0d9488"
                strokeWidth="1.2"
                strokeOpacity="0.25"
                transform="scale(0.4) translate(80, 100)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#outline-heart-pattern)" />
        </svg>
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Image Slideshow */}
        <div className="lg:col-span-5 relative bg-slate-900 overflow-hidden flex flex-col justify-between min-h-70 lg:min-h-150">
          {SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/60 to-transparent" />
            </div>
          ))}

          {/* Spacer to maintain vertical flex layout spacing */}
          <div className="relative z-20 p-6 sm:p-8" />

          {/* Bottom Slider Text & Indicators */}
          <div className="relative z-20 p-6 sm:p-8 space-y-4">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {SLIDES[currentSlide].title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {SLIDES[currentSlide].subtitle}
              </p>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center space-x-2 pt-2">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-8 bg-teal-400' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Step Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-lg mx-auto w-full space-y-6">
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Create Account
                </h1>
                <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                  Step {step} of 2
                </span>
              </div>
              <p className="text-sm text-slate-500">
                {step === 1 
                  ? 'Enter your personal details to begin your portal account.' 
                  : 'Select your account profile and primary requirement.'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-teal-600 transition-all duration-300 ${
                  step === 1 ? 'w-1/2' : 'w-full'
                }`}
              />
            </div>

            {/* Form Body */}
            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Michael Smith"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="michael@example.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="09076084515"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Secure Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors shadow-sm text-sm"
                >
                  Continue
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Account Type
                    </label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    >
                      <option value="Patient / Family Client">Patient / Family Client</option>
                      <option value="Healthcare Professional">Healthcare Professional / Nurse</option>
                      <option value="Facility Manager">Facility Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Primary Service Interest
                    </label>
                    <select
                      name="serviceInterest"
                      value={formData.serviceInterest}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    >
                      <option value="Homecare Services">Homecare Services</option>
                      <option value="Nursing & Clinical Care">Nursing & Clinical Care</option>
                      <option value="Dementia & Special Care">Dementia & Special Care</option>
                      <option value="Facility Staffing Coverage">Facility Staffing Coverage</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    id="agreeTerms"
                    required
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-slate-600 leading-relaxed">
                    I agree to the terms of service, privacy protocols, and secure data handling guidelines.
                  </label>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-lg transition-colors text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm text-sm"
                  >
                    Complete Registration
                  </button>
                </div>
              </form>
            )}

            {/* Login Link footer inside the card */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                  Sign In here
                </Link>
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Register
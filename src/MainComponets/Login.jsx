import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Dynamic slideshow imagery for modern care environments
const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    title: 'Precision & Empathy in Care',
    subtitle: 'Access your health records, appointments, and care coordinators effortlessly.',
  },
  {
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    title: 'Advanced Professional Network',
    subtitle: 'Empowering specialized practitioners with high-security facility tools.',
  },
  {
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    title: 'Holistic Home Support Portal',
    subtitle: 'Bridging families and healthcare specialists with trust and precision.',
  },
]

function Login() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  // Slideshow automatic ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Secure authentication successful!')
  }

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      
      {/* Background Soft, Faint Hand-Drawn Heart SVG Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="login-heart-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M40 25 C35 15, 20 15, 15 25 C10 35, 20 45, 40 60 C60 45, 70 35, 65 25 C60 15, 45 15, 40 25 Z"
                fill="none"
                stroke="#0d9488"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.3"
                transform="scale(0.55) translate(20, 20)"
              />
              <path
                d="M40 25 C35 15, 20 15, 15 25 C10 35, 20 45, 40 60 C60 45, 70 35, 65 25 C60 15, 45 15, 40 25 Z"
                fill="#f0fdfa"
                fillOpacity="0.2"
                stroke="#1e293b"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.15"
                transform="scale(0.35) translate(110, 40)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-heart-pattern)" />
        </svg>
      </div>

      {/* Main Unique Floating Capsule/Card Container */}
      <div className="relative z-10 w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(13,148,136,0.12)] border border-teal-100/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Asymmetrical Immersive Slideshow */}
        <div className="lg:col-span-5 relative bg-slate-900 overflow-hidden flex flex-col justify-between min-h-75 lg:min-h-155">
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
                className="w-full h-full object-cover scale-105 transform transition-transform duration-1000 ease-out"
              />
              {/* Dynamic Duo-tone Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-teal-950/90 via-slate-950/50 to-transparent" />
            </div>
          ))}

          {/* Floating Aesthetic Tag */}
          <div className="relative z-20 p-6 sm:p-8 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-white/10 backdrop-blur-md text-teal-300 border border-white/15 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> Secure Portal
            </span>
          </div>

          {/* Bottom Slider Text & Indicators */}
          <div className="relative z-20 p-6 sm:p-8 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
                {SLIDES[currentSlide].title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-light">
                {SLIDES[currentSlide].subtitle}
              </p>
            </div>

            {/* Custom Interactive Segmented Slide Track */}
            <div className="flex items-center space-x-2 pt-2">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentSlide ? 'w-10 bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.6)]' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Unique Floating Glass Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full space-y-7">
            
            {/* Header Identity */}
            <div className="space-y-2 text-left">
              <div className="inline-block p-2 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 mb-1 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Please enter your details to access your encrypted session.
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="michael@example.com"
                    className="w-full px-4.5 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full px-4.5 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 font-medium cursor-pointer select-none">
                  Keep me logged in for 30 days
                </label>
              </div>

              {/* Unique Interactive Action Button */}
              <button
                type="submit"
                className="w-full mt-2 group relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-xl font-medium shadow-lg shadow-teal-600/20 transition-all duration-300 hover:shadow-teal-600/40 active:scale-[0.99]"
              >
                <span className="absolute inset-0 bg-linear-to-r from-teal-600 to-emerald-600 transition-all duration-300 group-hover:from-teal-500 group-hover:to-emerald-500" />
                <span className="relative w-full px-5 py-3.5 text-sm text-white font-bold tracking-wide flex items-center justify-center gap-2">
                  Sign In to Dashboard
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
              </button>
            </form>

            {/* Bottom Alternative Link */}
            <div className="text-center pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-teal-600 hover:text-teal-700 font-bold underline underline-offset-4 decoration-teal-300">
                  Create Account
                </Link>
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
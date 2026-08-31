import React, { useState } from 'react'

function Consultation() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceType: 'homecare',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="relative bg-white py-16 lg:py-24 font-sans text-slate-900 border-b border-slate-200 overflow-hidden">
      
      {/* Background Soft Faint Hand-Drawn Heart SVG Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="consult-white-heart-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
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
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#consult-white-heart-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Information */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Personalized Care Guidance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            Schedule Your Consultation
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Have questions about care options or facility staffing? Speak with our care advisors to find the ideal solution tailored to your exact situation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-200/80 shadow-xl">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">What to Expect</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our consultations are entirely confidential and pressure-free. We listen to your requirements and map out the right support pathway.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0 border border-teal-200">1</div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Needs Assessment</h4>
                  <p className="text-xs text-slate-600">We review your health or facility requirements.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0 border border-teal-200">2</div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Customized Plan</h4>
                  <p className="text-xs text-slate-600">We outline scheduling and care options.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0 border border-teal-200">3</div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Seamless Setup</h4>
                  <p className="text-xs text-slate-600">We deploy professional support rapidly.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">Need immediate assistance?</p>
              <p className="text-sm font-bold text-teal-700 mt-1">
                Call <a href="tel:09076084515" className="hover:underline">09076084515</a> or email support.
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-teal-50 border border-teal-200 text-teal-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Consultation Requested</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Thank you for reaching out to Wales Healthcare. One of our senior care advisors will review your details and contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white font-medium py-2.5 px-6 rounded-xl text-sm transition-all shadow-md cursor-pointer"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 000-0000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Support Interest</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 focus:bg-white transition-all shadow-sm cursor-pointer"
                  >
                    <option value="homecare">Home Care Services</option>
                    <option value="facility">Facility & Staffing Solutions</option>
                    <option value="emergency">Emergency / Short-Term Cover</option>
                    <option value="other">General Inquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tell Us About Your Situation</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share any specific requirements or details..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 focus:bg-white transition-all shadow-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full group relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-xl font-medium shadow-lg shadow-teal-600/20 transition-all duration-300 hover:shadow-teal-600/40 active:scale-[0.99] cursor-pointer mt-2"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-teal-600 to-emerald-600 transition-all duration-300 group-hover:from-teal-500 group-hover:to-emerald-500" />
                  <span className="relative w-full px-5 py-3.5 text-sm text-white font-bold tracking-wide flex items-center justify-center gap-2">
                    Request Free Consultation
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

export default Consultation
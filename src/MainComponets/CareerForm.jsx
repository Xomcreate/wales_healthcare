import React, { useState, useEffect } from 'react'

function CareerForm() {
  const [isInitializing, setIsInitializing] = useState(true)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    customRole: '',
    experienceYears: '1-3 years',
    availability: 'Full-Time',
    resumeFile: null,
    referralSource: 'Google Search',
    gender: 'Prefer not to say',
    coverNote: '',
    agreeTerms: false,
  })

  // Introductory Loading Screen ("Wales Healthcare Career Form Start Now")
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false)
    }, 2800)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'file' 
        ? files[0] 
        : value,
    }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Wales Healthcare Career application submitted successfully! Our HR team will review your CV and resume shortly.')
  }

  // Initializing Splash Screen Render ("Wales Healthcare Career Form Start Now")
  if (isInitializing) {
    return (
      <div className="relative min-h-screen bg-slate-900 text-white font-sans flex items-center justify-center p-4 overflow-hidden">
        {/* Background Subtle Heart Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="career-loader-heart" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path
                  d="M50 30 C43 18, 22 18, 16 30 C10 42, 26 54, 50 75 C74 54, 90 42, 84 30 C78 18, 57 18, 50 30 Z"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                  transform="scale(0.5) translate(20, 20)"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#career-loader-heart)" />
          </svg>
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-lg mx-auto px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shadow-xl shadow-teal-500/5 animate-pulse">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-teal-400 uppercase">
              Wales Healthcare
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Career Form Start Now
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Initializing secure applicant portal and submission workspace...
            </p>
          </div>

          <div className="flex items-center justify-center space-x-1.5 pt-2">
            <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2.5 h-2.5 bg-teal-300 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    )
  }

  // Main Career Form Render (No Image Split, Full Centered Professional Layout)
  return (
    <div className="relative min-h-screen bg-slate-50 font-sans flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden">
      
      {/* Background Subtle Heart Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="career-bg-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M50 30 C43 18, 22 18, 16 30 C10 42, 26 54, 50 75 C74 54, 90 42, 84 30 C78 18, 57 18, 50 30 Z"
                fill="none"
                stroke="#0d9488"
                strokeWidth="1.2"
                strokeOpacity="0.25"
                transform="scale(0.5) translate(20, 20)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#career-bg-pattern)" />
        </svg>
      </div>

      {/* Main Single-Column Form Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden p-6 sm:p-10">
        
        {/* Header Section */}
        <div className="space-y-2 pb-6 border-b border-slate-100 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                Wales Healthcare Careers
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
                Employment Application Form
              </h1>
            </div>
            <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full w-fit mx-auto sm:mx-0">
              Step {step} of 2
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {step === 1 
              ? 'Enter your contact details and specify any position you wish to apply for.' 
              : 'Upload your CV/resume and provide background details to complete your submission.'}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full bg-teal-600 transition-all duration-300 ${
                step === 1 ? 'w-1/2' : 'w-full'
              }`}
            />
          </div>
        </div>

        {/* Step 1: Contact & Position */}
        {step === 1 ? (
          <form onSubmit={handleNext} className="space-y-4 pt-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Amanda Taylor"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="amanda@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="647-555-0188"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Position Applying For * (Open to any role)
              </label>
              <input
                type="text"
                name="customRole"
                required
                value={formData.customRole}
                onChange={handleChange}
                placeholder="e.g. Personal Support Worker, Registered Nurse, Administrative Lead..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">You are not restricted to listed roles—type any job position you wish to apply for.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Years of Experience
                </label>
                <select
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                >
                  <option value="Under 1 year">Under 1 year</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Flexible / Shifts">Flexible / Shifts</option>
                  <option value="On-Call">On-Call</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm text-sm"
              >
                Continue to CV & Details
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Resume, Referral, Gender & Submission */
          <form onSubmit={handleSubmit} className="space-y-4 pt-6">
            
            {/* CV / Resume Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Upload CV & Resume * (PDF, DOC, DOCX)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-3 pb-4 px-4 text-center">
                    <svg className="w-6 h-6 mb-1.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-slate-600 font-medium">
                      {formData.resumeFile ? <span className="text-teal-700 font-semibold">{formData.resumeFile.name}</span> : 'Click to upload or drag and drop your CV / Resume'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Maximum file size 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    name="resumeFile" 
                    required 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleChange} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>

            {/* How did you hear about Staff Relief? & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  How did you hear about Staff Relief? *
                </label>
                <select
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                >
                  <option value="Google Search">Google Search</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Friend or Colleague">Friend or Colleague</option>
                  <option value="Job Board (Indeed/LinkedIn)">Job Board (Indeed / LinkedIn)</option>
                  <option value="Healthcare Event">Healthcare Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Cover Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Additional Cover Note or Message
              </label>
              <textarea
                name="coverNote"
                rows="3"
                value={formData.coverNote}
                onChange={handleChange}
                placeholder="Share anything else relevant to your application..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start space-x-3 pt-1">
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
                I confirm that my CV and submitted details are authentic and consent to background verification protocols by Wales Healthcare / Staff Relief.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3.5 rounded-xl transition-colors text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 bg-teal-600 hover:bg-teal-700 text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm text-sm"
              >
                Submit Application & Resume
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}

export default CareerForm
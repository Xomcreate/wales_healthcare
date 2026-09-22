import React, { useEffect, useMemo, useState } from 'react'

// 👉 Shared axios instance. Adjust the "../" depth to match where this file lives.
import api from '../api/axios'

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  service: '',
  message: '',
}

const EMPTY_ERRORS = { general: '', fields: {} }

// Turns a DRF error response into { general, fields: { full_name: "..." } }
function parseApiError(err, fallback) {
  const result = { general: '', fields: {} }
  const data = err?.response?.data

  if (!data) {
    result.general = err?.request
      ? 'We could not reach the server. Please check your connection and try again.'
      : fallback
    return result
  }

  if (typeof data === 'string') {
    result.general = fallback
    return result
  }

  Object.entries(data).forEach(([key, value]) => {
    const text = Array.isArray(value)
      ? value.join(' ')
      : typeof value === 'string'
      ? value
      : ''

    if (!text) return

    if (['detail', 'non_field_errors', 'message'].includes(key)) {
      result.general = text
    } else {
      result.fields[key] = text
    }
  })

  if (!result.general && Object.keys(result.fields).length === 0) {
    result.general = fallback
  }

  return result
}

const inputBase =
  'w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm'

const inputClass = (hasError) =>
  `${inputBase} ${
    hasError
      ? 'border-red-300 focus:ring-red-400/40 focus:border-red-500'
      : 'border-slate-200 focus:ring-teal-500/50 focus:border-teal-600'
  }`

function FieldError({ children }) {
  if (!children) return null
  return <p className="text-xs font-medium text-red-600">{children}</p>
}

function Consultation() {
  const [formData, setFormData] = useState(INITIAL_FORM)

  const [services, setServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [servicesError, setServicesError] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState(EMPTY_ERRORS)

  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  // Load the services customers can request a consultation for
  useEffect(() => {
    let cancelled = false

    api
      .get('/consultations/services/')
      .then((res) => {
        if (!cancelled) setServices(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        if (!cancelled) {
          setServicesError(
            "We couldn't load our services right now. Please refresh the page or try again shortly."
          )
        }
      })
      .finally(() => {
        if (!cancelled) setServicesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const selectedService = useMemo(
    () => services.find((service) => String(service.id) === String(formData.service)),
    [services, formData.service]
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear the error for the field being edited
    const serverField = { fullName: 'full_name' }[name] || name
    if (errors.fields[serverField]) {
      setErrors((prev) => ({
        ...prev,
        fields: { ...prev.fields, [serverField]: '' },
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setErrors(EMPTY_ERRORS)

    try {
      const res = await api.post('/consultations/', {
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service ? Number(formData.service) : null,
        message: formData.message.trim(),
      })

      setResult(res.data)
      setSubmitted(true)
    } catch (err) {
      setErrors(
        parseApiError(err, 'Something went wrong sending your request. Please try again.')
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData(INITIAL_FORM)
    setErrors(EMPTY_ERRORS)
    setResult(null)
    setSubmitted(false)
  }

  const noServices = !servicesLoading && !servicesError && services.length === 0

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

                {result?.reference && (
                  <p className="text-xs text-slate-500">
                    Your reference: <span className="font-bold text-slate-800">{result.reference}</span>
                    {result.confirmation_email_sent && (
                      <> — a confirmation has been sent to your email.</>
                    )}
                  </p>
                )}

                <button
                  onClick={handleReset}
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
                      className={inputClass(Boolean(errors.fields.full_name))}
                    />
                    <FieldError>{errors.fields.full_name}</FieldError>
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
                      className={inputClass(Boolean(errors.fields.phone))}
                    />
                    <FieldError>{errors.fields.phone}</FieldError>
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
                    className={inputClass(Boolean(errors.fields.email))}
                  />
                  <FieldError>{errors.fields.email}</FieldError>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Support Interest</label>
                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    disabled={servicesLoading || services.length === 0}
                    className={`${inputClass(Boolean(errors.fields.service))} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="">
                      {servicesLoading
                        ? 'Loading services…'
                        : services.length === 0
                        ? 'No services available right now'
                        : 'Select a service'}
                    </option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <FieldError>{errors.fields.service}</FieldError>

                  {selectedService?.description && (
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {selectedService.description}
                    </p>
                  )}
                  {servicesError && (
                    <p className="text-xs font-medium text-red-600">{servicesError}</p>
                  )}
                  {noServices && (
                    <p className="text-xs text-slate-500">
                      Our services are being updated. Please call us on 09076084515 and we'll be glad to help.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tell Us About Your Situation</label>
                  <textarea
                    name="message"
                    rows="4"
                    maxLength={5000}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share any specific requirements or details..."
                    className={`${inputClass(Boolean(errors.fields.message))} resize-none`}
                  />
                  <FieldError>{errors.fields.message}</FieldError>
                </div>

                {errors.general && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {errors.general}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || servicesLoading || services.length === 0}
                  className="w-full group relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-xl font-medium shadow-lg shadow-teal-600/20 transition-all duration-300 hover:shadow-teal-600/40 active:scale-[0.99] cursor-pointer mt-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-teal-600 to-emerald-600 transition-all duration-300 group-hover:from-teal-500 group-hover:to-emerald-500" />
                  <span className="relative w-full px-5 py-3.5 text-sm text-white font-bold tracking-wide flex items-center justify-center gap-2">
                    {submitting ? 'Sending…' : 'Request Free Consultation'}
                    {!submitting && (
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    )}
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
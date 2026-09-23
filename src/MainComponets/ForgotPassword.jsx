import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      await api.post('auth/forgot-password/', {
        email: email.trim().toLowerCase(),
      })

      // Always show the same success state, whether or not the
      // email is registered — the backend never reveals that.
      setSubmitted(true)

    } catch (err) {
      const responseData = err.response?.data

      setError(
        responseData?.detail ||
          (responseData
            ? Object.values(responseData).flat().join(' ')
            : null) ||
          err.message ||
          'Something went wrong. Please try again.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(13,148,136,0.12)] border border-teal-100/80 overflow-hidden p-6 sm:p-10">

        <div className="space-y-7">

          <div className="space-y-2 text-left">

            <div className="inline-block p-2 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 mb-1 shadow-inner">

              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z"
                />
              </svg>

            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Forgot your password?
            </h1>

            <p className="text-sm text-slate-500 font-medium">
              Enter the email on your account and we'll send you a link to
              reset it.
            </p>

          </div>

          {submitted ? (

            <div className="space-y-6">

              <p className="text-sm text-teal-700 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 leading-relaxed">
                If an account exists for <span className="font-semibold">{email}</span>,
                we've sent a link to reset the password. It expires in 1
                hour — check your inbox (and spam folder).
              </p>

              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-sm font-bold tracking-wide bg-linear-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 transition-all"
              >
                Back to Sign In
              </Link>

            </div>

          ) : (

            <>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="space-y-1">

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="michael@example.com"
                    className="w-full px-4.5 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 focus:bg-white transition-all shadow-sm"
                  />

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-xl font-medium shadow-lg shadow-teal-600/20 transition-all duration-300 hover:shadow-teal-600/40 active:scale-[0.99] disabled:opacity-60"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-teal-600 to-emerald-600 transition-all duration-300 group-hover:from-teal-500 group-hover:to-emerald-500" />

                  <span className="relative w-full px-5 py-3.5 text-sm text-white font-bold tracking-wide flex items-center justify-center gap-2">
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </span>
                </button>

              </form>

              <div className="text-center pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Remembered it?{' '}
                  <Link
                    to="/login"
                    className="text-teal-600 hover:text-teal-700 font-bold underline underline-offset-4 decoration-teal-300"
                  >
                    Back to Sign In
                  </Link>
                </span>
              </div>

            </>
          )}

        </div>

      </div>

    </div>
  )
}

export default ForgotPassword
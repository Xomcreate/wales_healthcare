import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.68 19.68 0 0 1 5.06-6.06M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.86 19.86 0 0 1-3.22 4.36M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  )
}

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (!token) {
      setError(
        'This reset link is missing its token. Please use the link from your email, or request a new one.'
      )
      return
    }

    setLoading(true)

    try {
      await api.post('auth/reset-password/', {
        token,
        password,
        confirm_password: confirmPassword,
      })

      navigate('/login', {
        replace: true,
        state: { justReset: true },
      })

    } catch (err) {
      const responseData = err.response?.data

      setError(
        responseData?.detail ||
          (responseData
            ? Object.values(responseData).flat().join(' ')
            : null) ||
          err.message ||
          'Could not reset your password. Please try again.'
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
              Set a new password
            </h1>

            <p className="text-sm text-slate-500 font-medium">
              Choose a new password for your account below.
            </p>

          </div>

          {!token && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              No reset token found in this link. Please open the link from
              your email again, or{' '}
              <Link to="/forgot-password" className="underline font-semibold">
                request a new one
              </Link>
              .
            </p>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1">

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                New Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4.5 py-3 pr-11 text-sm bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 focus:bg-white transition-all shadow-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>

              </div>

            </div>

            <div className="space-y-1">

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Confirm New Password
              </label>

              <div className="relative">

                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4.5 py-3 pr-11 text-sm bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-600 focus:bg-white transition-all shadow-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full mt-2 group relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-xl font-medium shadow-lg shadow-teal-600/20 transition-all duration-300 hover:shadow-teal-600/40 active:scale-[0.99] disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-linear-to-r from-teal-600 to-emerald-600 transition-all duration-300 group-hover:from-teal-500 group-hover:to-emerald-500" />

              <span className="relative w-full px-5 py-3.5 text-sm text-white font-bold tracking-wide flex items-center justify-center gap-2">
                {loading ? 'Resetting…' : 'Reset Password'}
              </span>
            </button>

          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              <Link
                to="/login"
                className="text-teal-600 hover:text-teal-700 font-bold underline underline-offset-4 decoration-teal-300"
              >
                Back to Sign In
              </Link>
            </span>
          </div>

        </div>

      </div>

    </div>
  )
}

export default ResetPassword
import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaArrowLeft,
  FaShieldAlt
} from 'react-icons/fa'
import api from '../api/axios'

function SetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (!token) {
      setError(
        'This password setup link is missing or invalid. Please use the link from your email.'
      )
      return
    }

    if (!password) {
      setError('Please enter a password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

      await api.post('auth/set-password/', {
        token,
        password,
        confirm_password: confirmPassword
      })

      setSuccess(true)

      setTimeout(() => {
        navigate('/login', {
          state: {
            passwordSet: true
          }
        })
      }, 1800)

    } catch (err) {
      console.error('Set password error:', err)

      const responseData = err?.response?.data

      if (responseData?.password) {
        setError(
          Array.isArray(responseData.password)
            ? responseData.password.join(' ')
            : responseData.password
        )
      } else if (responseData?.confirm_password) {
        setError(
          Array.isArray(responseData.confirm_password)
            ? responseData.confirm_password.join(' ')
            : responseData.confirm_password
        )
      } else if (responseData?.detail) {
        setError(responseData.detail)
      } else {
        setError(
          'Unable to set your password right now. Please try again.'
        )
      }

    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // SUCCESS SCREEN
  // ==========================================

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">

        <div className="w-full max-w-md">

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center">

            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center">
              <FaCheckCircle className="text-teal-600 text-5xl" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Password Created
            </h1>

            <p className="text-slate-600 leading-relaxed mb-6">
              Your employee account password has been successfully created.
              You can now log in to your Wales Healthcare account.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Redirecting you to login...
            </div>

          </div>

        </div>
      </div>
    )
  }

  // ==========================================
  // SET PASSWORD SCREEN
  // ==========================================

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-teal-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Back to website */}

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 transition-colors mb-6"
        >
          <FaArrowLeft />
          Back to website
        </Link>


        {/* Card */}

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

          {/* Header */}

          <div className="bg-linear-to-r from-teal-700 to-teal-600 px-6 sm:px-8 py-8 text-white">

            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-5">
              <FaLock className="text-2xl" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Set Your Password
            </h1>

            <p className="text-teal-50 text-sm sm:text-base leading-relaxed">
              Create a secure password for your Wales Healthcare employee
              account.
            </p>

          </div>


          {/* Form */}

          <div className="p-6 sm:p-8">

            {/* Security message */}

            <div className="flex gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">

              <div className="shrink-0 mt-0.5">
                <FaShieldAlt className="text-teal-600" />
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your password should be strong and unique. This setup link is
                temporary and can only be used once.
              </p>

            </div>


            {/* Error */}

            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm leading-relaxed">
                {error}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Password */}

              <div>

                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  New Password
                </label>

                <div className="relative">

                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <FaLock />
                  </div>

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>

                </div>

              </div>


              {/* Confirm Password */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <FaLock />
                  </div>

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>


              {/* Submit */}

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-lg shadow-teal-600/20 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Creating Password...' : 'Create Password'}
              </button>

            </form>


            {/* Login */}

            <div className="text-center mt-6 pt-6 border-t border-slate-100">

              <p className="text-sm text-slate-500">
                Already have your password?
              </p>

              <Link
                to="/login"
                className="inline-block mt-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                Go to Login
              </Link>

            </div>

          </div>

        </div>


        {/* Footer text */}

        <p className="text-center text-xs text-slate-400 mt-6">
          Wales Healthcare · Secure Employee Account Setup
        </p>

      </div>

    </div>
  )
}

export default SetPassword
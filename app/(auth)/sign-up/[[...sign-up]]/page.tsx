"use client"

import { useState } from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [verifying, setVerifying] = useState(false)

  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState("") // <-- signup error
  const [verifyError, setVerifyError] = useState("")   // <-- verify error

  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  // validate email
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(value)) setEmailError("Invalid email format")
    else setEmailError("")
  }

  // validate password
  const validatePassword = (value: string) => {
    if (value.length < 8) setPasswordError("Password must be at least 8 characters")
    else setPasswordError("")
  }

  // ---------------- HANDLE SIGNUP ---------------- 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError("") // clear error
    setIsLoading(true)

    validateEmail(emailAddress)
    validatePassword(password)

    if (emailError || passwordError) {
      setIsLoading(false)
      return
    }

    if (!isLoaded) return

    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      })

      setVerifying(true)
      setIsLoading(false)
    } catch (err: any) {
      console.log(err)

      // --- show clerk error ---
      setGeneralError(err?.errors?.[0]?.message || "Something went wrong")

      setIsLoading(false)
    }
  }

  // ---------------- HANDLE VERIFY ---------------- 
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifyError("") // clear
    setIsLoading(true)

    try {
      if (!signUp) throw new Error("SignUp object is not loaded")
      const attempt = await signUp.attemptEmailAddressVerification({ code })

      if (attempt.status === "complete") {
        if (!setActive) throw new Error("setActive function is not loaded")
        await setActive({ session: attempt.createdSessionId })
      }
    } catch (err: any) {
      console.log(err)

      // Show the specific Clerk error if available, otherwise generic message
      setVerifyError(err?.errors?.[0]?.message || "Invalid code")

      setIsLoading(false)
      return
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#00B4D8', animationDuration: '6s' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#0077B6', animationDuration: '8s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full opacity-5 animate-float" style={{ backgroundColor: '#FFDD00', animationDuration: '7s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* ---------------- SIGNUP ---------------- */}
        {!verifying && (
          <>
            {/* Decorative header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 transform hover:scale-110 transition-transform" style={{ backgroundColor: '#FFDD00' }}>
                <svg className="w-10 h-10" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-3" style={{ color: '#222222' }}>
                Join Us! 🎉
              </h1>
              <p className="text-lg" style={{ color: '#222222', opacity: 0.7 }}>
                Create your account and let's get started
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-4 space-y-6"
              style={{ borderColor: '#00B4D8' }}
            >
              {generalError && (
                <div className="p-4 rounded-xl border-2 animate-shake" style={{ backgroundColor: '#FFDD00', borderColor: '#FFDD00', color: '#222222' }}>
                  <p className="text-sm font-medium">{generalError}</p>
                </div>
              )}

              {/* username */}
              <div className="space-y-2">
                <label className="flex text-sm font-semibold items-center gap-2" style={{ color: '#0077B6' }}>
                  <span>👤</span> Username
                </label>
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.02]"
                  style={{
                    borderColor: '#00B4D8',
                    backgroundColor: '#FAFAFA',
                    color: '#222222',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0077B6'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 119, 182, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#00B4D8'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="Choose a username"
                />
              </div>

              {/* email */}
              <div className="space-y-2">
                <label className="flex text-sm font-semibold items-center gap-2" style={{ color: '#0077B6' }}>
                  <span>📧</span> Email
                </label>
                <input
                  required
                  value={emailAddress}
                  onChange={(e) => {
                    setEmailAddress(e.target.value)
                    validateEmail(e.target.value)
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.02]"
                  style={{
                    borderColor: emailError ? '#FF0000' : '#00B4D8',
                    backgroundColor: '#FAFAFA',
                    color: '#222222',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0077B6'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 119, 182, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = emailError ? '#FF0000' : '#00B4D8'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="you@example.com"
                />
                {emailError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠️</span> {emailError}
                </p>}
              </div>

              {/* password */}
              <div className="space-y-2">
                <label className="flex text-sm font-semibold items-center gap-2" style={{ color: '#0077B6' }}>
                  <span>🔒</span> Password
                </label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    validatePassword(e.target.value)
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.02]"
                  style={{
                    borderColor: passwordError ? '#FF0000' : '#00B4D8',
                    backgroundColor: '#FAFAFA',
                    color: '#222222',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0077B6'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 119, 182, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = passwordError ? '#FF0000' : '#00B4D8'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="Create a strong password"
                />
                {passwordError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠️</span> {passwordError}
                </p>}
              </div>

              {/* button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold py-4 px-6 rounded-xl duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                style={{
                  backgroundColor: isLoading ? '#00B4D8' : '#0077B6',
                  color: 'white',
                  opacity: isLoading ? 0.9 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#00B4D8'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#0077B6'
                  }
                }}
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                      <span className="text-xl animate-pulse">⏳</span>
                    </>
                  ) : (
                    <>
                      Sign Up
                      <span className="text-xl">✨</span>
                    </>
                  )}
                </span>
              </button>

              <p className="text-center text-sm" style={{ color: '#222222', opacity: 0.7 }}>
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold hover:underline transition-all"
                  style={{ color: '#0077B6' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#00B4D8'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#0077B6'
                  }}
                >
                  Sign in
                </Link>
              </p>
            </form>
          </>
        )}

        {/* ---------------- VERIFY ---------------- */}
        {verifying && (
          <>
            {/* Decorative header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 transform hover:scale-110 transition-transform" style={{ backgroundColor: '#FFDD00' }}>
                <svg className="w-10 h-10" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-3" style={{ color: '#222222' }}>
                Check Your Email! 📬
              </h1>
              <p className="text-lg" style={{ color: '#222222', opacity: 0.7 }}>
                Enter the verification code we sent you
              </p>
            </div>

            <form
              onSubmit={handleVerify}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-4 space-y-6"
              style={{ borderColor: '#00B4D8' }}
            >
              {verifyError && (
                <div className="p-4 rounded-xl border-2 animate-shake" style={{ backgroundColor: '#FFDD00', borderColor: '#FFDD00', color: '#222222' }}>
                  <p className="text-sm font-medium">{verifyError}</p>
                </div>
              )}

              {/* code */}
              <div className="space-y-2">
                <label className="flex text-sm font-semibold items-center gap-2" style={{ color: '#0077B6' }}>
                  <span>🔑</span> Verification Code
                </label>
                <input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.02] text-center text-2xl font-bold tracking-widest"
                  style={{
                    borderColor: '#00B4D8',
                    backgroundColor: '#FAFAFA',
                    color: '#222222',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0077B6'
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 119, 182, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#00B4D8'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold py-4 px-6 rounded-xl duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                style={{
                  backgroundColor: isLoading ? '#00B4D8' : '#0077B6',
                  color: 'white',
                  opacity: isLoading ? 0.9 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#00B4D8'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#0077B6'
                  }
                }}
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                      <span className="text-xl animate-pulse">⏳</span>
                    </>
                  ) : (
                    <>
                      Verify & Continue
                      <span className="text-xl">✅</span>
                    </>
                  )}
                </span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

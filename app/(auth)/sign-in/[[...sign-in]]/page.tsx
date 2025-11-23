"use client"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState("")
  const router = useRouter()

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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError("") // clear error
    setLoading(true)

    validateEmail(email)
    validatePassword(password)

    if (emailError || passwordError) {
      setLoading(false)
      return
    }

    if (!isLoaded) return

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
      }
    } catch (err: any) {
      // Try to extract error message safely
      const errorMsg =
        (err &&
          typeof err === "object" &&
          "errors" in err &&
          Array.isArray((err as any).errors) &&
          (err as any).errors[0]?.message) ||
        err?.message ||
        "Something went wrong";
      setGeneralError(errorMsg);
      console.log(err); // debug
    }

    setLoading(false);
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
        {/* Decorative header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 transform hover:scale-110 transition-transform" style={{ backgroundColor: '#FFDD00' }}>
            <svg className="w-10 h-10" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#222222' }}>
            Welcome Back! 👋
          </h1>
          <p className="text-lg" style={{ color: '#222222', opacity: 0.7 }}>
            Sign in to continue your journey
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

          {/* email */}
          <div className="space-y-2">
            <label className="flex text-sm font-semibold items-center gap-2" style={{ color: '#0077B6' }}>
              <span>📧</span> Email
            </label>
            <input
              value={email}
              required
              onChange={(e) => {
                setEmail(e.target.value)
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
              type="password"
              required
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
              placeholder="Enter your password"
            />
            {passwordError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span>⚠️</span> {passwordError}
            </p>}
          </div>

          {/* sign in button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold py-4 px-6 rounded-xl duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
            style={{
              backgroundColor: loading ? '#00B4D8' : '#0077B6',
              color: 'white',
              opacity: loading ? 0.9 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#00B4D8'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#0077B6'
              }
            }}
          >
            {loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                  <span className="text-xl animate-pulse">⏳</span>
                </>
              ) : (
                <>
                  Sign In
                  <span className="text-xl">🚀</span>
                </>
              )}
            </span>
          </button>

          <p className="text-center text-sm" style={{ color: '#222222', opacity: 0.7 }}>
            Don't have an account?{" "}
            <a
              href="/sign-up"
              className="font-semibold hover:underline transition-all"
              style={{ color: '#0077B6' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00B4D8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#0077B6'
              }}
            >
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

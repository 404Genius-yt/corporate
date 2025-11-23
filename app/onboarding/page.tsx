'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'

export default function OnboardingComponent() {
  const [error, setError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [resumeFileName, setResumeFileName] = React.useState('')
  const { user } = useUser()
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setError('')
    setIsSubmitting(true)

    try {
      const res = await completeOnboarding(formData)
      if (res?.message) {
        // Reloads the user's data from the Clerk API
        await user?.reload()
        router.push('/profile')
        router.refresh()
      } else if (res?.error) {
        setError(res?.error)
        setIsSubmitting(false)
      } else {
        // Fallback if response doesn't have message or error
        setIsSubmitting(false)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFileName(e.target.files[0].name)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#00B4D8', animationDuration: '6s' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#0077B6', animationDuration: '8s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full opacity-5 animate-float" style={{ backgroundColor: '#FFDD00', animationDuration: '7s' }}></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Decorative header with icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 transform hover:scale-110 transition-transform" style={{ backgroundColor: '#FFDD00' }}>
            <svg className="w-10 h-10" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#222222' }}>
            Let's Get You Started! 🚀
          </h1>
          <p className="text-lg" style={{ color: '#222222', opacity: 0.7 }}>
            A few quick details to personalize your experience
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-4" style={{ borderColor: '#00B4D8' }}>
          {error && (
            <div className="mb-6 p-4 rounded-xl border-2 animate-shake" style={{ backgroundColor: '#FFDD00', borderColor: '#FFDD00', color: '#222222' }}>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={async (e) => { 
            e.preventDefault(); 
            const formData = new FormData(e.currentTarget);
            await handleSubmit(formData);
          }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="firstName" className="flex text-sm font-semibold mb-2 items-center gap-2" style={{ color: '#0077B6' }}>
                  <span>👤</span> First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
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
                  placeholder="John"
                />
              </div>

              <div className="group">
                <label htmlFor="lastName" className="flex text-sm font-semibold mb-2 items-center gap-2" style={{ color: '#0077B6' }}>
                  <span>👤</span> Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
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
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="age" className="flex text-sm font-semibold mb-2 items-center gap-2" style={{ color: '#0077B6' }}>
                <span>🎂</span> Age *
              </label>
              <input
                type="number"
                id="age"
                name="age"
                required
                min="1"
                max="120"
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
                placeholder="25"
              />
            </div>

            <div className="group">
              <label htmlFor="skill" className="flex text-sm font-semibold mb-2 items-center gap-2" style={{ color: '#0077B6' }}>
                <span>💼</span> Skill *
              </label>
              <input
                type="text"
                id="skill"
                name="skill"
                required
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
                placeholder="Software Development, Design, Marketing, etc."
              />
            </div>

            <div className="group">
              <label htmlFor="resume" className="flex text-sm font-semibold mb-2 items-center gap-2" style={{ color: '#0077B6' }}>
                <span>📄</span> Resume *
              </label>
              <div className="mt-1 flex items-center">
                <label
                  htmlFor="resume"
                  className="flex flex-col items-center justify-center w-full h-40 border-3 border-dashed rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
                  style={{
                    borderColor: '#00B4D8',
                    backgroundColor: '#FAFAFA',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0077B6'
                    e.currentTarget.style.backgroundColor = 'rgba(0, 180, 216, 0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#00B4D8'
                    e.currentTarget.style.backgroundColor = '#FAFAFA'
                  }}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ backgroundColor: '#FFDD00' }}>
                      <svg
                        className="w-8 h-8"
                        style={{ color: '#0077B6' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="mb-2 text-sm font-semibold" style={{ color: '#222222' }}>
                      <span>Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs" style={{ color: '#222222', opacity: 0.6 }}>
                      PDF, DOC, DOCX (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {resumeFileName && (
                <div className="mt-3 p-3 rounded-xl flex items-center gap-2 animate-fadeIn" style={{ backgroundColor: '#FFDD00' }}>
                  <span>✅</span>
                  <p className="text-sm font-medium" style={{ color: '#222222' }}>
                    Selected: <span className="font-bold">{resumeFileName}</span>
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-bold py-4 px-6 rounded-xl duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              style={{
                backgroundColor: isSubmitting ? '#00B4D8' : '#0077B6',
                color: 'white',
                opacity: isSubmitting ? 0.9 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#00B4D8'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#0077B6'
                }
              }}
            >
              {isSubmitting && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="relative">
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <span className="font-semibold">Processing...</span>
                    <span className="text-xl animate-pulse">⏳</span>
                  </>
                ) : (
                  <>
                    Complete Onboarding
                    <span className="text-xl">✨</span>
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}
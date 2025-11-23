'use client'

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Home = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Navigation Header */}
      <header className="flex justify-between items-center p-4 md:p-6 lg:px-12 h-16 md:h-20 border-b" style={{ borderColor: '#00B4D8', backgroundColor: 'white' }}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFDD00' }}>
            <svg className="w-6 h-6" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold" style={{ color: '#0077B6' }}>JobMatch</span>
        </div>
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80" style={{ color: '#0077B6' }}>
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-6 py-2 rounded-lg font-medium text-white transition-all hover:scale-105 shadow-lg" style={{ backgroundColor: '#0077B6' }}>
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="px-6 py-2 rounded-lg font-medium text-white transition-all hover:scale-105 shadow-lg mr-2" style={{ backgroundColor: '#0077B6' }}>
                Dashboard
              </button>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#00B4D8', animationDuration: '6s' }}></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#0077B6', animationDuration: '8s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full opacity-5 animate-float" style={{ backgroundColor: '#FFDD00', animationDuration: '7s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: '#222222' }}>
            Find Your Dream Job
            <span className="block mt-2" style={{ color: '#0077B6' }}>Without the Hassle</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: '#222222', opacity: 0.7 }}>
            We search the internet for the best job opportunities and send your resume directly to employers. 
            <span className="block mt-2 font-semibold" style={{ color: '#0077B6' }}>One click. That's it.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 shadow-2xl transform hover:-translate-y-1" style={{ backgroundColor: '#0077B6' }}>
                  Start Finding Jobs Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 shadow-2xl transform hover:-translate-y-1" style={{ backgroundColor: '#0077B6' }}>
                  Go to Dashboard
                </button>
              </Link>
            </SignedIn>
            <button className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 border-2" style={{ borderColor: '#0077B6', color: '#0077B6', backgroundColor: 'transparent' }}>
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4" style={{ backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4" style={{ color: '#222222' }}>
            How It Works
          </h2>
          <p className="text-xl text-center mb-16" style={{ color: '#222222', opacity: 0.7 }}>
            Get matched with opportunities in three simple steps
          </p>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg" style={{ backgroundColor: '#0077B6' }}>
                1
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#222222' }}>Upload Your Resume</h3>
              <p className="text-lg" style={{ color: '#222222', opacity: 0.7 }}>
                Complete a quick onboarding and upload your resume. We'll keep it safe and ready to send.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg" style={{ backgroundColor: '#00B4D8' }}>
                2
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#222222' }}>We Find Jobs For You</h3>
              <p className="text-lg" style={{ color: '#222222', opacity: 0.7 }}>
                Our system searches thousands of job boards and company websites to find opportunities that match your skills.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg" style={{ backgroundColor: '#FFDD00' }}>
                <span style={{ color: '#222222' }}>3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#222222' }}>Apply With One Click</h3>
              <p className="text-lg" style={{ color: '#222222', opacity: 0.7 }}>
                Browse curated job listings. When you find one you like, click apply and we'll send your resume instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4" style={{ color: '#222222' }}>
            Why Choose JobMatch?
          </h2>
          <p className="text-xl text-center mb-16" style={{ color: '#222222', opacity: 0.7 }}>
            Everything you need to land your next opportunity
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 transition-all hover:scale-105 hover:shadow-2xl" style={{ borderColor: '#00B4D8' }}>
              <div className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: '#FFDD00' }}>
                <svg className="w-8 h-8" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#222222' }}>Smart Job Discovery</h3>
              <p style={{ color: '#222222', opacity: 0.7 }}>
                We scan the entire internet for job postings, so you don't have to. Find opportunities you never knew existed.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 transition-all hover:scale-105 hover:shadow-2xl" style={{ borderColor: '#00B4D8' }}>
              <div className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: '#FFDD00' }}>
                <svg className="w-8 h-8" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#222222' }}>Instant Applications</h3>
              <p style={{ color: '#222222', opacity: 0.7 }}>
                No more filling out lengthy forms. One click and your resume is on its way to the employer.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 transition-all hover:scale-105 hover:shadow-2xl" style={{ borderColor: '#00B4D8' }}>
              <div className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: '#FFDD00' }}>
                <svg className="w-8 h-8" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#222222' }}>Secure & Private</h3>
              <p style={{ color: '#222222', opacity: 0.7 }}>
                Your resume is stored securely. You control which jobs you apply to. Your data, your choice.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 transition-all hover:scale-105 hover:shadow-2xl" style={{ borderColor: '#00B4D8' }}>
              <div className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: '#FFDD00' }}>
                <svg className="w-8 h-8" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#222222' }}>Save Time</h3>
              <p style={{ color: '#222222', opacity: 0.7 }}>
                Stop spending hours searching job boards. We do the work so you can focus on what matters.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 transition-all hover:scale-105 hover:shadow-2xl" style={{ borderColor: '#00B4D8' }}>
              <div className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: '#FFDD00' }}>
                <svg className="w-8 h-8" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#222222' }}>Curated Matches</h3>
              <p style={{ color: '#222222', opacity: 0.7 }}>
                We match jobs to your skills and experience, so you only see opportunities that are right for you.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 transition-all hover:scale-105 hover:shadow-2xl" style={{ borderColor: '#00B4D8' }}>
              <div className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: '#FFDD00' }}>
                <svg className="w-8 h-8" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#222222' }}>100% Free</h3>
              <p style={{ color: '#222222', opacity: 0.7 }}>
                No hidden fees, no subscriptions. Find and apply to jobs completely free, forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: '#0077B6' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#FFDD00' }}></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#00B4D8' }}></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white opacity-90">
            Join thousands of job seekers who are already using JobMatch to land their dream jobs.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-10 py-5 rounded-xl font-bold text-xl text-white transition-all hover:scale-105 shadow-2xl transform hover:-translate-y-1" style={{ backgroundColor: '#FFDD00', color: '#222222' }}>
                Get Started Free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="px-10 py-5 rounded-xl font-bold text-xl text-white transition-all hover:scale-105 shadow-2xl transform hover:-translate-y-1" style={{ backgroundColor: '#FFDD00', color: '#222222' }}>
                Go to Dashboard
              </button>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t" style={{ borderColor: '#00B4D8', backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFDD00' }}>
              <svg className="w-5 h-5" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold" style={{ color: '#0077B6' }}>JobMatch</span>
          </div>
          <p style={{ color: '#222222', opacity: 0.7 }}>
            © 2024 JobMatch. Making job hunting simple, one click at a time.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home

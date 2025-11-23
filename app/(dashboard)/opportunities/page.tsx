'use client'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

interface Job {
  _id: string
  title: string
  company: string
  description: string
  location?: string
  url: string
  source: string
  publishedDate: string
  matchScore?: number
  appliedBy?: string[]
}

export default function OpportunitiesPage() {
  const { user, isLoaded } = useUser()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')
  const [applying, setApplying] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      setError('')
      const response = await fetch('/api/jobs/fetch')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch jobs')
      }
      setJobs(data.jobs || [])

      // Show warning if there were feed errors
      if (data.errors && data.errors.length > 0) {
        console.warn('Some RSS feeds failed:', data.errors)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs')
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFetchNewJobs = async () => {
    setFetching(true)
    setError('')
    try {
      const response = await fetch('/api/jobs/fetch')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch jobs')
      }

      setJobs(data.jobs || [])

      const message =
        data.fetched > 0
          ? `Fetched ${data.fetched} new jobs! Total: ${data.total || data.jobs?.length || 0} jobs`
          : `No new jobs found. Total: ${data.total || data.jobs?.length || 0} jobs in database`

      alert(message)

      // Show errors if any
      if (data.errors && data.errors.length > 0) {
        console.warn('RSS feed errors:', data.errors)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch new jobs')
      alert(`Error: ${err.message || 'Failed to fetch new jobs'}`)
    } finally {
      setFetching(false)
    }
  }

  const handleApply = async (jobId: string) => {
    if (!user) return
    setApplying(jobId)
    try {
      const response = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply')
      }

      // Update job in state
      setJobs(
        jobs.map(job =>
          job._id === jobId
            ? { ...job, appliedBy: [...(job.appliedBy || []), user.id] }
            : job
        )
      )

      // Open job URL in new tab
      const job = jobs.find(j => j._id === jobId)
      if (job?.url) {
        window.open(job.url, '_blank')
      }

      alert('Application submitted! Your resume has been sent.')
    } catch (err: any) {
      alert(err.message || 'Failed to apply to job')
    } finally {
      setApplying(null)
    }
  }

  useEffect(() => {
    if (isLoaded) {
      fetchJobs()
    }
  }, [isLoaded])

  const hasApplied = (job: Job) => {
    return user && job.appliedBy?.includes(user.id)
  }

  const getMatchScoreColor = (score?: number) => {
    if (!score) return '#222222'
    if (score >= 70) return '#00B4D8'
    if (score >= 40) return '#FFDD00'
    return '#222222'
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] overflow-x-hidden">
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent"
            style={{ color: '#0077B6' }}
          ></div>
          <p
            className="mt-4 text-lg"
            style={{ color: '#222222', opacity: 0.7 }}
          >
            Loading job opportunities...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#222222' }}>
            Job Opportunities
          </h1>
          <p className="text-lg" style={{ color: '#222222', opacity: 0.7 }}>
            Discover jobs matched to your skills
          </p>
        </div>

        <button
          onClick={handleFetchNewJobs}
          disabled={fetching}
          className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#0077B6' }}
        >
          {fetching ? 'Fetching...' : '🔄 Fetch New Jobs'}
        </button>
      </div>

      {error && (
        <div
          className="mb-6 p-4 rounded-xl border-2"
          style={{
            backgroundColor: '#FFDD00',
            borderColor: '#FFDD00',
            color: '#222222',
          }}
        >
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div
          className="bg-white rounded-2xl shadow-lg p-12 text-center border-2"
          style={{ borderColor: '#00B4D8' }}
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#FFDD00' }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: '#0077B6' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: '#222222' }}>
            No jobs found
          </h2>
          <p
            style={{ color: '#222222', opacity: 0.7 }}
            className="mb-4"
          >
            Click "Fetch New Jobs" to search for opportunities
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map(job => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 transition-all hover:shadow-2xl hover:scale-[1.01]"
              style={{ borderColor: '#00B4D8' }}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3
                        className="text-2xl font-bold mb-2"
                        style={{ color: '#222222' }}
                      >
                        {job.title}
                      </h3>
                      <p
                        className="text-lg font-semibold mb-1"
                        style={{ color: '#0077B6' }}
                      >
                        {job.company}
                      </p>
                      {job.location && (
                        <p
                          className="text-sm mb-2"
                          style={{ color: '#222222', opacity: 0.7 }}
                        >
                          📍 {job.location}
                        </p>
                      )}
                    </div>

                    {job.matchScore !== undefined &&
                      job.matchScore > 0 && (
                        <div className="flex flex-col items-end">
                          <div
                            className="px-3 py-1 rounded-lg font-bold text-sm mb-1"
                            style={{
                              backgroundColor: '#FFDD00',
                              color: '#222222',
                            }}
                          >
                            {Math.round(job.matchScore)}% Match
                          </div>
                          <div
                            className="text-xs"
                            style={{
                              color: '#222222',
                              opacity: 0.6,
                            }}
                          >
                            {job.source}
                          </div>
                        </div>
                      )}
                  </div>

                  <p
                    className="text-sm mb-4 line-clamp-3"
                    style={{ color: '#222222', opacity: 0.8 }}
                  >
                    {job.description}
                  </p>

                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: '#222222', opacity: 0.6 }}
                  >
                    <span>
                      📅{' '}
                      {new Date(job.publishedDate).toLocaleDateString()}
                    </span>
                    {job.source && <span>•</span>}
                    {job.source && (
                      <span>Source: {job.source}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:min-w-[200px]">
                  {hasApplied(job) ? (
                    <div
                      className="px-6 py-3 rounded-xl font-bold text-center border-2"
                      style={{
                        borderColor: '#00B4D8',
                        color: '#00B4D8',
                        backgroundColor: 'transparent',
                      }}
                    >
                      ✓ Applied
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(job._id)}
                      disabled={applying === job._id || !user}
                      className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#0077B6' }}
                    >
                      {applying === job._id
                        ? 'Applying...'
                        : 'Apply Now'}
                    </button>
                  )}

                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl font-bold text-center transition-all hover:scale-105 border-2"
                    style={{
                      borderColor: '#0077B6',
                      color: '#0077B6',
                      backgroundColor: 'transparent',
                    }}
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

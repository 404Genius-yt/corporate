'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { getUserById } from '@/lib/actions/user.actions'

interface UserData {
  firstName?: string
  lastName?: string
  email?: string
  age?: number
  skill?: string
  resume?: string
  username?: string
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !user) return

      try {
        setLoading(true)
        const data = await getUserById(user.id)
        setUserData(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, isLoaded])

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent" style={{ color: '#0077B6' }}></div>
          <p className="mt-4 text-lg" style={{ color: '#222222', opacity: 0.7 }}>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2" style={{ borderColor: '#FFDD00' }}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#FFDD00' }}>
              <svg className="w-8 h-8" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#222222' }}>Error Loading Profile</h2>
            <p style={{ color: '#222222', opacity: 0.7 }}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#222222' }}>My Profile</h1>
        <p className="text-lg" style={{ color: '#222222', opacity: 0.7 }}>
          View and manage your profile information
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border-2" style={{ borderColor: '#00B4D8' }}>
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b" style={{ borderColor: '#00B4D8' }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg" style={{ backgroundColor: '#0077B6' }}>
            {userData?.firstName?.[0] || userData?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#222222' }}>
              {userData?.firstName && userData?.lastName
                ? `${userData.firstName} ${userData.lastName}`
                : userData?.email || 'User'}
            </h2>
            <p className="text-lg" style={{ color: '#222222', opacity: 0.7 }}>
              {userData?.email || user?.emailAddresses[0]?.emailAddress || 'No email'}
            </p>
            {userData?.username && (
              <p className="text-sm mt-1" style={{ color: '#0077B6' }}>
                @{userData.username}
              </p>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#0077B6' }}>
              <span>👤</span> Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1" style={{ color: '#222222', opacity: 0.7 }}>
                  First Name
                </label>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#FAFAFA', color: '#222222' }}>
                  {userData?.firstName || 'Not set'}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1" style={{ color: '#222222', opacity: 0.7 }}>
                  Last Name
                </label>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#FAFAFA', color: '#222222' }}>
                  {userData?.lastName || 'Not set'}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1" style={{ color: '#222222', opacity: 0.7 }}>
                  Age
                </label>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#FAFAFA', color: '#222222' }}>
                  {userData?.age || 'Not set'}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#0077B6' }}>
              <span>💼</span> Professional Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1" style={{ color: '#222222', opacity: 0.7 }}>
                  Skill/Expertise
                </label>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#FAFAFA', color: '#222222' }}>
                  {userData?.skill || 'Not set'}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1" style={{ color: '#222222', opacity: 0.7 }}>
                  Resume
                </label>
                {userData?.resume ? (
                  <div className="p-3 rounded-xl flex items-center justify-between" style={{ backgroundColor: '#FAFAFA' }}>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" style={{ color: '#0077B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span style={{ color: '#222222' }}>Resume uploaded</span>
                    </div>
                    <a
                      href={userData.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg text-sm font-medium transition-all hover:scale-105"
                      style={{ backgroundColor: '#0077B6', color: 'white' }}
                    >
                      View
                    </a>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl" style={{ backgroundColor: '#FAFAFA', color: '#222222', opacity: 0.7 }}>
                    No resume uploaded
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1" style={{ color: '#222222', opacity: 0.7 }}>
                  Email
                </label>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#FAFAFA', color: '#222222' }}>
                  {userData?.email || user?.emailAddresses[0]?.emailAddress || 'Not set'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row gap-4" style={{ borderColor: '#00B4D8' }}>
          <button
            className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#0077B6' }}
          >
            Edit Profile
          </button>
          <button
            className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 border-2"
            style={{ borderColor: '#0077B6', color: '#0077B6', backgroundColor: 'transparent' }}
          >
            Update Resume
          </button>
        </div>
      </div>
    </div>
  )
}


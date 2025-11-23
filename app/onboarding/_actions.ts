'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { connectToDatabase } from '@/lib/database/mongoose'
import { User } from '@/lib/database/models/user.model'

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  try {
    // Connect to database
    await connectToDatabase()

    // Get form data
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const age = parseInt(formData.get('age') as string)
    const skill = formData.get('skill') as string
    const resumeFile = formData.get('resume') as File | null

    // Validate required fields
    if (!firstName || !lastName || !age || !skill) {
      return { error: 'All fields are required' }
    }

    if (!resumeFile) {
      return { error: 'Resume file is required' }
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (resumeFile.size > maxSize) {
      return { error: 'Resume file size must be less than 10MB' }
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(resumeFile.type)) {
      return { error: 'Resume must be a PDF, DOC, or DOCX file' }
    }

    // Save resume file
    let resumePath = ''
    try {
      const bytes = await resumeFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resumes')
      await mkdir(uploadsDir, { recursive: true })

      // Generate unique filename
      const fileExtension = resumeFile.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExtension}`
      resumePath = join(uploadsDir, fileName)

      // Write file
      await writeFile(resumePath, buffer)

      // Store relative path for database
      const relativePath = `/uploads/resumes/${fileName}`
      resumePath = relativePath
    } catch (fileError: any) {
      console.error('Error saving resume file:', fileError)
      return { error: 'Failed to save resume file' }
    }

    // Find and update user by clerkId
    const existingUser = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        firstName: firstName,
        lastName: lastName,
        age: age,
        skill: skill,
        resume: resumePath,
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!existingUser) {
      return { error: 'User not found' }
    }

    // Update Clerk metadata to mark onboarding as complete
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...(clerkUser.publicMetadata || {}),
        onboardingComplete: true,
      },
    })

    return { message: 'Onboarding completed successfully' }
  } catch (error: any) {
    console.error('Onboarding error:', error)
    return { error: 'Internal server error' }
  }
}
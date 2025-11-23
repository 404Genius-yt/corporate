'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { connectToDatabase } from '@/lib/database/mongoose'
import { User } from '@/lib/database/models/user.model'

const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth()

  if (!userId) return { error: 'Unauthorized' }

  try {
    await connectToDatabase()

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const age = parseInt(formData.get('age') as string)
    const skill = formData.get('skill') as string
    const resumeFile = formData.get('resume') as Blob | null

    if (!firstName || !lastName || !age || !skill) {
      return { error: 'All fields are required' }
    }

    if (!resumeFile) return { error: 'Resume file is required' }

    const maxSize = 10 * 1024 * 1024
    if ((resumeFile as any).size > maxSize) {
      return { error: 'Resume file size must be less than 10MB' }
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (resumeFile && !allowedTypes.includes((resumeFile as any).type)) {
      return { error: 'Resume must be a PDF, DOC, or DOCX file' }
    }

    // Save resume
    let resumePath = ''
    try {
      const arrayBuffer = await resumeFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resumes')
      await mkdir(uploadsDir, { recursive: true })

      const fileExtension = (resumeFile as any).name?.split('.').pop() || 'pdf'
      const fileName = `${userId}-${Date.now()}.${fileExtension}`
      const fullPath = join(uploadsDir, fileName)

      await writeFile(fullPath, buffer)
      resumePath = `/uploads/resumes/${fileName}`
    } catch (err: any) {
      console.error('Error saving resume file:', err)
      return { error: 'Failed to save resume file' }
    }

    const existingUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { firstName, lastName, age, skill, resume: resumePath, updatedAt: new Date() },
      { new: true }
    )
    if (!existingUser) return { error: 'User not found' }
    const client = await clerkClient()

    const clerkUser = await client.users.getUser(userId)
    await client.users.updateUser(userId, {
      publicMetadata: { ...(clerkUser.publicMetadata || {}), onboardingComplete: true },
    })

    return { message: 'Onboarding completed successfully' }
  } catch (err: any) {
    console.error('Onboarding error:', err)
    return { error: 'Internal server error' }
  }
}

export default completeOnboarding
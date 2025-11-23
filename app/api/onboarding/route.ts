import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { connectToDatabase } from '@/lib/database/mongoose'
import { User } from '@/lib/database/models/user.model'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Connect to database
    await connectToDatabase()

    // Parse form data
    const formData = await req.formData()
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const age = parseInt(formData.get('age') as string)
    const skill = formData.get('skill') as string
    const resumeFile = formData.get('resume') as File | null

    // Validate required fields
    if (!firstName || !lastName || !age || !skill) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!resumeFile) {
      return NextResponse.json(
        { error: 'Resume file is required' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (resumeFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Resume file size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(resumeFile.type)) {
      return NextResponse.json(
        { error: 'Resume must be a PDF, DOC, or DOCX file' },
        { status: 400 }
      )
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
      return NextResponse.json(
        { error: 'Failed to save resume file' },
        { status: 500 }
      )
    }

    // Find user by clerkId
    const existingUser = await User.findOne({ clerkId: userId })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user with onboarding data
    existingUser.firstName = firstName
    existingUser.lastName = lastName
    existingUser.age = age
    existingUser.skill = skill
    existingUser.resume = resumePath
    existingUser.updatedAt = new Date()

    await existingUser.save()

    // Update Clerk metadata to mark onboarding as complete
    const client = await clerkClient()
    const currentUser = await client.users.getUser(userId)
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...(currentUser.publicMetadata || {}),
        onboardingComplete: true,
      },
    })

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      user: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        age: existingUser.age,
        skill: existingUser.skill,
      }
    })
  } catch (error: any) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}


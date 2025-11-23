import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database/mongoose'
import { Job } from '@/lib/database/models/job.model'
import { User } from '@/lib/database/models/user.model'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId } = await request.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    await connectToDatabase()

    // Get user to check if they have a resume
    const user = await User.findOne({ clerkId: userId })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.resume) {
      return NextResponse.json({ error: 'Please upload your resume first' }, { status: 400 })
    }

    // Get job
    const job = await Job.findById(jobId)
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Check if already applied
    if (job.appliedBy?.includes(userId)) {
      return NextResponse.json({ error: 'You have already applied to this job' }, { status: 400 })
    }

    // Add user to appliedBy array
    job.appliedBy = [...(job.appliedBy || []), userId]
    await job.save()

    // TODO: Here you would send the resume to the employer
    // For MVP, we just track the application
    // In production, you'd integrate with email service or job board API

    return NextResponse.json({ 
      message: 'Application submitted successfully',
      jobUrl: job.url 
    })
  } catch (error: any) {
    console.error('Error applying to job:', error)
    return NextResponse.json(
      { error: 'Failed to apply to job', details: error.message },
      { status: 500 }
    )
  }
}


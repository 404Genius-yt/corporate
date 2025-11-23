import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { connectToDatabase } from '@/lib/database/mongoose'
import { Job } from '@/lib/database/models/job.model'
import { auth } from '@clerk/nextjs/server'
import { getUserById } from '@/lib/actions/user.actions'

// Configure parser with custom options to handle different feed formats
const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'content'],
      ['description', 'description'],
    ]
  },
  timeout: 10000, // 10 second timeout
})

// RSS Feed URLs for job boards
// Using known working RSS feeds for remote jobs
const RSS_FEEDS = [
  'https://weworkremotely.com/remote-jobs.rss',
  'https://remoteok.io/remote-jobs.rss',
  'https://jobs.github.com/positions.atom?description=developer',
  // Add more RSS feeds as needed
]

// Extract skills from job description
function extractSkills(description: string, userSkill: string): number {
  const desc = description.toLowerCase()
  const skill = userSkill.toLowerCase()
  
  // Check for exact match
  if (desc.includes(skill)) {
    return 1
  }
  
  // Check for partial matches
  const skillWords = skill.split(/[\s,]+/)
  let matches = 0
  skillWords.forEach(word => {
    if (word.length > 3 && desc.includes(word)) {
      matches++
    }
  })
  
  return matches / skillWords.length
}

// Calculate match score
function calculateMatchScore(jobDescription: string, userSkill: string): number {
  const skillMatch = extractSkills(jobDescription, userSkill)
  
  // Additional scoring factors
  let score = skillMatch * 100
  
  // Boost score for common tech keywords if user skill is tech-related
  const techKeywords = ['javascript', 'python', 'react', 'node', 'java', 'typescript', 'html', 'css']
  const isTechSkill = techKeywords.some(keyword => userSkill.toLowerCase().includes(keyword))
  
  if (isTechSkill) {
    const keywordMatches = techKeywords.filter(keyword => 
      jobDescription.toLowerCase().includes(keyword)
    ).length
    score += keywordMatches * 5
  }
  
  return Math.min(score, 100) // Cap at 100
}

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data for matching
    let userSkill = ''
    try {
      const user = await getUserById(userId)
      userSkill = user?.skill || ''
    } catch (error) {
      console.error('Error fetching user:', error)
    }

    await connectToDatabase()

    const jobs: any[] = []
    const feedErrors: string[] = []

    // Fetch jobs from RSS feeds
    for (const feedUrl of RSS_FEEDS) {
      try {
        console.log(`Fetching feed: ${feedUrl}`)
        const feed = await parser.parseURL(feedUrl)
        
        console.log(`Feed "${feed.title}" has ${feed.items?.length || 0} items`)
        
        if (feed.items && feed.items.length > 0) {
          let feedJobsCount = 0
          
          for (const item of feed.items) {
            if (!item.link || !item.title) {
              console.log('Skipping item: missing link or title')
              continue
            }

            // Skip if job already exists
            const existingJob = await Job.findOne({ url: item.link })
            if (existingJob) {
              // Update match score if user skill exists
              if (userSkill) {
                const matchScore = calculateMatchScore(
                  item.contentSnippet || item.content || item.title || '',
                  userSkill
                )
                existingJob.matchScore = matchScore
                await existingJob.save()
              }
              continue
            }

            // Extract company name from title or use source
            const title = item.title || 'Untitled Position'
            const companyMatch = title.match(/at\s+([^|]+)/i) || 
                                title.match(/-\s*([^-]+)$/i) ||
                                title.match(/\|\s*(.+)/i) ||
                                title.match(/:\s*([^:]+)/i)
            const company = companyMatch ? companyMatch[1].trim() : feed.title || 'Unknown Company'

            // Calculate match score
            const description = item.contentSnippet || item.content || item.title || ''
            const matchScore = userSkill ? calculateMatchScore(description, userSkill) : 0

            // Extract location if available
            const locationMatch = description.match(/(remote|hybrid|onsite|location[:\s]+[^,]+)/i) ||
                                 title.match(/(remote|hybrid|onsite)/i)
            const location = locationMatch ? locationMatch[0] : 'Remote' // Default to Remote for remote job feeds

            // Create job
            try {
              const job = await Job.create({
                title: title,
                company: company,
                description: description.substring(0, 1000), // Limit description length
                location: location,
                url: item.link,
                source: feed.title || 'RSS Feed',
                publishedDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                matchScore: matchScore,
              })

              jobs.push(job)
              feedJobsCount++
            } catch (createError: any) {
              // Skip duplicate URLs
              if (createError.code !== 11000) {
                console.error('Error creating job:', createError.message)
              }
            }
          }
          
          console.log(`Successfully processed ${feedJobsCount} new jobs from ${feedUrl}`)
        } else {
          console.log(`Feed ${feedUrl} has no items`)
        }
      } catch (feedError: any) {
        const errorMsg = `Error fetching feed ${feedUrl}: ${feedError.message}`
        console.error(errorMsg)
        feedErrors.push(errorMsg)
        // Continue with other feeds - don't fail the entire request
      }
    }
    
    if (feedErrors.length > 0) {
      console.log('Feed errors:', feedErrors)
    }

    // Get all jobs sorted by match score and date
    let allJobs = await Job.find()
      .sort({ matchScore: -1, publishedDate: -1 })
      .limit(100)
      .lean()

    // If no jobs found and no errors, create sample jobs for testing
    if (allJobs.length === 0 && jobs.length === 0 && feedErrors.length === RSS_FEEDS.length) {
      console.log('No jobs found from RSS feeds. Creating sample jobs for testing...')
      
      const sampleJobs = [
        {
          title: 'Senior Software Developer',
          company: 'Tech Corp',
          description: 'We are looking for an experienced software developer with strong JavaScript and React skills. Remote position available.',
          location: 'Remote',
          url: 'https://example.com/job1',
          source: 'Sample Feed',
          matchScore: userSkill ? calculateMatchScore('JavaScript React Developer', userSkill) : 50,
        },
        {
          title: 'Full Stack Developer',
          company: 'StartupXYZ',
          description: 'Join our team as a full stack developer. Experience with Node.js, Python, and modern web technologies required.',
          location: 'Hybrid',
          url: 'https://example.com/job2',
          source: 'Sample Feed',
          matchScore: userSkill ? calculateMatchScore('Node.js Python Full Stack', userSkill) : 40,
        },
        {
          title: 'Frontend Developer',
          company: 'Design Studio',
          description: 'Looking for a creative frontend developer with expertise in HTML, CSS, and JavaScript frameworks.',
          location: 'Remote',
          url: 'https://example.com/job3',
          source: 'Sample Feed',
          matchScore: userSkill ? calculateMatchScore('HTML CSS JavaScript Frontend', userSkill) : 45,
        },
      ]

      for (const sampleJob of sampleJobs) {
        try {
          const job = await Job.create({
            ...sampleJob,
            publishedDate: new Date(),
          })
          allJobs.push(job)
        } catch (err) {
          // Skip if already exists
        }
      }
      
      // Re-fetch after creating samples
      allJobs = await Job.find()
        .sort({ matchScore: -1, publishedDate: -1 })
        .limit(100)
        .lean()
    }

    return NextResponse.json({ 
      jobs: allJobs,
      fetched: jobs.length,
      total: allJobs.length,
      errors: feedErrors.length > 0 ? feedErrors : undefined
    })
  } catch (error: any) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error.message },
      { status: 500 }
    )
  }
}


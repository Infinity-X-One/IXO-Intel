import { NextResponse } from "next/server"
import { createScrapingJob } from "@/lib/services/web-scraper"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getScrapingJobStatus } from "@/lib/services/web-scraper"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, selector, botId, outputDestination } = body

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Create scraping job
    const job = await createScrapingJob(url, { selector })

    // Store job in database
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("scraping_jobs")
      .insert([
        {
          job_id: job.id,
          url,
          status: job.status,
          bot_id: botId,
          output_destination: outputDestination,
          created_at: job.createdAt,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      url,
      message: "Scraping job created successfully",
    })
  } catch (error) {
    console.error("Error creating scraping job:", error)
    return NextResponse.json({ error: "Failed to create scraping job" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    const job = await getScrapingJobStatus(jobId)

    // Update database with job status
    const supabase = createServerSupabaseClient()
    await supabase
      .from("scraping_jobs")
      .update({
        status: job.status,
        data: job.data,
        completed_at: job.completedAt,
      })
      .eq("job_id", jobId)

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error getting scraping job status:", error)
    return NextResponse.json({ error: "Failed to get job status" }, { status: 500 })
  }
}

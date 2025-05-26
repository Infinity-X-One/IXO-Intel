import { API_CONFIG } from "@/lib/config/api-keys"

export interface ScrapingJob {
  id: string
  url: string
  status: "pending" | "running" | "completed" | "failed"
  data?: any
  error?: string
  createdAt: string
  completedAt?: string
}

// Web scraping using Apify
export async function createScrapingJob(
  url: string,
  options: {
    selector?: string
    waitFor?: number
    screenshot?: boolean
  } = {},
): Promise<ScrapingJob> {
  try {
    const response = await fetch("https://api.apify.com/v2/acts/apify~web-scraper/runs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_CONFIG.APIFY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startUrls: [{ url }],
        linkSelector: "a[href]",
        pageFunction: `
          async function pageFunction(context) {
            const { page, request } = context;
            const title = await page.title();
            const content = await page.evaluate(() => {
              return document.body.innerText;
            });
            return {
              url: request.url,
              title,
              content: content.substring(0, 5000), // Limit content length
              timestamp: new Date().toISOString()
            };
          }
        `,
        maxRequestsPerCrawl: 1,
        ...options,
      }),
    })

    if (!response.ok) throw new Error("Failed to create scraping job")

    const data = await response.json()

    return {
      id: data.data.id,
      url,
      status: "running",
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error creating scraping job:", error)
    throw error
  }
}

// Check scraping job status
export async function getScrapingJobStatus(jobId: string): Promise<ScrapingJob> {
  try {
    const response = await fetch(`https://api.apify.com/v2/acts/runs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${API_CONFIG.APIFY_API_KEY}`,
      },
    })

    if (!response.ok) throw new Error("Failed to get job status")

    const data = await response.json()

    let jobData = null
    if (data.data.status === "SUCCEEDED") {
      // Get the scraped data
      const datasetResponse = await fetch(`https://api.apify.com/v2/datasets/${data.data.defaultDatasetId}/items`, {
        headers: {
          Authorization: `Bearer ${API_CONFIG.APIFY_API_KEY}`,
        },
      })

      if (datasetResponse.ok) {
        jobData = await datasetResponse.json()
      }
    }

    return {
      id: jobId,
      url: "",
      status: data.data.status === "SUCCEEDED" ? "completed" : data.data.status === "FAILED" ? "failed" : "running",
      data: jobData,
      createdAt: data.data.startedAt,
      completedAt: data.data.finishedAt,
    }
  } catch (error) {
    console.error("Error getting job status:", error)
    throw error
  }
}

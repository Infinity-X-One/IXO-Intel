import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { sendPredictionAlert } from "@/lib/services/email-service"
import { API_CONFIG } from "@/lib/config/api-keys"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const signature = request.headers.get("x-webhook-signature")

    // Verify webhook signature (implement your own verification logic)
    if (signature !== API_CONFIG.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const { event, data } = body

    switch (event) {
      case "prediction.created":
        await handlePredictionCreated(data)
        break
      case "market.alert":
        await handleMarketAlert(data)
        break
      case "scraping.completed":
        await handleScrapingCompleted(data)
        break
      default:
        console.log("Unknown webhook event:", event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePredictionCreated(prediction: any) {
  // Send email alerts to subscribers
  const recipients = ["admin@infinityx1.com"] // Get from database
  await sendPredictionAlert(prediction, recipients)

  // Log the event
  const supabase = createServerSupabaseClient()
  await supabase.from("system_logs").insert([
    {
      event_type: "PREDICTION_CREATED",
      message: `New prediction created for ${prediction.asset_symbol}`,
      severity: "INFO",
    },
  ])
}

async function handleMarketAlert(alertData: any) {
  // Process market alerts
  console.log("Market alert received:", alertData)
}

async function handleScrapingCompleted(scrapingData: any) {
  // Process completed scraping jobs
  console.log("Scraping completed:", scrapingData)
}

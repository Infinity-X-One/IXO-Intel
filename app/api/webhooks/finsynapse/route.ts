// Custom webhook endpoint (completely safe)
import { NextResponse } from "next/server"
import { PredictionBot } from "@/agents/predictionBot"

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-finsynapse-signature")

    // Your webhook verification logic
    if (!verifySignature(signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const data = await request.json()

    // Trigger your agentic system
    const bot = new PredictionBot()
    const result = await bot.executePredictionLoop(data)

    return NextResponse.json({ success: true, prediction: result })
  } catch (error) {
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}

function verifySignature(signature: string | null): boolean {
  // Your signature verification logic
  return signature === process.env.FINSYNAPSE_WEBHOOK_SECRET
}

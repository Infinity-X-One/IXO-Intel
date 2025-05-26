import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/utils/finsynapse/verifySignature'
import { runPredictionLoop } from '@/agents/predictionBot'

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-webhook-signature")
  const body = await request.text()

  if (!verifySignature(signature, body)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const payload = JSON.parse(body)
  await runPredictionLoop(payload)
  return NextResponse.json({ status: 'success', received: true })
}

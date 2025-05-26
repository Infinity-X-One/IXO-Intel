import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { asset, botContext, marketData } = body

    const prompt = `
      You are a financial prediction AI assistant. 
      Based on the following market data for ${asset}:
      
      ${marketData || "Recent market trends and technical indicators"}
      
      And considering your role and expertise as described:
      ${botContext || "You are a financial analyst with expertise in market prediction."}
      
      Generate a prediction with the following information:
      1. Predicted direction (UP, DOWN, NEUTRAL)
      2. Confidence score (0.0-1.0)
      3. Risk score (0.0-1.0)
      4. A brief reason for this prediction (2-3 sentences)
      
      Format your response as JSON with the following structure:
      {
        "predicted_direction": "UP|DOWN|NEUTRAL",
        "confidence_score": 0.XX,
        "risk_score": 0.XX,
        "reason_summary": "Your reasoning here"
      }
    `

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse the AI response
    let predictionData
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        predictionData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Failed to parse prediction JSON from response")
      }
    } catch (e) {
      console.error("Failed to parse AI response:", e)
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    return NextResponse.json(predictionData)
  } catch (error) {
    console.error("Error generating prediction:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}

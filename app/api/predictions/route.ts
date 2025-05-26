import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// Initialize Supabase client
const supabase = createServerSupabaseClient()

export async function GET() {
  try {
    const { data: predictions, error } = await supabase
      .from("predictions")
      .select("*, agentic_bots(id, name)")
      .order("prediction_timestamp", { ascending: false })

    if (error) throw error

    return NextResponse.json(predictions)
  } catch (error) {
    console.error("Error fetching predictions:", error)
    return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { asset, signal_type, bot_id, market_data } = body

    // Validate required fields
    if (!asset || !bot_id) {
      return NextResponse.json({ error: "Asset and bot_id are required" }, { status: 400 })
    }

    // Get bot details for context
    const { data: bot, error: botError } = await supabase.from("agentic_bots").select("*").eq("id", bot_id).single()

    if (botError) throw botError

    // If manual prediction data is provided, use it
    if (body.predicted_direction && body.confidence_score && body.reason_summary) {
      const { data, error } = await supabase
        .from("predictions")
        .insert([
          {
            asset_symbol: asset,
            signal_type: signal_type || "MARKET",
            prediction_direction: body.predicted_direction,
            confidence_score: body.confidence_score,
            risk_score: body.risk_score || 0.5,
            reasons: body.reason_summary,
            prediction_type: "PRICE",
            agent_id: bot_id,
            prediction_timestamp: new Date().toISOString(),
          },
        ])
        .select()

      if (error) throw error

      return NextResponse.json(data[0])
    }

    // Generate prediction using AI
    const botContext = `
      You are a ${bot.role || "financial analyst"} bot named ${bot.name}.
      Your confidence level is ${bot.confidence_level || "medium"}.
      Your skills include: ${bot.skills?.join(", ") || "financial analysis"}.
      ${bot.description ? `Additional context: ${bot.description}` : ""}
    `

    const prompt = `
      You are a financial prediction AI assistant. 
      Based on the following market data for ${asset}:
      
      ${market_data || "Recent market trends and technical indicators"}
      
      And considering your role and expertise as described:
      ${botContext}
      
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

    // Insert prediction into database
    const { data, error } = await supabase
      .from("predictions")
      .insert([
        {
          asset_symbol: asset,
          signal_type: signal_type || "MARKET",
          prediction_direction: predictionData.predicted_direction,
          confidence_score: predictionData.confidence_score,
          risk_score: predictionData.risk_score,
          reasons: predictionData.reason_summary,
          prediction_type: "PRICE",
          agent_id: bot_id,
          prediction_timestamp: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error creating prediction:", error)
    return NextResponse.json({ error: "Failed to create prediction" }, { status: 500 })
  }
}

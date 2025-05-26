import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// Initialize Supabase client
const supabase = createServerSupabaseClient()

export async function GET() {
  try {
    // Get predictions using the actual column structure
    const { data: predictions, error } = await supabase
      .from("predictions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    // Transform the data to match our expected format
    const transformedPredictions =
      predictions?.map((prediction) => ({
        id: prediction.id,
        asset_symbol: prediction.asset,
        signal_type: prediction.source || "MARKET",
        prediction_direction: prediction.sentiment,
        confidence_score: prediction.score,
        risk_score: null,
        reasons: prediction.raw_prompt,
        prediction_timestamp: prediction.created_at,
        agent_id: prediction.loop_id,
        outcome: null,
        accuracy: null,
        delta_error: null,
        agentic_bots: null,
      })) || []

    return NextResponse.json(transformedPredictions)
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

    if (botError) {
      console.error("Bot fetch error:", botError)
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // If manual prediction data is provided, use it
    if (body.predicted_direction && body.confidence_score && body.reason_summary) {
      const { data, error } = await supabase
        .from("predictions")
        .insert([
          {
            asset: asset,
            sentiment: body.predicted_direction,
            score: body.confidence_score,
            source: signal_type || "MARKET",
            loop_id: bot_id,
            raw_prompt: body.reason_summary,
            tags: [signal_type || "MARKET", "manual"],
            timestamp: new Date().toISOString(),
          },
        ])
        .select()

      if (error) {
        console.error("Database insert error:", error)
        throw error
      }

      return NextResponse.json({
        id: data[0].id,
        asset_symbol: data[0].asset,
        signal_type: data[0].source,
        prediction_direction: data[0].sentiment,
        confidence_score: data[0].score,
        reasons: data[0].raw_prompt,
        prediction_timestamp: data[0].created_at,
        agent_id: data[0].loop_id,
      })
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
      console.error("AI Response:", text)
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    // Insert prediction into database using actual schema
    const { data, error } = await supabase
      .from("predictions")
      .insert([
        {
          asset: asset,
          sentiment: predictionData.predicted_direction,
          score: predictionData.confidence_score,
          source: signal_type || "MARKET",
          loop_id: bot_id,
          raw_prompt: predictionData.reason_summary,
          tags: [signal_type || "MARKET", "ai-generated"],
          timestamp: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Database insert error:", error)
      throw error
    }

    return NextResponse.json({
      id: data[0].id,
      asset_symbol: data[0].asset,
      signal_type: data[0].source,
      prediction_direction: data[0].sentiment,
      confidence_score: data[0].score,
      risk_score: predictionData.risk_score,
      reasons: data[0].raw_prompt,
      prediction_timestamp: data[0].created_at,
      agent_id: data[0].loop_id,
    })
  } catch (error) {
    console.error("Error creating prediction:", error)
    return NextResponse.json({ error: "Failed to create prediction" }, { status: 500 })
  }
}

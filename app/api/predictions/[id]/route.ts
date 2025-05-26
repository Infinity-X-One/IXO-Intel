import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// GET a specific prediction
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const id = params.id

    // Get the prediction using actual schema
    const { data: prediction, error } = await supabase.from("predictions").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Prediction not found" }, { status: 404 })
      }
      throw error
    }

    // Get bot information if loop_id exists
    if (prediction.loop_id) {
      const { data: bot, error: botError } = await supabase
        .from("agentic_bots")
        .select("id, name, role")
        .eq("id", prediction.loop_id)
        .single()

      if (!botError && bot) {
        prediction.agentic_bots = bot
      }
    }

    // Transform to expected format
    const transformedPrediction = {
      id: prediction.id,
      asset_symbol: prediction.asset,
      signal_type: prediction.source,
      prediction_direction: prediction.sentiment,
      confidence_score: prediction.score,
      risk_score: null,
      reasons: prediction.raw_prompt,
      prediction_timestamp: prediction.created_at,
      agent_id: prediction.loop_id,
      outcome: null,
      accuracy: null,
      delta_error: null,
      agentic_bots: prediction.agentic_bots,
    }

    return NextResponse.json(transformedPrediction)
  } catch (error) {
    console.error("Error fetching prediction:", error)
    return NextResponse.json({ error: "Failed to fetch prediction" }, { status: 500 })
  }
}

// PATCH update prediction outcome
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const id = params.id
    const body = await request.json()

    // For now, we'll store outcome info in tags since the schema doesn't have outcome columns
    const { data: currentPrediction } = await supabase.from("predictions").select("tags").eq("id", id).single()

    const updatedTags = [...(currentPrediction?.tags || []), `outcome:${body.outcome}`, `accuracy:${body.accuracy}`]

    const { data, error } = await supabase
      .from("predictions")
      .update({
        tags: updatedTags,
      })
      .eq("id", id)
      .select()

    if (error) throw error

    // Transform response
    const transformedPrediction = {
      id: data[0].id,
      asset_symbol: data[0].asset,
      signal_type: data[0].source,
      prediction_direction: data[0].sentiment,
      confidence_score: data[0].score,
      risk_score: null,
      reasons: data[0].raw_prompt,
      prediction_timestamp: data[0].created_at,
      agent_id: data[0].loop_id,
      outcome: body.outcome,
      accuracy: body.accuracy,
      delta_error: body.delta_error,
    }

    return NextResponse.json(transformedPrediction)
  } catch (error) {
    console.error("Error updating prediction:", error)
    return NextResponse.json({ error: "Failed to update prediction" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// GET a specific prediction
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const id = params.id

    const { data, error } = await supabase
      .from("predictions")
      .select(`
        *,
        agentic_bots(id, name, role),
        prediction_refinements(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Prediction not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data)
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

    // Update prediction outcome
    const { data, error } = await supabase
      .from("predictions")
      .update({
        outcome: body.outcome,
        accuracy: body.accuracy,
        delta_error: body.delta_error,
      })
      .eq("id", id)
      .select()

    if (error) throw error

    // Update bot accuracy if outcome is provided
    if (body.outcome && data?.[0]?.prediction_made_by) {
      const botId = data[0].prediction_made_by

      // Get current bot stats
      const { data: botStats } = await supabase
        .from("agent_accuracy_logs")
        .select("*")
        .eq("bot_id", botId)
        .order("log_timestamp", { ascending: false })
        .limit(1)
        .single()

      const totalPredictions = (botStats?.total_predictions || 0) + 1
      const correctPredictions =
        (botStats?.correct_predictions || 0) + (body.outcome === data[0].predicted_direction ? 1 : 0)
      const avgConfidence =
        ((botStats?.avg_confidence || 0) * (totalPredictions - 1) + (data[0].confidence_score || 0)) / totalPredictions
      const accuracyRate = correctPredictions / totalPredictions

      // Insert new accuracy log
      await supabase.from("agent_accuracy_logs").insert([
        {
          bot_id: botId,
          total_predictions: totalPredictions,
          correct_predictions: correctPredictions,
          avg_confidence: avgConfidence,
          accuracy_rate: accuracyRate,
        },
      ])
    }

    return NextResponse.json(data?.[0])
  } catch (error) {
    console.error("Error updating prediction:", error)
    return NextResponse.json({ error: "Failed to update prediction" }, { status: 500 })
  }
}

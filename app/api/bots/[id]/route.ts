import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// GET a specific bot
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const id = params.id

    const { data, error } = await supabase
      .from("agentic_bots")
      .select(`
        *,
        bot_knowledge(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Bot not found" }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching bot:", error)
    return NextResponse.json({ error: "Failed to fetch bot" }, { status: 500 })
  }
}

// PATCH update a bot
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const id = params.id
    const body = await request.json()

    const { data, error } = await supabase
      .from("agentic_bots")
      .update({
        name: body.name,
        description: body.description,
        role: body.role,
        skills: body.skills,
        confidence_level: body.confidence_level,
        active: body.active,
      })
      .eq("id", id)
      .select()

    if (error) throw error

    // Log the bot update
    await supabase.from("system_logs").insert([
      {
        event_type: "BOT_UPDATED",
        related_bot: id,
        severity: "INFO",
        message: `Bot "${body.name}" was updated`,
      },
    ])

    return NextResponse.json(data?.[0])
  } catch (error) {
    console.error("Error updating bot:", error)
    return NextResponse.json({ error: "Failed to update bot" }, { status: 500 })
  }
}

// DELETE a bot
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const id = params.id

    // Get bot name for logging
    const { data: bot } = await supabase.from("agentic_bots").select("name").eq("id", id).single()

    const { error } = await supabase.from("agentic_bots").delete().eq("id", id)

    if (error) throw error

    // Log the bot deletion
    await supabase.from("system_logs").insert([
      {
        event_type: "BOT_DELETED",
        severity: "WARNING",
        message: `Bot "${bot?.name}" was deleted`,
      },
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bot:", error)
    return NextResponse.json({ error: "Failed to delete bot" }, { status: 500 })
  }
}

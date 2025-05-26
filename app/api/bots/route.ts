import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// GET all bots
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("agentic_bots").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching bots:", error)
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 })
  }
}

// POST create a new bot
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "Bot name is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("agentic_bots")
      .insert([
        {
          name: body.name,
          description: body.description || null,
          role: body.role || null,
          skills: body.skills || [],
          confidence_level: body.confidence_level || "medium",
          created_by: body.created_by || "GenesisBot",
          active: body.active !== undefined ? body.active : true,
        },
      ])
      .select()

    if (error) throw error

    // Log the bot creation
    await supabase.from("system_logs").insert([
      {
        event_type: "BOT_CREATED",
        related_bot: data?.[0]?.id,
        severity: "INFO",
        message: `Bot "${body.name}" was created`,
      },
    ])

    return NextResponse.json(data?.[0])
  } catch (error) {
    console.error("Error creating bot:", error)
    return NextResponse.json({ error: "Failed to create bot" }, { status: 500 })
  }
}

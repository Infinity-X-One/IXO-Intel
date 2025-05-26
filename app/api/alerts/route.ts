import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// GET user's email alerts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("email")

    const supabase = createServerSupabaseClient()

    let query = supabase.from("email_alerts").select("*").order("created_at", { ascending: false })

    if (userEmail) {
      query = query.eq("user_email", userEmail)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

// POST create new email alert
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userEmail, alertType, conditions } = body

    if (!userEmail || !alertType || !conditions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("email_alerts")
      .insert([
        {
          user_email: userEmail,
          alert_type: alertType,
          conditions,
          active: true,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// PATCH update alert
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("email_alerts").update(body).eq("id", params.id).select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating alert:", error)
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
  }
}

// DELETE alert
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("email_alerts").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting alert:", error)
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 })
  }
}

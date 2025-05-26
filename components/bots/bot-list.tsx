"use client"

import { useState, useEffect } from "react"
import type { AgenticBot } from "@/types/database"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Plus, Trash, Edit } from "lucide-react"
import Link from "next/link"

export function BotList() {
  const [bots, setBots] = useState<AgenticBot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await fetch("/api/bots")
        if (!response.ok) throw new Error("Failed to fetch bots")
        const data = await response.json()
        setBots(data)
      } catch (err) {
        setError("Error loading bots")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBots()
  }, [])

  const deleteBot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bot?")) return

    try {
      const response = await fetch(`/api/bots/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete bot")

      // Remove bot from state
      setBots(bots.filter((bot) => bot.id !== id))
    } catch (err) {
      console.error("Error deleting bot:", err)
      alert("Failed to delete bot")
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading bots...</div>
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Agent Bots</h1>
        <Link href="/bots/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Bot
          </Button>
        </Link>
      </div>

      {bots.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">No bots found. Create your first bot to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <Card key={bot.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-neon" />
                      {bot.name}
                    </CardTitle>
                    <CardDescription>{bot.role || "No role specified"}</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={bot.active ? "text-neon border-neon" : "text-red-400 border-red-400"}
                  >
                    {bot.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Skills:</span>
                    <span>{bot.skills?.join(", ") || "None"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span>{bot.confidence_level || "Medium"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(bot.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/bots/${bot.id}`}>View Details</Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/bots/${bot.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteBot(bot.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

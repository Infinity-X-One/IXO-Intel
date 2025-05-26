"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Edit, Trash, FileText, Plus, TrendingUp } from "lucide-react"
import type { AgenticBot, BotKnowledge } from "@/types/database"

interface BotDetailProps {
  params: {
    id: string
  }
}

export default function BotDetailPage({ params }: BotDetailProps) {
  const router = useRouter()
  const [bot, setBot] = useState<AgenticBot & { bot_knowledge?: BotKnowledge[] }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBot = async () => {
      try {
        const response = await fetch(`/api/bots/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch bot")
        const data = await response.json()
        setBot(data)
      } catch (err) {
        setError("Error loading bot details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBot()
  }, [params.id])

  const deleteBot = async () => {
    if (!confirm("Are you sure you want to delete this bot?")) return

    try {
      const response = await fetch(`/api/bots/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete bot")

      router.push("/bots")
    } catch (err) {
      console.error("Error deleting bot:", err)
      alert("Failed to delete bot")
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading bot details...</div>
  }

  if (error || !bot) {
    return <div className="text-red-500 p-8">{error || "Bot not found"}</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6 text-neon" />
          {bot.name}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/bots/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={deleteBot}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Bot Details</CardTitle>
            <CardDescription>Information about this AI agent bot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                <p>{bot.role || "No role specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge
                  variant="outline"
                  className={bot.active ? "text-neon border-neon" : "text-red-400 border-red-400"}
                >
                  {bot.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Confidence Level</h3>
                <p>{bot.confidence_level || "Medium"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                <p>{bot.created_by}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                <p>{new Date(bot.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{bot.description || "No description provided"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {bot.skills && bot.skills.length > 0 ? (
                  bot.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills specified</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Actions for this bot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full flex justify-between items-center" asChild>
              <Link href={`/predictions/new?bot=${params.id}`}>
                <span>Create Prediction</span>
                <TrendingUp className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full flex justify-between items-center">
              <span>View Bot Logs</span>
              <FileText className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Knowledge Sources</CardTitle>
            <CardDescription>Files and resources this bot has access to</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Knowledge
          </Button>
        </CardHeader>
        <CardContent>
          {bot.bot_knowledge && bot.bot_knowledge.length > 0 ? (
            <div className="space-y-4">
              {bot.bot_knowledge.map((knowledge) => (
                <div key={knowledge.id} className="flex items-start p-3 rounded-md bg-secondary/50">
                  <FileText className="h-5 w-5 mr-3 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium">{knowledge.file_name || "Unnamed file"}</h4>
                    <p className="text-sm text-muted-foreground">{knowledge.file_type || "Unknown type"}</p>
                    {knowledge.summary && <p className="text-sm mt-1">{knowledge.summary}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Added on {new Date(knowledge.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border rounded-lg">
              <p className="text-muted-foreground">No knowledge sources added yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

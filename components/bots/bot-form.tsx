"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AgenticBot } from "@/types/database"

interface BotFormProps {
  initialData?: Partial<AgenticBot>
  isEditing?: boolean
}

export function BotForm({ initialData, isEditing = false }: BotFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<AgenticBot>>({
    name: "",
    description: "",
    role: "",
    skills: [],
    confidence_level: "medium",
    active: true,
    ...initialData,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim())
    setFormData((prev) => ({ ...prev, skills }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEditing ? `/api/bots/${initialData?.id}` : "/api/bots"
      const method = isEditing ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save bot")
      }

      const data = await response.json()
      router.push(`/bots/${data.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error saving bot:", error)
      alert("Failed to save bot")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Bot" : "Create New Bot"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your AI agent bot details"
              : "Configure a new AI agent bot for your intelligence network"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bot Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="e.g., FinanceAnalyst"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Describe what this bot does..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
              placeholder="e.g., Analyst, Router, Scraper"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills?.join(", ") || ""}
              onChange={handleSkillsChange}
              placeholder="e.g., NLP, Parser, Watcher, Summarizer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confidence_level">Confidence Level</Label>
            <select
              id="confidence_level"
              name="confidence_level"
              value={formData.confidence_level || "medium"}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-input bg-background"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="very_high">Very High</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
              className="rounded border-input"
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Bot" : "Create Bot"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

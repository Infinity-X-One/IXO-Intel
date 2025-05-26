"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AgenticBot } from "@/types/database"

export function PredictionForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [bots, setBots] = useState<AgenticBot[]>([])
  const [loadingBots, setLoadingBots] = useState(true)

  const [formData, setFormData] = useState({
    asset: "",
    signal_type: "MARKET",
    bot_id: "",
    predicted_direction: "",
    confidence_score: "",
    risk_score: "",
    reason_summary: "",
    market_data: "",
  })

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await fetch("/api/bots")
        if (!response.ok) throw new Error("Failed to fetch bots")
        const data = await response.json()
        setBots(data)

        // Set default bot if available
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, bot_id: data[0].id }))
        }
      } catch (err) {
        console.error("Error loading bots:", err)
      } finally {
        setLoadingBots(false)
      }
    }

    fetchBots()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Format data for API
      const apiData = {
        ...formData,
        confidence_score: formData.confidence_score ? Number.parseFloat(formData.confidence_score) : undefined,
        risk_score: formData.risk_score ? Number.parseFloat(formData.risk_score) : undefined,
      }

      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error("Failed to create prediction")
      }

      const data = await response.json()
      router.push(`/predictions/${data.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error creating prediction:", error)
      alert("Failed to create prediction")
    } finally {
      setLoading(false)
    }
  }

  const handleAIGenerate = () => {
    // In a real app, this would be handled by the API
    // For now, we'll just submit the form without manual predictions
    // and let the backend generate them with Groq
    setFormData((prev) => ({
      ...prev,
      predicted_direction: "",
      confidence_score: "",
      risk_score: "",
      reason_summary: "",
    }))
  }

  if (loadingBots) {
    return <div className="flex justify-center p-8">Loading bots...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create New Prediction</CardTitle>
          <CardDescription>
            Generate a new market prediction using AI or enter your own prediction details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset">Asset Symbol *</Label>
            <Input
              id="asset"
              name="asset"
              value={formData.asset}
              onChange={handleChange}
              placeholder="e.g., BTC, AAPL, EUR/USD"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signal_type">Signal Type</Label>
            <select
              id="signal_type"
              name="signal_type"
              value={formData.signal_type}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-input bg-background"
            >
              <option value="MARKET">Market</option>
              <option value="TECHNICAL">Technical</option>
              <option value="FUNDAMENTAL">Fundamental</option>
              <option value="SENTIMENT">Sentiment</option>
              <option value="NEWS">News-based</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot_id">Prediction Bot *</Label>
            <select
              id="bot_id"
              name="bot_id"
              value={formData.bot_id}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-input bg-background"
              required
            >
              <option value="" disabled>
                Select a bot
              </option>
              {bots.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name} ({bot.role || "No role"})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="market_data">Market Data (for AI generation)</Label>
            <Textarea
              id="market_data"
              name="market_data"
              value={formData.market_data}
              onChange={handleChange}
              placeholder="Enter recent market data, price information, or other relevant details..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This data will be used by the AI to generate a prediction. If left empty, the AI will use generic data.
            </p>
          </div>

          <div className="border p-4 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Manual Prediction (Optional)</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAIGenerate}>
                Use AI Generation
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="predicted_direction">Predicted Direction</Label>
              <select
                id="predicted_direction"
                name="predicted_direction"
                value={formData.predicted_direction}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-input bg-background"
              >
                <option value="">Let AI decide</option>
                <option value="UP">UP</option>
                <option value="DOWN">DOWN</option>
                <option value="NEUTRAL">NEUTRAL</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confidence_score">Confidence Score (0-1)</Label>
              <Input
                id="confidence_score"
                name="confidence_score"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.confidence_score}
                onChange={handleChange}
                placeholder="e.g., 0.85"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk_score">Risk Score (0-1)</Label>
              <Input
                id="risk_score"
                name="risk_score"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.risk_score}
                onChange={handleChange}
                placeholder="e.g., 0.4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason_summary">Reason Summary</Label>
              <Textarea
                id="reason_summary"
                name="reason_summary"
                value={formData.reason_summary}
                onChange={handleChange}
                placeholder="Explain the reasoning behind this prediction..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Prediction"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

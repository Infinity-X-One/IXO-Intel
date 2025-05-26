"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Minus, TrendingUp, Bot } from "lucide-react"
import Link from "next/link"

interface Prediction {
  id: string
  asset_symbol: string
  signal_type: string | null
  prediction_direction: string | null
  confidence_score: number | null
  risk_score: number | null
  reasons: string | null
  prediction_timestamp: string
  agent_id: string | null
  outcome: string | null
  accuracy: number | null
  delta_error: number | null
  agentic_bots?: {
    id: string
    name: string
  } | null
}

export function PredictionList() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch("/api/predictions")
        if (!response.ok) throw new Error("Failed to fetch predictions")
        const data = await response.json()
        setPredictions(data)
      } catch (err) {
        setError("Error loading predictions")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
  }, [])

  if (loading) {
    return <div className="flex justify-center p-8">Loading predictions...</div>
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>
  }

  const getDirectionIcon = (direction: string | null) => {
    if (!direction) return <Minus className="h-4 w-4" />

    switch (direction.toUpperCase()) {
      case "UP":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "DOWN":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Predictions</h1>
        <Link href="/predictions/new">
          <Button className="gap-2">
            <TrendingUp className="h-4 w-4" />
            New Prediction
          </Button>
        </Link>
      </div>

      {predictions.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">No predictions found. Create your first prediction to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((prediction) => (
            <Card key={prediction.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {prediction.asset_symbol}
                      {getDirectionIcon(prediction.prediction_direction)}
                    </CardTitle>
                    <CardDescription>{prediction.signal_type || "MARKET"} Signal</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      !prediction.outcome
                        ? "text-yellow-400 border-yellow-400"
                        : prediction.outcome === prediction.prediction_direction
                          ? "text-green-500 border-green-500"
                          : "text-red-400 border-red-400"
                    }
                  >
                    {!prediction.outcome
                      ? "Pending"
                      : prediction.outcome === prediction.prediction_direction
                        ? "Correct"
                        : "Incorrect"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Direction:</span>
                    <span className="flex items-center gap-1">
                      {getDirectionIcon(prediction.prediction_direction)}
                      {prediction.prediction_direction || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span>
                      {prediction.confidence_score ? `${(prediction.confidence_score * 100).toFixed(1)}%` : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk:</span>
                    <span>{prediction.risk_score ? `${(prediction.risk_score * 100).toFixed(1)}%` : "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created by:</span>
                    <span className="flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      {prediction.agentic_bots?.name || "Unknown Bot"}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      {new Date(prediction.prediction_timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/predictions/${prediction.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

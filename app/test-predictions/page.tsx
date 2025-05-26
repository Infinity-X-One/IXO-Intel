"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, TestTube, CheckCircle, XCircle } from "lucide-react"

interface TestResult {
  success: boolean
  data?: any
  error?: string
  timestamp: Date
}

export default function TestPredictionsPage() {
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [formData, setFormData] = useState({
    asset: "BTC",
    signal_type: "MARKET",
    bot_id: "",
    market_data:
      "Bitcoin is showing strong bullish momentum with recent price action above $45,000. Trading volume has increased significantly over the past 24 hours.",
    predicted_direction: "",
    confidence_score: "",
    risk_score: "",
    reason_summary: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addTestResult = (result: TestResult) => {
    setTestResults((prev) => [result, ...prev].slice(0, 10)) // Keep only last 10 results
  }

  const testGetPredictions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/predictions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      addTestResult({
        success: true,
        data: { message: `Retrieved ${data.length} predictions`, predictions: data.slice(0, 3) },
        timestamp: new Date(),
      })
    } catch (error) {
      addTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      })
    } finally {
      setLoading(false)
    }
  }

  const testCreatePrediction = async () => {
    setLoading(true)
    try {
      // First, let's get available bots
      const botsResponse = await fetch("/api/bots")
      if (!botsResponse.ok) {
        throw new Error("Failed to fetch bots")
      }
      const bots = await botsResponse.json()

      if (bots.length === 0) {
        throw new Error("No bots available. Please create a bot first.")
      }

      // Use the first available bot if no bot_id is specified
      const botId = formData.bot_id || bots[0].id

      const requestData = {
        asset: formData.asset,
        signal_type: formData.signal_type,
        bot_id: botId,
        market_data: formData.market_data,
        // Include manual prediction data if provided
        ...(formData.predicted_direction && {
          predicted_direction: formData.predicted_direction,
          confidence_score: formData.confidence_score ? Number.parseFloat(formData.confidence_score) : undefined,
          risk_score: formData.risk_score ? Number.parseFloat(formData.risk_score) : undefined,
          reason_summary: formData.reason_summary,
        }),
      }

      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      addTestResult({
        success: true,
        data: { message: "Prediction created successfully", prediction: data },
        timestamp: new Date(),
      })
    } catch (error) {
      addTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      })
    } finally {
      setLoading(false)
    }
  }

  const testAIGeneration = async () => {
    setLoading(true)
    try {
      const requestData = {
        asset: formData.asset,
        botContext: "You are an expert financial analyst with 10+ years of experience in cryptocurrency markets.",
        marketData: formData.market_data,
      }

      const response = await fetch("/api/predictions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      addTestResult({
        success: true,
        data: { message: "AI prediction generated successfully", prediction: data },
        timestamp: new Date(),
      })
    } catch (error) {
      addTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      })
    } finally {
      setLoading(false)
    }
  }

  const runQuickTests = async () => {
    setLoading(true)

    // Test 1: GET predictions
    await testGetPredictions()

    // Wait a bit between tests
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Test 2: AI Generation
    await testAIGeneration()

    // Wait a bit between tests
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Test 3: Create prediction (if we have the data)
    if (formData.asset && formData.market_data) {
      await testCreatePrediction()
    }

    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TestTube className="h-6 w-6 text-neon" />
          Test Predictions API
        </h1>
        <Button onClick={runQuickTests} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
          Run Quick Tests
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Configure the test data for API requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset Symbol</Label>
              <Input
                id="asset"
                name="asset"
                value={formData.asset}
                onChange={handleChange}
                placeholder="e.g., BTC, AAPL, EUR/USD"
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
              <Label htmlFor="bot_id">Bot ID (optional - will use first available bot)</Label>
              <Input
                id="bot_id"
                name="bot_id"
                value={formData.bot_id}
                onChange={handleChange}
                placeholder="Leave empty to use first available bot"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market_data">Market Data</Label>
              <Textarea
                id="market_data"
                name="market_data"
                value={formData.market_data}
                onChange={handleChange}
                placeholder="Enter market data for AI analysis..."
                rows={3}
              />
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Manual Prediction Data (Optional)</h3>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="confidence_score">Confidence (0-1)</Label>
                  <Input
                    id="confidence_score"
                    name="confidence_score"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.confidence_score}
                    onChange={handleChange}
                    placeholder="0.85"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="risk_score">Risk (0-1)</Label>
                  <Input
                    id="risk_score"
                    name="risk_score"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.risk_score}
                    onChange={handleChange}
                    placeholder="0.4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason_summary">Reason Summary</Label>
                <Textarea
                  id="reason_summary"
                  name="reason_summary"
                  value={formData.reason_summary}
                  onChange={handleChange}
                  placeholder="Reasoning for the prediction..."
                  rows={2}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={testGetPredictions} disabled={loading} variant="outline" className="w-full">
                Test GET /api/predictions
              </Button>
              <Button onClick={testAIGeneration} disabled={loading} variant="outline" className="w-full">
                Test AI Generation
              </Button>
              <Button onClick={testCreatePrediction} disabled={loading} className="w-full">
                Test POST /api/predictions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Results from API tests (showing last 10)</CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                No test results yet. Run some tests to see results here.
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "Success" : "Error"}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{result.timestamp.toLocaleTimeString()}</span>
                    </div>

                    {result.success && result.data && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-green-600">{result.data.message}</p>
                        <pre className="text-xs bg-secondary p-2 rounded overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}

                    {!result.success && result.error && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-red-600">Error:</p>
                        <p className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded text-red-700 dark:text-red-300">
                          {result.error}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sample Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Sample API Requests</CardTitle>
          <CardDescription>Example requests you can use to test the API manually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">GET /api/predictions</h3>
            <pre className="text-xs bg-secondary p-3 rounded overflow-x-auto">
              {`curl -X GET http://localhost:3000/api/predictions \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">POST /api/predictions (AI Generated)</h3>
            <pre className="text-xs bg-secondary p-3 rounded overflow-x-auto">
              {`curl -X POST http://localhost:3000/api/predictions \\
  -H "Content-Type: application/json" \\
  -d '{
    "asset": "BTC",
    "signal_type": "MARKET",
    "bot_id": "your-bot-id",
    "market_data": "Bitcoin showing bullish momentum above $45,000"
  }'`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">POST /api/predictions (Manual)</h3>
            <pre className="text-xs bg-secondary p-3 rounded overflow-x-auto">
              {`curl -X POST http://localhost:3000/api/predictions \\
  -H "Content-Type: application/json" \\
  -d '{
    "asset": "BTC",
    "signal_type": "TECHNICAL",
    "bot_id": "your-bot-id",
    "predicted_direction": "UP",
    "confidence_score": 0.85,
    "risk_score": 0.3,
    "reason_summary": "Strong technical indicators suggest upward movement"
  }'`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">POST /api/predictions/generate (AI Only)</h3>
            <pre className="text-xs bg-secondary p-3 rounded overflow-x-auto">
              {`curl -X POST http://localhost:3000/api/predictions/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "asset": "BTC",
    "botContext": "Expert crypto analyst",
    "marketData": "Recent price action and volume analysis"
  }'`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

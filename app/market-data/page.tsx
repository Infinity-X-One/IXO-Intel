"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, TrendingDown, Minus, Plus, X } from "lucide-react"

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: string
  source: string
}

export default function MarketDataPage() {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [newSymbol, setNewSymbol] = useState("")
  const [watchlist, setWatchlist] = useState<string[]>(["BTC", "ETH", "AAPL", "GOOGL", "TSLA"])

  useEffect(() => {
    fetchMarketData()
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [watchlist])

  const fetchMarketData = async () => {
    try {
      const response = await fetch(`/api/market-data/cache?symbols=${watchlist.join(",")}&maxAge=300`)
      if (!response.ok) throw new Error("Failed to fetch market data")
      const data = await response.json()
      setMarketData(data)
    } catch (error) {
      console.error("Error fetching market data:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    try {
      const response = await fetch("/api/market-data/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols: watchlist }),
      })
      if (!response.ok) throw new Error("Failed to refresh data")
      await fetchMarketData()
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const addToWatchlist = () => {
    if (newSymbol && !watchlist.includes(newSymbol.toUpperCase())) {
      setWatchlist([...watchlist, newSymbol.toUpperCase()])
      setNewSymbol("")
    }
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s !== symbol))
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500"
    if (change < 0) return "text-red-500"
    return "text-gray-500"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] p-4">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-neon" />
          <p className="text-lg">Loading market data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-optimized header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold neon-text">Market Data</h1>
          <Button
            onClick={refreshData}
            disabled={refreshing}
            className="bg-black border border-neon text-neon hover:bg-neon hover:text-black transition-all duration-200 min-h-[44px] w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Mobile-optimized watchlist management */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">Watchlist</CardTitle>
            <CardDescription className="text-sm">Manage your tracked symbols</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mobile-friendly input */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter symbol (BTC, AAPL...)"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addToWatchlist()}
                className="flex-1 text-base min-h-[44px]" // Prevent zoom on iOS
              />
              <Button
                onClick={addToWatchlist}
                className="bg-black border border-neon text-neon hover:bg-neon hover:text-black min-h-[44px] w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Symbol
              </Button>
            </div>

            {/* Mobile-optimized badge grid */}
            <div className="flex flex-wrap gap-2">
              {watchlist.map((symbol) => (
                <Badge
                  key={symbol}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-2 text-sm min-h-[36px]"
                >
                  <span className="font-medium">{symbol}</span>
                  <button
                    onClick={() => removeFromWatchlist(symbol)}
                    className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100/10 transition-colors"
                    aria-label={`Remove ${symbol}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile-optimized market data grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {marketData.map((data) => (
            <Card key={`${data.symbol}-${data.source}`} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="font-bold">{data.symbol}</span>
                      {getChangeIcon(data.change)}
                    </CardTitle>
                    <CardDescription className="text-xs">{data.source}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs bg-neon/10 text-neon border-neon">
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Price display - mobile optimized */}
                <div className="space-y-1">
                  <div className="text-xl md:text-2xl font-bold tracking-tight">
                    $
                    {data.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: data.price < 1 ? 6 : 2,
                    })}
                  </div>

                  {/* Change indicators */}
                  <div className={`flex items-center gap-2 text-sm ${getChangeColor(data.change)}`}>
                    <span className="font-medium">
                      {data.change >= 0 ? "+" : ""}${Math.abs(data.change).toFixed(2)}
                    </span>
                    <span className="font-medium">
                      ({data.changePercent >= 0 ? "+" : ""}
                      {data.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                {/* Additional info */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Volume:</span>
                    <span className="font-medium">{data.volume?.toLocaleString() || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span className="font-medium">{new Date(data.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state - mobile optimized */}
        {marketData.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No Market Data</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Add symbols to your watchlist to start tracking real-time market data.
                  </p>
                </div>
                <Button
                  onClick={() => document.querySelector("input")?.focus()}
                  className="bg-black border border-neon text-neon hover:bg-neon hover:text-black"
                >
                  Add Your First Symbol
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
